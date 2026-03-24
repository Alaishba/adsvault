"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();
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
      const { data: authData, error: authErr } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: fullName } },
      });
      if (authErr) throw authErr;
      if (authData.user) {
        await supabase.from("users").upsert({
          id: authData.user.id, email,
          full_name: fullName, plan: "free",
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
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#edf1f5" }}>
        <div className="text-center max-w-sm">
          <div className="text-4xl mb-4">✅</div>
          <h2 className="text-xl font-extrabold mb-2" style={{ color: "#1c1c1e" }}>تم إنشاء الحساب!</h2>
          <p className="text-sm mb-4" style={{ color: "#6b7280" }}>تحقق من بريدك الإلكتروني لتفعيل الحساب.</p>
          <button onClick={() => { router.push("/login"); router.refresh(); }}
            className="px-6 py-2.5 rounded-xl font-bold text-sm text-white"
            style={{ background: "#84cc18" }}>تسجيل الدخول</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ background: "#edf1f5" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black text-white mx-auto mb-3"
            style={{ background: "#84cc18" }}>AV</div>
          <h1 className="text-2xl font-extrabold" style={{ color: "#1c1c1e" }}>إنشاء حساب جديد</h1>
          <p className="text-sm mt-1" style={{ color: "#6b7280" }}>انضم لـ +500 فريق تسويقي في المنطقة</p>
        </div>

        <div className="rounded-2xl border p-6" style={{ background: "#ffffff", borderColor: "#e5e7eb" }}>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "#1c1c1e" }}>الاسم الكامل</label>
              <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)}
                placeholder="أحمد محمد"
                className="w-full px-4 py-2.5 rounded-xl border outline-none text-sm"
                style={{ background: "#ffffff", borderColor: "#e5e7eb", color: "#1c1c1e" }} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "#1c1c1e" }}>البريد الإلكتروني</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-xl border outline-none text-sm"
                style={{ background: "#ffffff", borderColor: "#e5e7eb", color: "#1c1c1e" }} dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "#1c1c1e" }}>كلمة المرور</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border outline-none text-sm"
                style={{ background: "#ffffff", borderColor: "#e5e7eb", color: "#1c1c1e" }} dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "#1c1c1e" }}>تأكيد كلمة المرور</label>
              <input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border outline-none text-sm"
                style={{ background: "#ffffff", borderColor: "#e5e7eb", color: "#1c1c1e" }} dir="ltr" />
            </div>

            {error && (
              <div className="px-3 py-2 rounded-lg text-xs font-semibold" style={{ background: "#fef2f2", color: "#dc2626" }}>{error}</div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 disabled:opacity-60"
              style={{ background: "#84cc18" }}>
              {loading ? "جارٍ الإنشاء..." : "إنشاء حساب"}
            </button>
          </form>

          <p className="text-center text-sm mt-5" style={{ color: "#6b7280" }}>
            لديك حساب؟{" "}
            <Link href="/login" className="font-bold hover:underline" style={{ color: "#84cc18" }}>سجّل دخولك</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
