"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
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
      router.refresh();
      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "حدث خطأ، حاول مجدداً");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#edf1f5" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black text-white mx-auto mb-3"
            style={{ background: "#84cc18" }}>AV</div>
          <h1 className="text-2xl font-extrabold" style={{ color: "#1c1c1e" }}>تسجيل الدخول</h1>
          <p className="text-sm mt-1" style={{ color: "#6b7280" }}>مرحباً بك مجدداً في AdVault MENA</p>
        </div>

        <div className="rounded-2xl border p-6" style={{ background: "#ffffff", borderColor: "#e5e7eb" }}>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "#1c1c1e" }}>البريد الإلكتروني</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-xl border outline-none text-sm focus:border-[#84cc18]/60 transition-colors"
                style={{ background: "#ffffff", borderColor: "#e5e7eb", color: "#1c1c1e" }} dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "#1c1c1e" }}>كلمة المرور</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border outline-none text-sm focus:border-[#84cc18]/60 transition-colors"
                style={{ background: "#ffffff", borderColor: "#e5e7eb", color: "#1c1c1e" }} dir="ltr" />
            </div>

            {error && (
              <div className="px-3 py-2 rounded-lg text-xs font-semibold" style={{ background: "#fef2f2", color: "#dc2626" }}>{error}</div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 disabled:opacity-60"
              style={{ background: "#84cc18" }}>
              {loading ? "جارٍ الدخول..." : "تسجيل الدخول"}
            </button>
          </form>

          <p className="text-center text-sm mt-5" style={{ color: "#6b7280" }}>
            ليس لديك حساب؟{" "}
            <Link href="/register" className="font-bold hover:underline" style={{ color: "#84cc18" }}>سجّل الآن</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
