"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) { setError("كلمتا المرور غير متطابقتين"); return; }
    if (password.length < 8) { setError("يجب أن تكون كلمة المرور 8 أحرف على الأقل"); return; }
    setLoading(true);
    try {
      if (!isSupabaseConfigured()) {
        localStorage.setItem("mockUser", JSON.stringify({ email, name: fullName }));
        window.location.href = "/";
        return;
      }
      const { data: authData, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (error) throw error;
      // Insert profile into public users table
      if (authData.user) {
        await supabase.from("users").upsert({
          id: authData.user.id,
          email,
          full_name: fullName,
          plan: "free",
          created_at: new Date().toISOString(),
        });
      }
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "حدث خطأ، حاول مجدداً");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg)" }}>
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-4"
            style={{ background: "#f0faf0" }}>✅</div>
          <h2 className="text-xl font-extrabold mb-2" style={{ color: "var(--text-primary)" }}>
            تم إنشاء الحساب!
          </h2>
          <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
            تحقق من بريدك الإلكتروني لتفعيل الحساب.
          </p>
          <Link href="/login" className="inline-block px-6 py-2.5 rounded-xl font-bold text-sm"
            style={{ background: "#84cc18", color: "#fff" }}>
            تسجيل الدخول
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{ background: "var(--bg)" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black text-white mx-auto mb-3"
            style={{ background: "#84cc18" }}>AV</div>
          <h1 className="text-2xl font-extrabold" style={{ color: "var(--text-primary)" }}>
            إنشاء حساب جديد
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            انضم لـ +500 فريق تسويقي في المنطقة
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[--border] p-6">
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>
                الاسم الكامل
              </label>
              <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)}
                placeholder="أحمد محمد"
                className="w-full px-4 py-2.5 rounded-xl border border-[--border] bg-[--surface2] outline-none focus:border-[#84cc18]/60 transition-colors text-sm"
                style={{ color: "var(--text-primary)" }} />
            </div>
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
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>
                تأكيد كلمة المرور
              </label>
              <input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-[--border] bg-[--surface2] outline-none focus:border-[#84cc18]/60 transition-colors text-sm"
                style={{ color: "var(--text-primary)" }} dir="ltr" />
            </div>

            {error && (
              <div className="px-3 py-2 rounded-lg text-xs" style={{ background: "#fef2f2", color: "#b91c1c" }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 disabled:opacity-60"
              style={{ background: "#84cc18", color: "#fff" }}>
              {loading ? "جارٍ الإنشاء..." : "إنشاء حساب"}
            </button>
          </form>

          <p className="text-center text-sm mt-5" style={{ color: "var(--text-secondary)" }}>
            لديك حساب؟{" "}
            <Link href="/login" className="font-bold hover:underline" style={{ color: "#84cc18" }}>
              سجّل دخولك
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
