import { createContext } from 'react';
import type { User, Session, AuthError } from '@supabase/supabase-js';
import type { AccountRow, FamilyMemberRow, AuthResponse } from '../services/authService';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  account: AccountRow | null;
  member: FamilyMemberRow | null;
  isLoading: boolean;
  loginWithNameComponents: (
    name: string,
    fatherName: string,
    motherName: string,
    surname: string,
    password: string
  ) => Promise<AuthResponse>;
  loginWithEmail: (email: string, password: string) => Promise<AuthResponse>;
  logout: () => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
