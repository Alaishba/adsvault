"use client";

import { useState } from "react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (!isSupabaseConfigured()) {
        // Dev bypass: accept any credentials
        if (email && password) {
          localStorage.setItem("adminSession", JSON.stringify({ email, role: "admin" }));
          window.location.href = "/admin/dashboard";
        } else {
          setError("أدخل البريد الإلكتروني وكلمة المرور");
        }
        setLoading(false);
        return;
      }
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      if (!data.session) throw new Error("فشل تسجيل الدخول");

      // Check admin role
      const { data: profile } = await supabase
        .from("users")
        .select("plan")
        .eq("id", data.session.user.id)
        .single();

      if (profile?.plan !== "admin") {
        await supabase.auth.signOut();
        throw new Error("ليس لديك صلاحية الوصول للوحة الإدارة");
      }
      window.location.href = "/admin/dashboard";
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "حدث خطأ، حاول مجدداً");
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
          <p className="text-sm mt-1" style={{ color: "#6b7280" }}>تسجيل دخول المشرفين فقط</p>
        </div>

        <div className="rounded-2xl border p-6" style={{ background: "#ffffff", borderColor: "#e5e7eb" }}>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5 text-[#1c1c1e]">البريد الإلكتروني</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@advault.com"
                className="w-full px-4 py-2.5 rounded-xl border outline-none text-sm transition-colors"
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

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 disabled:opacity-60"
              style={{ background: "#8957f6" }}>
              {loading ? "جارٍ الدخول..." : "دخول"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-4" style={{ color: "#9ca3af" }}>
          هذه الصفحة مخصصة لمشرفي المنصة فقط
        </p>
      </div>
    </div>
  );
}
