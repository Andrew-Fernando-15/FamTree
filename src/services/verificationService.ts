import { supabase } from '../lib/supabase';
import type { ContactChannel } from '../types/database';

export interface SendCodeResult {
  success: boolean;
  recordId?: string;
  previewCode?: string; // Provided in Alpha mode for seamless testing
  error?: string;
  cooldownRemaining?: number;
}

export interface VerifyCodeResult {
  success: boolean;
  error?: string;
  attemptsLeft?: number;
}

/**
 * Computes a SHA-256 hash string for an OTP code using the Web Crypto API.
 */
export async function hashVerificationCode(code: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(code.trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generates a cryptographically secure 6-digit numeric OTP string.
 */
export function generateOtpCode(): string {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  const code = 100000 + (array[0] % 900000);
  return code.toString();
}

/**
 * Generates and stores a single-use verification code in the verification_records table.
 */
export async function sendVerificationCode(
  targetValue: string,
  channel: ContactChannel
): Promise<SendCodeResult> {
  const cleanTarget = targetValue.trim().toLowerCase();

  if (!cleanTarget) {
    return { success: false, error: 'Destination phone number or email is required.' };
  }

  try {
    // 1. Invalidate any existing active codes for this target and channel
    await supabase
      .from('verification_records')
      .update({ is_used: true })
      .eq('target_value', cleanTarget)
      .eq('contact_channel', channel)
      .eq('is_used', false);

    // 2. Generate 6-digit code and SHA-256 hash
    const rawCode = generateOtpCode();
    const codeHash = await hashVerificationCode(rawCode);

    // 3. Expiration set to 10 minutes from now (TRD §7)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // 4. Insert new record into verification_records
    const { data, error } = await supabase
      .from('verification_records')
      .insert({
        contact_channel: channel,
        target_value: cleanTarget,
        code_hash: codeHash,
        attempts: 0,
        is_used: false,
        expires_at: expiresAt,
      })
      .select('id')
      .single();

    if (error) {
      console.error('[verificationService] Error inserting verification record:', error);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      recordId: data.id,
      previewCode: rawCode, // Surfaced in Alpha mode for owner/tester convenience
    };
  } catch (err) {
    console.error('[verificationService] Unexpected error sending code:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to send verification code.',
    };
  }
}

/**
 * Validates a user-submitted verification code against the hashed record in Supabase.
 */
export async function verifyCode(
  targetValue: string,
  channel: ContactChannel,
  inputCode: string
): Promise<VerifyCodeResult> {
  const cleanTarget = targetValue.trim().toLowerCase();
  const cleanCode = inputCode.trim();

  if (!cleanCode || cleanCode.length !== 6) {
    return { success: false, error: 'Please enter a valid 6-digit verification code.' };
  }

  try {
    const inputHash = await hashVerificationCode(cleanCode);

    // 1. Fetch latest active, non-expired, non-used record
    const { data: record, error } = await supabase
      .from('verification_records')
      .select('*')
      .eq('target_value', cleanTarget)
      .eq('contact_channel', channel)
      .eq('is_used', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('[verificationService] Error fetching verification record:', error);
      return { success: false, error: error.message };
    }

    if (!record) {
      return {
        success: false,
        error: 'Verification code not found or expired. Please request a new code.',
      };
    }

    // 2. Check maximum attempt threshold (5 attempts per code)
    if (record.attempts >= 5) {
      await supabase
        .from('verification_records')
        .update({ is_used: true })
        .eq('id', record.id);

      return {
        success: false,
        attemptsLeft: 0,
        error: 'Too many incorrect attempts. This code has been invalidated. Please request a new code.',
      };
    }

    // 3. Match SHA-256 hash
    if (record.code_hash === inputHash) {
      // Mark as used
      await supabase
        .from('verification_records')
        .update({ is_used: true, attempts: record.attempts + 1 })
        .eq('id', record.id);

      return { success: true };
    } else {
      const updatedAttempts = record.attempts + 1;
      const attemptsLeft = Math.max(0, 5 - updatedAttempts);

      await supabase
        .from('verification_records')
        .update({
          attempts: updatedAttempts,
          is_used: attemptsLeft === 0,
        })
        .eq('id', record.id);

      return {
        success: false,
        attemptsLeft,
        error:
          attemptsLeft > 0
            ? `Incorrect code. ${attemptsLeft} attempt(s) remaining.`
            : 'Too many failed attempts. Code invalidated. Please request a new code.',
      };
    }
  } catch (err) {
    console.error('[verificationService] Unexpected error verifying code:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Verification failed.',
    };
  }
}
