"use client";

/**
 * Auth context for the admin panel.
 *
 * Wraps admin layout with AuthProvider.
 * useAuth() exposes: user, loading, error, login(), logout(), checkSession().
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { Models } from "appwrite";
import { account } from "@/lib/appwrite";

// ── Types ─────────────────────────────────────────────────────────

interface AuthState {
  user: Models.User<Models.Preferences> | null;
  loading: boolean;
  error: string | null;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

// ── Context ───────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ── Provider ──────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<Models.User<Models.Preferences> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const checkSession = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const me = await account.get();
      setUser(me);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Restore session on mount
  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await account.createEmailPasswordSession(email, password);
      const me = await account.get();
      setUser(me);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Login failed. Check your credentials.";
      setError(msg);
      throw err; // re-throw so login page can catch it
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await account.deleteSession("current");
    } finally {
      setUser(null);
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth() must be used inside <AuthProvider>.");
  }
  return ctx;
}
