"use client";

import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import {
  User,
  UserCredential,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase/config";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserCredential>;
  register: (email: string, password: string) => Promise<UserCredential>;
  loginWithGoogle: () => Promise<UserCredential>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = useCallback((email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  }, []);

  const register = useCallback((email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  }, []);

  const loginWithGoogle = useCallback(() => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    return signInWithPopup(auth, provider);
  }, []);

  const resetPassword = useCallback((email: string) => {
    const continueUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/auth`
        : undefined;
    return sendPasswordResetEmail(
      auth,
      email,
      continueUrl ? { url: continueUrl, handleCodeInApp: false } : undefined,
    );
  }, []);

  const logout = useCallback(() => {
    return signOut(auth);
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      loading,
      login,
      register,
      loginWithGoogle,
      resetPassword,
      logout,
    }),
    [currentUser, loading, login, register, loginWithGoogle, resetPassword, logout],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
