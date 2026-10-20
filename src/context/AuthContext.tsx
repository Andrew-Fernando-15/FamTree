import React, { useEffect, useState, useMemo, useCallback } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { authService, type AccountRow, type FamilyMemberRow } from '../services/authService';
import { AuthContext } from './authContextDef';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [account, setAccount] = useState<AccountRow | null>(null);
  const [member, setMember] = useState<FamilyMemberRow | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadProfile = useCallback(async (authUserId: string) => {
    try {
      const profile = await authService.getLinkedProfile(authUserId);
      setAccount(profile.account);
      setMember(profile.member);
    } catch {
      setAccount(null);
      setMember(null);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user?.id) {
      await loadProfile(user.id);
    }
  }, [user, loadProfile]);

  useEffect(() => {
    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      if (initialSession?.user) {
        loadProfile(initialSession.user.id).finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    });

    // 2. Listen for auth state changes (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        await loadProfile(newSession.user.id);
      } else {
        setAccount(null);
        setMember(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  const loginWithNameComponents = useCallback(
    async (name: string, fatherName: string, motherName: string, surname: string, password: string) => {
      setIsLoading(true);
      const res = await authService.loginWithNameComponents(name, fatherName, motherName, surname, password);
      if (res.user) {
        await loadProfile(res.user.id);
      }
      setIsLoading(false);
      return res;
    },
    [loadProfile]
  );

  const loginWithEmail = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      const res = await authService.loginWithEmail(email, password);
      if (res.user) {
        await loadProfile(res.user.id);
      }
      setIsLoading(false);
      return res;
    },
    [loadProfile]
  );

  const logout = useCallback(async () => {
    setIsLoading(true);
    const res = await authService.logout();
    setUser(null);
    setSession(null);
    setAccount(null);
    setMember(null);
    setIsLoading(false);
    return res;
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    return authService.resetPassword(email);
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      session,
      account,
      member,
      isLoading,
      loginWithNameComponents,
      loginWithEmail,
      logout,
      resetPassword,
      refreshProfile,
    }),
    [
      user,
      session,
      account,
      member,
      isLoading,
      loginWithNameComponents,
      loginWithEmail,
      logout,
      resetPassword,
      refreshProfile,
    ]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
