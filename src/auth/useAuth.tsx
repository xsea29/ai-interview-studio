import * as React from "react";
import type { Session, User } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";

export type AppRole = "platform_admin" | "client_user";

type AuthState = {
  session: Session | null;
  user: User | null;
  role: AppRole | null;
  loading: boolean;
  refreshRole: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = React.createContext<AuthState | null>(null);

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  let timeoutId: number | undefined;

  const timeout = new Promise<T>((_resolve, reject) => {
    timeoutId = window.setTimeout(() => {
      reject(new Error(`${label} timed out after ${ms}ms`));
    }, ms);
  });

  return Promise.race([promise, timeout]).finally(() => {
    if (timeoutId !== undefined) window.clearTimeout(timeoutId);
  }) as Promise<T>;
}

async function fetchMyRole(userId: string): Promise<AppRole | null> {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);

  if (error) return null;
  const roles = (data ?? []).map((r) => r.role as AppRole);
  if (roles.includes("platform_admin")) return "platform_admin";
  if (roles.includes("client_user")) return "client_user";
  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = React.useState<Session | null>(null);
  const [user, setUser] = React.useState<User | null>(null);
  const [role, setRole] = React.useState<AppRole | null>(null);
  const [loading, setLoading] = React.useState(true);

  const refreshRole = React.useCallback(async () => {
    if (!user?.id) {
      setRole(null);
      return;
    }
    try {
      const nextRole = await withTimeout(fetchMyRole(user.id), 7000, "refreshRole");
      setRole(nextRole);
    } catch (error) {
      console.error("refreshRole error:", error);
      setRole(null);
    }
  }, [user?.id]);

  React.useEffect(() => {
    let isMounted = true;

    // Get initial session first
    const initializeAuth = async () => {
      try {
        const {
          data: { session: initialSession },
        } = await withTimeout(supabase.auth.getSession(), 7000, "getSession");
        
        if (!isMounted) return;
        
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        
        if (initialSession?.user?.id) {
          try {
            const initialRole = await withTimeout(
              fetchMyRole(initialSession.user.id),
              7000,
              "fetchMyRole (initial)"
            );
            if (isMounted) setRole(initialRole);
          } catch (error) {
            console.error("Initial role fetch error:", error);
            if (isMounted) setRole(null);
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initializeAuth();

    // Set up listener for future auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      if (!isMounted) return;
      
      setSession(nextSession);
      setUser(nextSession?.user ?? null);

      if (nextSession?.user?.id) {
        try {
          const nextRole = await withTimeout(
            fetchMyRole(nextSession.user.id),
            7000,
            "fetchMyRole (auth change)"
          );
          if (isMounted) setRole(nextRole);
        } catch (error) {
          console.error("Role fetch error (auth change):", error);
          if (isMounted) setRole(null);
        }
      } else {
        setRole(null);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = React.useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const value: AuthState = {
    session,
    user,
    role,
    loading,
    refreshRole,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
