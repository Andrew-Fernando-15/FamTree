import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { AgeCategory, ChannelVerificationStatus } from './types';
import {
  sendVerificationCode,
  verifyCode,
} from '../../services/verificationService';
import './auth.css';

interface VerificationStepProps {
  phone: string;
  primaryEmail: string;
  ageCategory: AgeCategory;
  onAllVerified: () => void;
  onBack: () => void;
}

export const VerificationStep: React.FC<VerificationStepProps> = ({
  phone,
  primaryEmail,
  ageCategory,
  onAllVerified,
  onBack,
}) => {
  // Determine required channels based on FR-03 & FR-04
  const isEmailRequired =
    ageCategory === '15_to_49' || (ageCategory === '50_plus' && primaryEmail.trim().length > 0);

  // Active channel view ('phone' or 'email')
  const [activeTab, setActiveTab] = useState<'phone' | 'email'>('phone');

  // Phone status & state
  const [phoneStatus, setPhoneStatus] = useState<ChannelVerificationStatus>({
    isVerified: false,
    isSending: false,
    isVerifying: false,
    codeSent: false,
  });
  const [phoneOtp, setPhoneOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [phoneCooldown, setPhoneCooldown] = useState<number>(0);
  const [phoneExpiry, setPhoneExpiry] = useState<number>(0);

  // Email status & state
  const [emailStatus, setEmailStatus] = useState<ChannelVerificationStatus>({
    isVerified: false,
    isSending: false,
    isVerifying: false,
    codeSent: false,
  });
  const [emailOtp, setEmailOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [emailCooldown, setEmailCooldown] = useState<number>(0);
  const [emailExpiry, setEmailExpiry] = useState<number>(0);

  // Refs for OTP input navigation
  const phoneInputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const emailInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Dispatch Code handler
  const handleSendCode = useCallback(
    async (channel: 'phone' | 'email') => {
      const target = channel === 'phone' ? phone : primaryEmail;
      const setStatus = channel === 'phone' ? setPhoneStatus : setEmailStatus;
      const setCooldown = channel === 'phone' ? setPhoneCooldown : setEmailCooldown;
      const setExpiry = channel === 'phone' ? setPhoneExpiry : setEmailExpiry;
      const setOtp = channel === 'phone' ? setPhoneOtp : setEmailOtp;

      setStatus((prev) => ({ ...prev, isSending: true, error: undefined }));
      setOtp(['', '', '', '', '', '']);

      const res = await sendVerificationCode(target, channel);

      if (res.success) {
        setStatus({
          isVerified: false,
          isSending: false,
          isVerifying: false,
          codeSent: true,
          previewCode: res.previewCode,
          error: undefined,
        });
        setCooldown(60); // 60s resend cooldown
        setExpiry(600); // 10m code validity
      } else {
        setStatus((prev) => ({
          ...prev,
          isSending: false,
          error: res.error || 'Failed to send code. Please try again.',
        }));
      }
    },
    [phone, primaryEmail]
  );

  // Cooldown & Expiry countdown timers
  useEffect(() => {
    const timer = setInterval(() => {
      setPhoneCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      setEmailCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      setPhoneExpiry((prev) => (prev > 0 ? prev - 1 : 0));
      setEmailExpiry((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // OTP Input Change
  const handleOtpChange = (
    channel: 'phone' | 'email',
    index: number,
    value: string
  ) => {
    const digitsOnly = value.replace(/\D/g, '');
    const currentOtp = channel === 'phone' ? [...phoneOtp] : [...emailOtp];
    const setOtp = channel === 'phone' ? setPhoneOtp : setEmailOtp;
    const inputsRef = channel === 'phone' ? phoneInputsRef : emailInputsRef;

    if (digitsOnly.length > 1) {
      // Pasted multiple digits
      const pastedDigits = digitsOnly.slice(0, 6).split('');
      for (let i = 0; i < 6; i++) {
        currentOtp[i] = pastedDigits[i] || '';
      }
      setOtp(currentOtp);
      const nextFocus = Math.min(pastedDigits.length, 5);
      inputsRef.current[nextFocus]?.focus();
      return;
    }

    currentOtp[index] = digitsOnly;
    setOtp(currentOtp);

    // Auto-advance
    if (digitsOnly && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  // OTP Backspace navigation
  const handleKeyDown = (
    channel: 'phone' | 'email',
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    const currentOtp = channel === 'phone' ? phoneOtp : emailOtp;
    const inputsRef = channel === 'phone' ? phoneInputsRef : emailInputsRef;

    if (e.key === 'Backspace' && !currentOtp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // Verification submit
  const handleVerify = async (channel: 'phone' | 'email') => {
    const target = channel === 'phone' ? phone : primaryEmail;
    const otp = (channel === 'phone' ? phoneOtp : emailOtp).join('');
    const setStatus = channel === 'phone' ? setPhoneStatus : setEmailStatus;

    if (otp.length !== 6) {
      setStatus((prev) => ({
        ...prev,
        error: 'Please enter all 6 digits of the verification code.',
      }));
      return;
    }

    setStatus((prev) => ({ ...prev, isVerifying: true, error: undefined }));

    const res = await verifyCode(target, channel, otp);

    if (res.success) {
      setStatus((prev) => ({
        ...prev,
        isVerified: true,
        isVerifying: false,
        error: undefined,
      }));

      // If phone just verified and email is required, switch to email tab automatically
      if (channel === 'phone' && isEmailRequired && !emailStatus.isVerified) {
        setActiveTab('email');
        if (!emailStatus.codeSent) {
          await handleSendCode('email');
        }
      }
    } else {
      setStatus((prev) => ({
        ...prev,
        isVerifying: false,
        error: res.error,
        attemptsLeft: res.attemptsLeft,
      }));
    }
  };

  // Auto-fill test code for Alpha development
  const handleAutofill = (channel: 'phone' | 'email') => {
    const preview = channel === 'phone' ? phoneStatus.previewCode : emailStatus.previewCode;
    if (!preview) return;

    const digits = preview.split('');
    if (channel === 'phone') {
      setPhoneOtp(digits);
      phoneInputsRef.current[5]?.focus();
    } else {
      setEmailOtp(digits);
      emailInputsRef.current[5]?.focus();
    }
  };

  const isAllComplete = phoneStatus.isVerified && (!isEmailRequired || emailStatus.isVerified);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="verification-step-container">
      <p className="auth-subtitle" style={{ marginTop: '0' }}>
        Verify required contact channels (FR-04). Single-use codes expire in 10 minutes.
      </p>

      {/* Channel Switcher Tabs */}
      <div className="verification-tabs-bar" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'phone'}
          className={`verification-tab-btn ${activeTab === 'phone' ? 'active' : ''} ${
            phoneStatus.isVerified ? 'verified' : ''
          }`}
          onClick={() => setActiveTab('phone')}
        >
          <span>📱 Mobile Phone</span>
          {phoneStatus.isVerified ? (
            <span className="tab-status-check">✓ Verified</span>
          ) : (
            <span className="tab-status-pending">Required</span>
          )}
        </button>

        {isEmailRequired && (
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'email'}
            className={`verification-tab-btn ${activeTab === 'email' ? 'active' : ''} ${
              emailStatus.isVerified ? 'verified' : ''
            }`}
            onClick={() => {
              setActiveTab('email');
              if (!emailStatus.codeSent) {
                handleSendCode('email');
              }
            }}
          >
            <span>✉️ Primary Email</span>
            {emailStatus.isVerified ? (
              <span className="tab-status-check">✓ Verified</span>
            ) : (
              <span className="tab-status-pending">Required</span>
            )}
          </button>
        )}
      </div>

      {/* ALL CHANNELS VERIFIED BANNER */}
      {isAllComplete ? (
        <div className="auth-alert auth-alert-success" role="status" style={{ marginTop: 'var(--space-3)' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <div>
            <strong>All Required Channels Verified! (FR-04)</strong>
            <p style={{ marginTop: '3px', fontSize: '0.8125rem' }}>
              Your phone ({phone}) {isEmailRequired ? `and email (${primaryEmail})` : ''} have been
              cryptographically verified in Supabase records.
            </p>
          </div>
        </div>
      ) : null}

      {/* ACTIVE TAB: PHONE VERIFICATION */}
      {activeTab === 'phone' && (
        <div className="verification-card" style={{ marginTop: 'var(--space-3)' }}>
          <div className="verification-card-header">
            <div>
              <span className="channel-indicator">Channel 1: Phone</span>
              <h3 className="channel-target">{phone}</h3>
            </div>
            {phoneStatus.isVerified && (
              <span className="badge-verified-pill">✓ Verified</span>
            )}
          </div>

          {phoneStatus.isVerified ? (
            <div className="channel-verified-body">
              <p className="text-muted-sm">
                Phone number has been successfully verified with single-use OTP.
              </p>
              {isEmailRequired && !emailStatus.isVerified && (
                <button
                  type="button"
                  className="btn-primary"
                  style={{ width: '100%', marginTop: 'var(--space-3)' }}
                  onClick={() => {
                    setActiveTab('email');
                    if (!emailStatus.codeSent) {
                      handleSendCode('email');
                    }
                  }}
                >
                  Continue to Email Verification →
                </button>
              )}
            </div>
          ) : !phoneStatus.codeSent ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-3) 0' }}>
              <p className="text-muted-sm" style={{ marginBottom: 'var(--space-4)' }}>
                We will dispatch a secure single-use 6-digit verification code to <strong>{phone}</strong> (FR-04).
              </p>
              {phoneStatus.error && (
                <div className="auth-alert auth-alert-error" role="alert" style={{ marginBottom: 'var(--space-3)' }}>
                  <span>{phoneStatus.error}</span>
                </div>
              )}
              <button
                type="button"
                className="btn-primary"
                style={{ width: '100%' }}
                onClick={() => handleSendCode('phone')}
                disabled={phoneStatus.isSending}
                id="btn-send-phone-code"
              >
                {phoneStatus.isSending ? 'Sending Verification Code...' : '📱 Send 6-Digit Code to Phone'}
              </button>
            </div>
          ) : (
            <>
              {/* Alpha Test Mode Simulator Banner */}
              {phoneStatus.previewCode && (
                <div className="alpha-test-banner">
                  <div className="alpha-tag">Alpha Dev Simulation</div>
                  <div className="alpha-body">
                    <span>
                      Simulated SMS code for <strong>{phone}</strong>:
                    </span>
                    <strong className="code-pill">{phoneStatus.previewCode}</strong>
                    <button
                      type="button"
                      className="btn-autofill"
                      onClick={() => handleAutofill('phone')}
                      title="Quick test one-click autofill"
                    >
                      Auto-fill
                    </button>
                  </div>
                </div>
              )}

              {/* Error Message Alert */}
              {phoneStatus.error && (
                <div className="auth-alert auth-alert-error" role="alert" style={{ marginTop: 'var(--space-2)' }}>
                  <span>{phoneStatus.error}</span>
                </div>
              )}

              {/* 6-digit OTP Inputs */}
              <div className="otp-input-group">
                <label className="form-label" style={{ textAlign: 'center', marginBottom: '8px' }}>
                  Enter 6-Digit Verification Code
                </label>
                <div className="otp-boxes-row">
                  {phoneOtp.map((digit, index) => (
                    <input
                      key={`phone-otp-${index}`}
                      ref={(el) => {
                        phoneInputsRef.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className="otp-box"
                      value={digit}
                      onChange={(e) => handleOtpChange('phone', index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown('phone', index, e)}
                      autoComplete="one-time-code"
                      id={`phone-otp-box-${index}`}
                    />
                  ))}
                </div>
              </div>

              {/* Countdown & Resend */}
              <div className="otp-meta-row">
                <span className="text-muted-xs">
                  {phoneExpiry > 0 ? `Code expires in: ${formatTimer(phoneExpiry)}` : 'Code expired'}
                </span>
                <button
                  type="button"
                  className="auth-text-link"
                  style={{ fontSize: '0.75rem' }}
                  disabled={phoneCooldown > 0 || phoneStatus.isSending}
                  onClick={() => handleSendCode('phone')}
                >
                  {phoneCooldown > 0
                    ? `Resend in ${phoneCooldown}s`
                    : phoneStatus.isSending
                    ? 'Sending...'
                    : 'Resend Code'}
                </button>
              </div>

              {/* Verify Button */}
              <button
                type="button"
                className="btn-primary"
                style={{ width: '100%', marginTop: 'var(--space-4)' }}
                onClick={() => handleVerify('phone')}
                disabled={phoneStatus.isVerifying || phoneOtp.join('').length !== 6}
                id="btn-verify-phone"
              >
                {phoneStatus.isVerifying ? 'Verifying...' : 'Verify Phone Number'}
              </button>
            </>
          )}
        </div>
      )}

      {/* ACTIVE TAB: EMAIL VERIFICATION */}
      {activeTab === 'email' && isEmailRequired && (
        <div className="verification-card" style={{ marginTop: 'var(--space-3)' }}>
          <div className="verification-card-header">
            <div>
              <span className="channel-indicator">Channel 2: Email</span>
              <h3 className="channel-target">{primaryEmail}</h3>
            </div>
            {emailStatus.isVerified && (
              <span className="badge-verified-pill">✓ Verified</span>
            )}
          </div>

          {emailStatus.isVerified ? (
            <div className="channel-verified-body">
              <p className="text-muted-sm">
                Primary email address has been successfully verified.
              </p>
              {!phoneStatus.isVerified && (
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ width: '100%', marginTop: 'var(--space-3)' }}
                  onClick={() => setActiveTab('phone')}
                >
                  ← Complete Phone Verification
                </button>
              )}
            </div>
          ) : !emailStatus.codeSent ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-3) 0' }}>
              <p className="text-muted-sm" style={{ marginBottom: 'var(--space-4)' }}>
                We will dispatch a secure single-use 6-digit verification code to <strong>{primaryEmail}</strong> (FR-04).
              </p>
              {emailStatus.error && (
                <div className="auth-alert auth-alert-error" role="alert" style={{ marginBottom: 'var(--space-3)' }}>
                  <span>{emailStatus.error}</span>
                </div>
              )}
              <button
                type="button"
                className="btn-primary"
                style={{ width: '100%' }}
                onClick={() => handleSendCode('email')}
                disabled={emailStatus.isSending}
                id="btn-send-email-code"
              >
                {emailStatus.isSending ? 'Sending Verification Code...' : '✉️ Send 6-Digit Code to Email'}
              </button>
            </div>
          ) : (
            <>
              {/* Alpha Test Mode Simulator Banner */}
              {emailStatus.previewCode && (
                <div className="alpha-test-banner">
                  <div className="alpha-tag">Alpha Dev Simulation</div>
                  <div className="alpha-body">
                    <span>
                      Simulated Email code for <strong>{primaryEmail}</strong>:
                    </span>
                    <strong className="code-pill">{emailStatus.previewCode}</strong>
                    <button
                      type="button"
                      className="btn-autofill"
                      onClick={() => handleAutofill('email')}
                      title="Quick test one-click autofill"
                    >
                      Auto-fill
                    </button>
                  </div>
                </div>
              )}

              {/* Error Message Alert */}
              {emailStatus.error && (
                <div className="auth-alert auth-alert-error" role="alert" style={{ marginTop: 'var(--space-2)' }}>
                  <span>{emailStatus.error}</span>
                </div>
              )}

              {/* 6-digit OTP Inputs */}
              <div className="otp-input-group">
                <label className="form-label" style={{ textAlign: 'center', marginBottom: '8px' }}>
                  Enter 6-Digit Email Verification Code
                </label>
                <div className="otp-boxes-row">
                  {emailOtp.map((digit, index) => (
                    <input
                      key={`email-otp-${index}`}
                      ref={(el) => {
                        emailInputsRef.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className="otp-box"
                      value={digit}
                      onChange={(e) => handleOtpChange('email', index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown('email', index, e)}
                      autoComplete="one-time-code"
                      id={`email-otp-box-${index}`}
                    />
                  ))}
                </div>
              </div>

              {/* Countdown & Resend */}
              <div className="otp-meta-row">
                <span className="text-muted-xs">
                  {emailExpiry > 0 ? `Code expires in: ${formatTimer(emailExpiry)}` : 'Code expired'}
                </span>
                <button
                  type="button"
                  className="auth-text-link"
                  style={{ fontSize: '0.75rem' }}
                  disabled={emailCooldown > 0 || emailStatus.isSending}
                  onClick={() => handleSendCode('email')}
                >
                  {emailCooldown > 0
                    ? `Resend in ${emailCooldown}s`
                    : emailStatus.isSending
                    ? 'Sending...'
                    : 'Resend Code'}
                </button>
              </div>

              {/* Verify Button */}
              <button
                type="button"
                className="btn-primary"
                style={{ width: '100%', marginTop: 'var(--space-4)' }}
                onClick={() => handleVerify('email')}
                disabled={emailStatus.isVerifying || emailOtp.join('').length !== 6}
                id="btn-verify-email"
              >
                {emailStatus.isVerifying ? 'Verifying...' : 'Verify Email Address'}
              </button>
            </>
          )}
        </div>
      )}

      {/* WIZARD ACTIONS */}
      <div className="wizard-actions" style={{ marginTop: 'var(--space-5)' }}>
        <button
          type="button"
          className="btn-secondary"
          onClick={onBack}
          style={{ width: 'auto' }}
        >
          ← Back to Contact
        </button>

        <button
          type="button"
          className="btn-primary"
          style={{ width: 'auto', minWidth: '160px' }}
          disabled={!isAllComplete}
          onClick={onAllVerified}
          id="btn-proceed-to-security"
        >
          Next: Security →
        </button>
      </div>
    </div>
  );
};
