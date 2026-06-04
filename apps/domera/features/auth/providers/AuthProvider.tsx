'use client';

import { firebaseAuth, googleProvider } from '@/lib/firebase/client';
import { MotionConfig } from '@repo/ui/animation';
import {
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  type User
} from 'firebase/auth';
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from 'react';

import { createSession, destroySession } from '../actions/session';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (
    name: string,
    email: string,
    password: string
  ) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (next) => {
      setUser(next);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const refreshUser = useCallback(async () => {
    const current = firebaseAuth.currentUser;
    if (!current) return;
    await current.reload();
    setRefreshTick((t) => t + 1);
  }, []);

  const establishSession = useCallback(async (next: User) => {
    const idToken = await next.getIdToken();
    await createSession(idToken);
  }, []);

  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      const credential = await signInWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      await establishSession(credential.user);
    },
    [establishSession]
  );

  const signUpWithEmail = useCallback(
    async (name: string, email: string, password: string) => {
      const credential = await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      if (name) {
        await updateProfile(credential.user, { displayName: name });
      }
      await establishSession(credential.user);
    },
    [establishSession]
  );

  const signInWithGoogle = useCallback(async () => {
    const credential = await signInWithPopup(firebaseAuth, googleProvider);
    await establishSession(credential.user);
  }, [establishSession]);

  const sendPasswordReset = useCallback(async (email: string) => {
    await sendPasswordResetEmail(firebaseAuth, email);
  }, []);

  const signOut = useCallback(async () => {
    await destroySession();
    await firebaseSignOut(firebaseAuth);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      sendPasswordReset,
      signOut,
      refreshUser
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      user,
      loading,
      refreshTick,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      sendPasswordReset,
      signOut,
      refreshUser
    ]
  );

  return (
    <MotionConfig reducedMotion="user">
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </MotionConfig>
  );
};
