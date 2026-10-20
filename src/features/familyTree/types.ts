import type { Database } from '../../types/database';

export type FamilyMember = Database['public']['Tables']['family_members']['Row'];
export type Relationship = Database['public']['Tables']['relationships']['Row'];
export type AdminContact = Database['public']['Tables']['admin_contacts']['Row'];

export type FamilyMatchOutcome = 'single_match' | 'multiple_matches' | 'no_match' | 'already_linked';

export interface FamilyMatchResult {
  outcome: FamilyMatchOutcome;
  candidate?: FamilyMember;
  candidates?: FamilyMember[];
  errorMessage?: string;
}
