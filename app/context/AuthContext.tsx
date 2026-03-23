"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "../lib/supabase";

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

  const loadProfile = async (uid: string, email: string): Promise<AuthUser> => {
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
    const { data } = await supabase.auth.getSession();
    if (data.session?.user) {
      const u = data.session.user;
      setUser(await loadProfile(u.id, u.email ?? ""));
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session?.user) {
        const u = data.session.user;
        setUser(await loadProfile(u.id, u.email ?? ""));
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(await loadProfile(session.user.id, session.user.email ?? ""));
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
