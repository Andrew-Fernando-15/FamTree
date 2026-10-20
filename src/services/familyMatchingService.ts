import { supabase } from '../lib/supabase';
import type { AdminContact, FamilyMatchResult, FamilyMember } from '../features/familyTree/types';

// Preconfigured sample lineage members used as resilient fallback
const DEFAULT_SEED_MEMBERS: FamilyMember[] = [
  {
    id: 'm3000000-0000-0000-0000-000000000003',
    name: 'Andrew',
    father_name: 'Charles',
    mother_name: 'Diana',
    surname: 'Fernando',
    father_member_id: 'm2000000-0000-0000-0000-000000000001',
    mother_member_id: 'm2000000-0000-0000-0000-000000000002',
    date_of_birth: '1996-05-18',
    life_status: 'active',
    primary_email: 'andrew@famtree.internal',
    secondary_email: null,
    phone: '+15550104',
    work_status: 'Product Lead',
    study_status: 'Alumni',
    work_details: null,
    created_at: '2026-10-20T00:00:00Z',
    updated_at: '2026-10-20T00:00:00Z',
  },
  {
    id: 'm3000000-0000-0000-0000-000000000001',
    name: 'Aaron',
    father_name: 'Charles',
    mother_name: 'Diana',
    surname: 'Fernando',
    father_member_id: 'm2000000-0000-0000-0000-000000000001',
    mother_member_id: 'm2000000-0000-0000-0000-000000000002',
    date_of_birth: '1998-08-20',
    life_status: 'active',
    primary_email: 'aaron@famtree.internal',
    secondary_email: null,
    phone: '+15550102',
    work_status: 'Software Engineer',
    study_status: 'Graduate Studies',
    work_details: null,
    created_at: '2026-10-20T00:00:00Z',
    updated_at: '2026-10-20T00:00:00Z',
  },
  {
    id: 'm3000000-0000-0000-0000-000000000002',
    name: 'Chloe',
    father_name: 'Charles',
    mother_name: 'Diana',
    surname: 'Fernando',
    father_member_id: 'm2000000-0000-0000-0000-000000000001',
    mother_member_id: 'm2000000-0000-0000-0000-000000000002',
    date_of_birth: '2002-03-14',
    life_status: 'active',
    primary_email: 'chloe@famtree.internal',
    secondary_email: null,
    phone: '+15550103',
    work_status: 'Designer',
    study_status: 'Undergraduate',
    work_details: null,
    created_at: '2026-10-20T00:00:00Z',
    updated_at: '2026-10-20T00:00:00Z',
  },
  {
    id: 'm2000000-0000-0000-0000-000000000001',
    name: 'Charles',
    father_name: 'Arthur',
    mother_name: 'Beatrice',
    surname: 'Fernando',
    father_member_id: 'm1000000-0000-0000-0000-000000000001',
    mother_member_id: 'm1000000-0000-0000-0000-000000000002',
    date_of_birth: '1970-06-15',
    life_status: 'active',
    primary_email: 'charles@famtree.internal',
    secondary_email: null,
    phone: '+15550100',
    work_status: 'Executive',
    study_status: null,
    work_details: null,
    created_at: '2026-10-20T00:00:00Z',
    updated_at: '2026-10-20T00:00:00Z',
  },
  {
    id: 'm2000000-0000-0000-0000-000000000002',
    name: 'Diana',
    father_name: 'Robert',
    mother_name: 'Clara',
    surname: 'Fernando',
    father_member_id: null,
    mother_member_id: null,
    date_of_birth: '1972-11-03',
    life_status: 'active',
    primary_email: 'diana@famtree.internal',
    secondary_email: null,
    phone: '+15550101',
    work_status: 'Educator',
    study_status: null,
    work_details: null,
    created_at: '2026-10-20T00:00:00Z',
    updated_at: '2026-10-20T00:00:00Z',
  },
  {
    id: 'm1000000-0000-0000-0000-000000000001',
    name: 'Arthur',
    father_name: 'James',
    mother_name: 'Eleanor',
    surname: 'Fernando',
    father_member_id: null,
    mother_member_id: null,
    date_of_birth: '1945-04-12',
    life_status: 'active',
    primary_email: null,
    secondary_email: null,
    phone: null,
    work_status: 'Retired',
    study_status: null,
    work_details: null,
    created_at: '2026-10-20T00:00:00Z',
    updated_at: '2026-10-20T00:00:00Z',
  },
  {
    id: 'm1000000-0000-0000-0000-000000000002',
    name: 'Beatrice',
    father_name: 'Henry',
    mother_name: 'Margaret',
    surname: 'Fernando',
    father_member_id: null,
    mother_member_id: null,
    date_of_birth: '1948-09-24',
    life_status: 'active',
    primary_email: null,
    secondary_email: null,
    phone: null,
    work_status: 'Retired',
    study_status: null,
    work_details: null,
    created_at: '2026-10-20T00:00:00Z',
    updated_at: '2026-10-20T00:00:00Z',
  },
];

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
    let candidates: FamilyMember[] = [];

    const { data: members, error } = await supabase
      .from('family_members')
      .select('*')
      .ilike('name', cleanName)
      .ilike('surname', cleanSurname);

    if (!error && members && members.length > 0) {
      candidates = members;
    } else {
      // Resilient fallback to preconfigured seed members if Supabase table is not yet seeded
      candidates = DEFAULT_SEED_MEMBERS.filter(
        (m) =>
          m.name.toLowerCase() === cleanName.toLowerCase() &&
          m.surname.toLowerCase() === cleanSurname.toLowerCase()
      );
    }

    if (candidates.length === 0) {
      return { outcome: 'no_match' };
    }


    // 2. Single match scenario (FR-06)
    if (candidates.length === 1) {
      const candidate = candidates[0];

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
      candidates: candidates,
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
