"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppLayout from "../components/AppLayout";
import { createClient } from "../lib/supabase/client";
import { getImageUrl } from "../lib/imageUrl";
import { revalidate } from "../actions";
import { uploadViaSignedUrl } from "../lib/uploadViaSignedUrl";

const tabs = [
  { id: "info", label: "معلوماتي" },
  { id: "subscription", label: "اشتراكي" },
  { id: "preferences", label: "التفضيلات" },
];

const planLabels: Record<string, { label: string; color: string; bg: string }> = {
  free: { label: "مجاني", color: "#6b7280", bg: "rgba(255,255,255,0.05)" },
  pro: { label: "Pro", color: "#60a5fa", bg: "rgba(37,99,235,0.15)" },
  enterprise: { label: "Enterprise", color: "#1d4ed8", bg: "#eff6ff" },
  admin: { label: "Admin", color: "#b91c1c", bg: "#fef2f2" },
};

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("info");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState("free");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [saved, setSaved] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);
  const [notifs, setNotifs] = useState({ newAds: true, strategies: true, weeklyDigest: false });


  // Load user session + profile (critical path — unblocks page)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!mounted) return;
        if (!authUser) { setPageLoading(false); return; }
        setUserId(authUser.id);
        setEmail(authUser.email ?? "");
        const { data: profile } = await supabase
          .from("users").select("full_name,plan,avatar_url,phone,company,job_title").eq("id", authUser.id).single();
        if (!mounted) return;
        if (profile) {
          setName(profile.full_name ?? "");
          setPlan(profile.plan ?? "free");
          setAvatarUrl(profile.avatar_url ?? null);
          setPhone(profile.phone ?? "");
          setCompany(profile.company ?? "");
          setJobTitle(profile.job_title ?? "");
        }
        setPageLoading(false);
      } catch {
        if (mounted) setPageLoading(false);
      }
    })();
    return () => { mounted = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const isPro = plan === "pro" || plan === "enterprise" || plan === "admin";
  const planInfo = planLabels[plan] ?? planLabels.free;
  const initials = name.trim().split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "؟";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const [avatarError, setAvatarError] = useState<string | null>(null);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setAvatarError(null);
    try {
      if (!userId) throw new Error("يجب تسجيل الدخول أولاً");
      console.log(`[Profile] Uploading avatar for user=${userId} size=${file.size}`);
      const result = await uploadViaSignedUrl("user-avatars", file, `${userId}-avatar`);
      if (result.error) {
        console.error(`[Profile] Avatar upload failed:`, result.error);
        throw new Error(result.error);
      }
      if (!result.url) throw new Error("فشل رفع الصورة");
      const url = result.url;
      console.log(`[Profile] Avatar uploaded: ${url}`);
      setAvatarUrl(url);
      const { error: dbErr } = await supabase.from("users").update({ avatar_url: url }).eq("id", userId);
      if (dbErr) {
        console.error(`[Profile] DB update failed:`, dbErr.message);
        throw new Error(dbErr.message);
      }
      console.log(`[Profile] Avatar saved to DB`);
      await revalidate("/profile");
      router.refresh();
    } catch (err: unknown) {
      setAvatarError(err instanceof Error ? err.message : "خطأ في رفع الصورة");
    }
    setUploading(false);
  };

  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSaveInfo = async () => {
    setSaved(false);
    setSaveError(null);
    try {
      if (!userId) throw new Error("يجب تسجيل الدخول أولاً");
      const { error } = await supabase.from("users").update({
        full_name: name,
        phone: phone || null,
        company: company || null,
        job_title: jobTitle || null,
      }).eq("id", userId);
      if (error) throw new Error(error.message);
      await revalidate("/profile");
      router.refresh();
      setSaved(true);
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : "حدث خطأ في حفظ البيانات");
      setSaved(true);
    }
  };

  if (pageLoading) {
    return <AppLayout><div className="flex items-center justify-center min-h-[60vh]"><p style={{ color: "#6b7280" }}>جارٍ التحميل...</p></div></AppLayout>;
  }

  const inputStyle = { background: "#ffffff", border: "1px solid #e5e7eb", color: "#0f172a" };

  return (
    <AppLayout>
      <div className="px-6 lg:px-10 py-8 max-w-4xl mx-auto">
        {/* Hero header (glassmorphism) */}
        <div className="rounded-2xl mb-6 flex flex-row-reverse items-center gap-4 p-4" style={{
          background: "#ced3de",
          border: "1px solid #ced3de",
        }}>
          {/* RIGHT side — text info */}
          <div className="flex-1 text-right">
            <p className="text-lg font-black text-slate-900">{name || "المستخدم"}</p>
            <p className="text-sm text-slate-600">{email}</p>
            <span className="inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-bold"
              style={{ background: planInfo.bg, color: planInfo.color }}>{planInfo.label}</span>
          </div>
          {/* LEFT side — avatar */}
          <div className="relative shrink-0 group">
            {avatarUrl ? (
              <img src={getImageUrl("user-avatars", avatarUrl)} alt="avatar" className="w-20 h-20 rounded-2xl object-cover" style={{ border: "3px solid #2563eb" }}
                onError={(e) => { e.currentTarget.src = "/fallback.png"; e.currentTarget.style.display = "block"; }} />
            ) : (
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black text-white"
                style={{ background: "#334155", border: "3px solid #2563eb" }}>{initials}</div>
            )}
            <button onClick={() => fileRef.current?.click()} disabled={uploading}
              className="absolute -bottom-1 -left-1 w-7 h-7 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all"
              style={{ background: "#2563eb" }}>
              {uploading ? (
                <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeDasharray="60" strokeDashoffset="20"/></svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
              )}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>
        </div>

        {/* Tabs (glassmorphism) */}
        <div className="flex justify-center gap-1 mb-6 overflow-x-auto rounded-xl p-1" style={{
          background: "#ced3de",
          border: "1px solid #ced3de",
        }}>
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className="px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all shrink-0"
              style={{
                background: activeTab === tab.id ? "#2563eb" : "transparent",
                color: activeTab === tab.id ? "#fff" : "#6b7280",
              }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab: معلوماتي */}
        {activeTab === "info" && (
          <div className="rounded-2xl p-6" style={{
            background: "#ced3de",
            border: "1px solid #ced3de",
          }}>
            <h3 className="font-extrabold mb-5" style={{ color: "#0f172a" }}>المعلومات الشخصية</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "الاسم الكامل", value: name, setter: setName, placeholder: "محمد أحمد", type: "text" },
                { label: "المسمى الوظيفي", value: jobTitle, setter: setJobTitle, placeholder: "مدير تسويق", type: "text" },
                { label: "الشركة", value: company, setter: setCompany, placeholder: "اسم الشركة", type: "text" },
                { label: "رقم الجوال", value: phone, setter: setPhone, placeholder: "+966 5x xxx xxxx", type: "tel" },
              ].map(({ label, value, setter, placeholder, type }) => (
                <div key={label}>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: "#0f172a" }}>{label}</label>
                  <input type={type} value={value} onChange={(e) => setter(e.target.value)} placeholder={placeholder}
                    className="w-full px-4 py-2.5 rounded-xl outline-none text-sm focus:ring-2 focus:ring-blue-500/30 transition-all"
                    style={inputStyle} />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "#0f172a" }}>البريد الإلكتروني</label>
                <input type="email" value={email} disabled dir="ltr"
                  className="w-full px-4 py-2.5 rounded-xl outline-none text-sm opacity-60 cursor-not-allowed"
                  style={{ background: "#f3f5f9", border: "1px solid #e5e7eb", color: "#0f172a" }} />
              </div>
            </div>
            {saveError && (
              <p className="text-red-500 text-sm font-semibold mb-3 mt-4">{saveError}</p>
            )}
            <button onClick={handleSaveInfo}
              className="mt-5 px-6 py-2.5 rounded-xl font-bold text-sm text-white hover:opacity-90 transition-all"
              style={{ background: saved ? "#2563eb" : "#059669" }}>
              {saved ? "حفظ التغييرات" : "✓ جارٍ الحفظ..."}
            </button>
          </div>
        )}

        {/* Tab: اشتراكي */}
        {activeTab === "subscription" && (
          <div className="rounded-2xl p-6" style={{
            background: "#ced3de",
            border: "1px solid #ced3de",
          }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#f3eeff" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2">
                  <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
              </div>
              <div>
                <p className="font-extrabold" style={{ color: "#0f172a" }}>خطة {planInfo.label}</p>
                <p className="text-sm" style={{ color: "#6b7280" }}>{isPro ? "اشتراك نشط" : "الباقة المجانية"}</p>
              </div>
              <span className="mr-auto px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: planInfo.bg, color: planInfo.color }}>{planInfo.label}</span>
            </div>
            <div className="space-y-3 mb-6">
              {[
                { label: "التحليل الأساسي", included: true },
                { label: "التحليل المتقدم (Pro)", included: isPro },
                { label: "جميع الاستراتيجيات", included: isPro },
                { label: "قاعدة بيانات المؤثرين", included: isPro },
              ].map((f) => (
                <div key={f.label} className="flex items-center justify-between py-2 border-b last:border-0" style={{ borderColor: "#e5e7eb" }}>
                  <span className="text-sm" style={{ color: "#6b7280" }}>{f.label}</span>
                  {f.included ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  )}
                </div>
              ))}
            </div>
            <Link href="/pricing"
              className="block w-full py-3 rounded-xl font-bold text-sm text-center text-white hover:opacity-90 transition-all"
              style={{ background: isPro ? "#334155" : "#2563eb" }}>
              {isPro ? "إدارة الاشتراك" : "ترقية إلى Pro →"}
            </Link>
          </div>
        )}


        {/* Tab: التفضيلات */}
        {activeTab === "preferences" && (
          <div className="rounded-2xl p-6" style={{
            background: "#ced3de",
            border: "1px solid #ced3de",
          }}>
            <h3 className="font-extrabold mb-4" style={{ color: "#0f172a" }}>الإشعارات</h3>
            <div className="space-y-3">
              {[
                { key: "newAds", label: "إعلانات جديدة", desc: "إشعار عند إضافة إعلانات جديدة" },
                { key: "strategies", label: "استراتيجيات جديدة", desc: "إشعار عند نشر استراتيجيات جديدة" },
                { key: "weeklyDigest", label: "ملخص أسبوعي", desc: "تلقي ملخص أسبوعي بأفضل الإعلانات" },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between py-3 border-b last:border-0" style={{ borderColor: "#e5e7eb" }}>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "#0f172a" }}>{label}</p>
                    <p className="text-xs" style={{ color: "#9ca3af" }}>{desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifs((n) => ({ ...n, [key]: !n[key as keyof typeof n] }))}
                    className="w-12 h-6 rounded-full transition-all relative"
                    style={{ background: notifs[key as keyof typeof notifs] ? "#2563eb" : "#e5e7eb" }}>
                    <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all"
                      style={{ right: notifs[key as keyof typeof notifs] ? "2px" : "auto", left: notifs[key as keyof typeof notifs] ? "auto" : "2px" }} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </AppLayout>
  );
}
