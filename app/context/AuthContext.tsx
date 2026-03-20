"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  plan: "free" | "pro" | "enterprise" | "admin";
  avatar?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (uid: string, email: string) => {
    const { data: profile } = await supabase
      .from("users")
      .select("full_name,plan,avatar_url")
      .eq("id", uid)
      .single();
    return {
      id: uid,
      email,
      name: profile?.full_name ?? email,
      plan: (profile?.plan as AuthUser["plan"]) ?? "free",
      avatar: profile?.avatar_url ?? undefined,
    };
  };

  const refreshUser = async () => {
    if (!isSupabaseConfigured()) return;
    const { data } = await supabase.auth.getSession();
    if (data.session?.user) {
      const u = data.session.user;
      const profile = await loadProfile(u.id, u.email ?? "");
      setUser(profile);
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      try {
        const mock = localStorage.getItem("mockUser");
        if (mock) {
          const parsed = JSON.parse(mock);
          setUser({ id: "mock", email: parsed.email ?? "", name: parsed.name ?? parsed.email ?? "", plan: "free" });
        }
      } catch { /* */ }
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session?.user) {
        const u = data.session.user;
        const profile = await loadProfile(u.id, u.email ?? "");
        setUser(profile);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const u = session.user;
        const profile = await loadProfile(u.id, u.email ?? "");
        setUser(profile);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    if (!isSupabaseConfigured()) {
      localStorage.removeItem("mockUser");
      setUser(null);
      return;
    }
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
