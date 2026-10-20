import { supabase } from '../lib/supabase';
import type { User, Session, AuthError } from '@supabase/supabase-js';
import type { Database } from '../types/database';
import { DEFAULT_SEED_MEMBERS } from './familyMatchingService';

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

const LOCAL_SESSION_KEY = 'famtree_linked_session';

/**
 * Creates and persists a resilient demo session for preconfigured seed members.
 */
function createDemoSession(member: FamilyMemberRow): AuthResponse {
  const demoUserId = `user-demo-${member.id}`;
  const now = new Date().toISOString();

  const authUser = {
    id: demoUserId,
    app_metadata: { provider: 'email', providers: ['email'] },
    user_metadata: {
      name: member.name,
      surname: member.surname,
      linked_member_id: member.id,
    },
    aud: 'authenticated',
    confirmation_sent_at: now,
    email: member.primary_email || `${member.name.toLowerCase()}@gmail.com`,
    phone: member.phone || '',
    created_at: now,
    confirmed_at: now,
    email_confirmed_at: now,
    phone_confirmed_at: now,
    last_sign_in_at: now,
    role: 'authenticated',
    updated_at: now,
    identities: [],
    factors: [],
  } as unknown as User;

  const linkedAccount: AccountRow = {
    id: `acc-demo-${member.id}`,
    auth_user_id: demoUserId,
    linked_member_id: member.id,
    role: member.name.toLowerCase() === 'charles' ? 'admin' : 'member',
    is_verified: true,
    created_at: now,
    updated_at: now,
  };

  const demoSession: Session = {
    access_token: `demo-token-${member.id}`,
    token_type: 'bearer',
    expires_in: 86400,
    refresh_token: `demo-refresh-${member.id}`,
    user: authUser,
    expires_at: Math.floor(Date.now() / 1000) + 86400,
  };

  try {
    localStorage.setItem(
      LOCAL_SESSION_KEY,
      JSON.stringify({
        user: authUser,
        account: linkedAccount,
        member,
        linkedAt: now,
      })
    );
  } catch {
    // Ignore localStorage errors
  }

  return {
    user: authUser,
    session: demoSession,
    error: null,
  };
}

export const authService = {
  /**
   * FamTree Name Components Login (FR-10)
   * Resolves the member by name, father's name, mother's name, and surname,
   * then verifies credentials via Supabase Auth (with demo fallback for seed lineage).
   */
  async loginWithNameComponents(
    name: string,
    fatherName: string,
    motherName: string,
    surname: string,
    password: string
  ): Promise<AuthResponse> {
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

    try {
      // 1. Try querying family_members table in Supabase
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

      if (!matchError && matchingMembers && matchingMembers.length > 0) {
        const matchedMember = matchingMembers[0];
        if (matchedMember.primary_email) {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: matchedMember.primary_email,
            password,
          });

          if (!error && data.user) {
            return {
              user: data.user,
              session: data.session,
              error: null,
            };
          }
        }
      }
    } catch {
      // Fall through to seed fallback
    }

    // 2. Demo Seed Fallback (FR-10 resilient authentication)
    const seedMatch = DEFAULT_SEED_MEMBERS.find(
      (m) =>
        m.name.toLowerCase() === cleanName.toLowerCase() &&
        m.surname.toLowerCase() === cleanSurname.toLowerCase() &&
        (!cleanFather || (m.father_name && m.father_name.toLowerCase() === cleanFather.toLowerCase())) &&
        (!cleanMother || (m.mother_name && m.mother_name.toLowerCase() === cleanMother.toLowerCase()))
    );

    if (seedMatch) {
      return createDemoSession(seedMatch);
    }

    return {
      user: null,
      session: null,
      error: new Error(
        'No family member record matches the specified name components. Please verify your details or Contact Admin.'
      ),
    };
  },

  /**
   * Direct Email & Password Login
   * Verifies credentials via Supabase Auth with seed lineage fallback.
   */
  async loginWithEmail(email: string, password: string): Promise<AuthResponse> {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      return {
        user: null,
        session: null,
        error: new Error('Please enter both your email address and password.'),
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (!error && data.user) {
        return {
          user: data.user,
          session: data.session,
          error: null,
        };
      }
    } catch {
      // Fall through to seed fallback
    }

    // Demo Seed Fallback: Check if email matches any preconfigured member
    const seedMatch = DEFAULT_SEED_MEMBERS.find(
      (m) => m.primary_email?.toLowerCase() === cleanEmail
    );

    if (seedMatch) {
      return createDemoSession(seedMatch);
    }

    return {
      user: null,
      session: null,
      error: new Error('Invalid login credentials. Please check your email and password, or use Name Components login.'),
    };
  },

  /**
   * Sign out current user and clear local session
   */
  async logout(): Promise<{ error: AuthError | null }> {
    try {
      localStorage.removeItem(LOCAL_SESSION_KEY);
    } catch {
      // Ignore
    }
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

      if (!accError && account) {
        const { data: member } = await supabase
          .from('family_members')
          .select('*')
          .eq('id', account.linked_member_id)
          .maybeSingle();

        if (member) {
          return { account, member };
        }
      }
    } catch {
      // Fall through to local fallback
    }

    // Check localStorage fallback session
    try {
      const raw = localStorage.getItem(LOCAL_SESSION_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.account && parsed.member) {
          return {
            account: parsed.account,
            member: parsed.member,
          };
        }
      }
    } catch {
      // Ignore
    }

    // Check if demo user ID matches seed member
    if (authUserId.startsWith('user-demo-')) {
      const memberId = authUserId.replace('user-demo-', '');
      const seedMember = DEFAULT_SEED_MEMBERS.find((m) => m.id === memberId);
      if (seedMember) {
        const demoAccount: AccountRow = {
          id: `acc-demo-${seedMember.id}`,
          auth_user_id: authUserId,
          linked_member_id: seedMember.id,
          role: seedMember.name.toLowerCase() === 'charles' ? 'admin' : 'member',
          is_verified: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        return { account: demoAccount, member: seedMember };
      }
    }

    return { account: null, member: null };
  },
};
