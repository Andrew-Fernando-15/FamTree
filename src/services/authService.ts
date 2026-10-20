import { supabase } from '../lib/supabase';
import type { User, Session, AuthError } from '@supabase/supabase-js';
import type { Database } from '../types/database';

export type AccountRow = Database['public']['Tables']['accounts']['Row'];
export type FamilyMemberRow = Database['public']['Tables']['family_members']['Row'];

export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error: AuthError | Error | null;
}

export interface LinkedAccountProfile {
  account: AccountRow | null;
  member: FamilyMemberRow | null;
}

export const authService = {
  /**
   * FamTree Name Components Login (FR-10)
   * Resolves the member by name, father's name, mother's name, and surname,
   * then verifies credentials via Supabase Auth.
   */
  async loginWithNameComponents(
    name: string,
    fatherName: string,
    motherName: string,
    surname: string,
    password: string
  ): Promise<AuthResponse> {
    try {
      const cleanName = name.trim();
      const cleanFather = fatherName.trim();
      const cleanMother = motherName.trim();
      const cleanSurname = surname.trim();

      if (!cleanName || !cleanSurname || !password) {
        return {
          user: null,
          session: null,
          error: new Error('First name, surname, and password are required.'),
        };
      }

      // Query family member record to retrieve registered email identifier
      let query = supabase
        .from('family_members')
        .select('id, primary_email, name, surname, father_name, mother_name')
        .ilike('name', cleanName)
        .ilike('surname', cleanSurname);

      if (cleanFather) {
        query = query.ilike('father_name', cleanFather);
      }
      if (cleanMother) {
        query = query.ilike('mother_name', cleanMother);
      }

      const { data: matchingMembers, error: matchError } = await query;

      if (matchError) {
        return { user: null, session: null, error: matchError };
      }

      if (!matchingMembers || matchingMembers.length === 0) {
        return {
          user: null,
          session: null,
          error: new Error(
            'No family member record matches the specified name components. Please verify your details or Contact Admin.'
          ),
        };
      }

      const matchedMember = matchingMembers[0];
      if (!matchedMember.primary_email) {
        return {
          user: null,
          session: null,
          error: new Error(
            'The matching family member profile does not have a registered email for authentication. Please Contact Admin.'
          ),
        };
      }

      // Authenticate with Supabase Auth using the resolved email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email: matchedMember.primary_email,
        password,
      });

      return {
        user: data.user,
        session: data.session,
        error,
      };
    } catch (err: unknown) {
      return {
        user: null,
        session: null,
        error: err instanceof Error ? err : new Error('An unexpected error occurred during login.'),
      };
    }
  },

  /**
   * Direct Email & Password Login
   */
  async loginWithEmail(email: string, password: string): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    return {
      user: data.user,
      session: data.session,
      error,
    };
  },

  /**
   * Sign out current user and clear local session
   */
  async logout(): Promise<{ error: AuthError | null }> {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  /**
   * Password Recovery (FR-11)
   */
  async resetPassword(email: string): Promise<{ error: AuthError | null }> {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error };
  },

  /**
   * Fetch linked account and family member record for the authenticated user
   */
  async getLinkedProfile(authUserId: string): Promise<LinkedAccountProfile> {
    try {
      const { data: account, error: accError } = await supabase
        .from('accounts')
        .select('*')
        .eq('auth_user_id', authUserId)
        .maybeSingle();

      if (accError || !account) {
        return { account: null, member: null };
      }

      const { data: member } = await supabase
        .from('family_members')
        .select('*')
        .eq('id', account.linked_member_id)
        .maybeSingle();

      return {
        account,
        member: member || null,
      };
    } catch {
      return { account: null, member: null };
    }
  },
};
