import { supabase } from '../lib/supabase';
import type { AdminContact, FamilyMatchResult } from '../features/familyTree/types';

/**
 * Searches the preconfigured family tree for candidates matching the user's name components (FR-05).
 * Distinguishes single match (FR-06), multiple duplicate candidates (FR-07), and no match (FR-08).
 */
export async function searchFamilyMembers(
  name: string,
  surname: string
): Promise<FamilyMatchResult> {
  const cleanName = name.trim();
  const cleanSurname = surname.trim();

  if (!cleanName || !cleanSurname) {
    return { outcome: 'no_match', errorMessage: 'First name and surname are required for tree matching.' };
  }

  try {
    // 1. Query family_members matching first name and surname (case-insensitive)
    const { data: members, error } = await supabase
      .from('family_members')
      .select('*')
      .ilike('name', cleanName)
      .ilike('surname', cleanSurname);

    if (error) {
      console.error('[familyMatchingService] Error querying family_members:', error);
      return { outcome: 'no_match', errorMessage: error.message };
    }

    if (!members || members.length === 0) {
      return { outcome: 'no_match' };
    }

    // 2. Single match scenario (FR-06)
    if (members.length === 1) {
      const candidate = members[0];

      // Check if an account is already linked to this member
      const { data: linkedAccount } = await supabase
        .from('accounts')
        .select('id')
        .eq('linked_member_id', candidate.id)
        .maybeSingle();

      if (linkedAccount) {
        return {
          outcome: 'already_linked',
          candidate,
          errorMessage:
            'An active account is already registered and linked to this family member profile. Please sign in or use password recovery.',
        };
      }

      return {
        outcome: 'single_match',
        candidate,
      };
    }

    // 3. Duplicate names scenario (FR-07)
    // Display multiple candidate choices showing father's name, mother's name, and date of birth
    return {
      outcome: 'multiple_matches',
      candidates: members,
    };
  } catch (err) {
    console.error('[familyMatchingService] Unexpected error searching family members:', err);
    return {
      outcome: 'no_match',
      errorMessage: err instanceof Error ? err.message : 'Family matching service error.',
    };
  }
}

/**
 * Fetches the active family administrator contact information (FR-09).
 */
export async function getAdminContactInfo(): Promise<AdminContact> {
  try {
    const { data, error } = await supabase
      .from('admin_contacts')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!error && data) {
      return data;
    }
  } catch (err) {
    console.warn('[familyMatchingService] Could not fetch admin_contacts, using fallback defaults:', err);
  }

  // Fallback defaults if table record has not yet been seeded in Supabase
  return {
    id: 'a0000000-0000-0000-0000-000000000001',
    whatsapp_number: '+1234567890',
    support_email: 'admin@famtree.internal',
    instructions:
      'If your account cannot be matched automatically or your profile is missing from the tree, please contact your family administrator for verification and entry.',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}
