"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      window.location.href = "/";
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "حدث خطأ، حاول مجدداً");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--bg)" }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black text-white mx-auto mb-3"
            style={{ background: "#84cc18" }}>AV</div>
          <h1 className="text-2xl font-extrabold" style={{ color: "var(--text-primary)" }}>
            تسجيل الدخول
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            مرحباً بك مجدداً في AdVault MENA
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[--border] p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>
                البريد الإلكتروني
              </label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-[--border] bg-[--surface2] outline-none focus:border-[#84cc18]/60 transition-colors text-sm"
                style={{ color: "var(--text-primary)" }} dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>
                كلمة المرور
              </label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-[--border] bg-[--surface2] outline-none focus:border-[#84cc18]/60 transition-colors text-sm"
                style={{ color: "var(--text-primary)" }} dir="ltr" />
              <div className="flex justify-end mt-1">
                <Link href="#" className="text-xs hover:underline" style={{ color: "#84cc18" }}>
                  نسيت كلمة المرور؟
                </Link>
              </div>
            </div>

            {error && (
              <div className="px-3 py-2 rounded-lg text-xs" style={{ background: "#fef2f2", color: "#b91c1c" }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 disabled:opacity-60"
              style={{ background: "#84cc18", color: "#fff" }}>
              {loading ? "جارٍ الدخول..." : "تسجيل الدخول"}
            </button>
          </form>

          <p className="text-center text-sm mt-5" style={{ color: "var(--text-secondary)" }}>
            ليس لديك حساب؟{" "}
            <Link href="/register" className="font-bold hover:underline" style={{ color: "#84cc18" }}>
              سجّل الآن
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
