"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { AuthContextType, AuthUser } from "@/types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** Detect the expected user type from the current URL path */
function detectUserType(): "admin" | "doctor" | "user" {
  if (typeof window === "undefined") return "user";
  const path = window.location.pathname;
  if (path.startsWith("/admin")) return "admin";
  if (path.startsWith("/doctor")) return "doctor";
  return "user";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * On mount, call /api/auth/me?role=<type> to restore the session from
   * the httpOnly cookie. No localStorage involved at all.
   */
  useEffect(() => {
    const type = detectUserType();
    fetch(`/api/auth/me?role=${type}`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((data) => {
        if (data.success && data.user) {
          setUser(data.user as AuthUser);
        }
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  /**
   * Called after a successful login API response.
   * The httpOnly cookie is already set by the server response —
   * we only store the user object in React state.
   */
  const login = useCallback((_token: string | undefined, newUser: AuthUser) => {
    setUser(newUser);
  }, []);

  /** Clear server cookie via /api/auth/logout and reset state. */
  const logout = useCallback(async () => {
    const type = (user as { type?: string })?.type || detectUserType();
    try {
      await fetch(`/api/auth/logout?role=${type}`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // ignore network errors during logout
    }
    setUser(null);
  }, [user]);

  const updateUser = useCallback((updatedUser: AuthUser) => {
    setUser(updatedUser);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token: null, // no client-side token anymore
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
