"use client";

import { useState } from "react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [success, setSuccess] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      if (!isSupabaseConfigured()) {
        localStorage.setItem("adminSession", JSON.stringify({ email, role: "admin" }));
        window.location.href = "/admin/dashboard";
        return;
      }
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      if (!data.session) throw new Error("فشل تسجيل الدخول");

      const { data: profile } = await supabase
        .from("users")
        .select("plan")
        .eq("id", data.session.user.id)
        .single();

      if (profile?.plan !== "admin") {
        await supabase.auth.signOut();
        throw new Error("ليس لديك صلاحية الوصول للوحة الإدارة. خطتك الحالية: " + (profile?.plan ?? "غير محدد"));
      }
      window.location.href = "/admin/dashboard";
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "حدث خطأ، حاول مجدداً");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (password.length < 6) { setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل"); return; }
    setLoading(true);
    try {
      if (!isSupabaseConfigured()) {
        setError("Supabase غير مُعَد");
        return;
      }
      // Create auth account
      const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
      if (authError) throw authError;

      if (authData.user) {
        // Create/update user profile as admin
        await supabase.from("users").upsert({
          id: authData.user.id,
          email,
          full_name: "Admin",
          plan: "admin",
          created_at: new Date().toISOString(),
        });
        setSuccess("تم إنشاء الحساب بنجاح! سجّل الدخول الآن.");
        setMode("login");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "حدث خطأ في إنشاء الحساب");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#f3f5f9" }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black text-white mx-auto mb-4"
            style={{ background: "#8957f6" }}>AV</div>
          <h1 className="text-2xl font-extrabold text-[#1c1c1e]">لوحة الإدارة</h1>
          <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
            {mode === "login" ? "تسجيل دخول المشرفين" : "إنشاء حساب مشرف جديد"}
          </p>
        </div>

        <div className="rounded-2xl border p-6" style={{ background: "#ffffff", borderColor: "#e5e7eb" }}>
          <form onSubmit={mode === "login" ? handleLogin : handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5 text-[#1c1c1e]">البريد الإلكتروني</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@advault.com"
                className="w-full px-4 py-2.5 rounded-xl border outline-none text-sm"
                style={{ background: "#ffffff", borderColor: "#e5e7eb", color: "#1c1c1e" }} dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5 text-[#1c1c1e]">كلمة المرور</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border outline-none text-sm"
                style={{ background: "#ffffff", borderColor: "#e5e7eb", color: "#1c1c1e" }} dir="ltr" />
            </div>

            {error && (
              <div className="px-3 py-2 rounded-lg text-xs" style={{ background: "#fef2f2", color: "#ef4444" }}>
                {error}
              </div>
            )}

            {success && (
              <div className="px-3 py-2 rounded-lg text-xs" style={{ background: "#f7fee7", color: "#84cc18" }}>
                {success}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 disabled:opacity-60"
              style={{ background: "#8957f6" }}>
              {loading ? "جارٍ المعالجة..." : mode === "login" ? "دخول" : "إنشاء حساب مشرف"}
            </button>
          </form>

          <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(null); setSuccess(null); }}
            className="w-full text-center text-xs mt-4 font-semibold"
            style={{ color: "#8957f6" }}>
            {mode === "login" ? "أول مرة؟ أنشئ حساب مشرف" : "عندك حساب؟ سجّل دخول"}
          </button>
        </div>

        <p className="text-center text-xs mt-4" style={{ color: "#9ca3af" }}>
          هذه الصفحة مخصصة لمشرفي المنصة فقط
        </p>
      </div>
    </div>
  );
}
