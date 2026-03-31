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
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "transparent" }}>
        <div className="text-center max-w-sm">
          <div className="text-4xl mb-4">✅</div>
          <h2 className="text-xl font-extrabold mb-2" style={{ color: "#ffffff" }}>تم إنشاء الحساب!</h2>
          <p className="text-sm mb-4" style={{ color: "#94a3b8" }}>تحقق من بريدك الإلكتروني لتفعيل الحساب.</p>
          <button onClick={() => { router.push("/login"); router.refresh(); }}
            className="px-6 py-2.5 rounded-xl font-bold text-sm text-white"
            style={{ background: "#2563eb" }}>تسجيل الدخول</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ background: "transparent" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <img
              src="/logo.png"
              alt="Mulhem"
              className="h-24 w-auto object-contain"
              onError={(e) => { e.currentTarget.style.display='none' }}
            />
          </div>
          <h1 className="text-2xl font-extrabold" style={{ color: "#ffffff" }}>إنشاء حساب جديد</h1>
          <p className="text-sm mt-1" style={{ color: "#94a3b8" }}>انضم لـ +500 فريق تسويقي في المنطقة</p>
        </div>

        <div className="rounded-2xl border p-6" style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)" }}>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "#ffffff" }}>الاسم الكامل</label>
              <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)}
                placeholder="أحمد محمد"
                className="w-full px-4 py-2.5 rounded-xl border outline-none text-sm"
                style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)", color: "#ffffff" }} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "#ffffff" }}>البريد الإلكتروني</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-xl border outline-none text-sm"
                style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)", color: "#ffffff" }} dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "#ffffff" }}>كلمة المرور</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border outline-none text-sm"
                style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)", color: "#ffffff" }} dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "#ffffff" }}>تأكيد كلمة المرور</label>
              <input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border outline-none text-sm"
                style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)", color: "#ffffff" }} dir="ltr" />
            </div>

            {error && (
              <div className="px-3 py-2 rounded-lg text-xs font-semibold" style={{ background: "#fef2f2", color: "#dc2626" }}>{error}</div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 disabled:opacity-60"
              style={{ background: "#2563eb" }}>
              {loading ? "جارٍ الإنشاء..." : "إنشاء حساب"}
            </button>
          </form>

          <p className="text-center text-sm mt-5" style={{ color: "#94a3b8" }}>
            لديك حساب؟{" "}
            <Link href="/login" className="font-bold hover:underline" style={{ color: "#2563eb" }}>سجّل دخولك</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
