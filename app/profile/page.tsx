"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import AppLayout from "../components/AppLayout";
import AdCard from "../components/AdCard";
import AdModal from "../components/AdModal";
import { useAuth } from "../context/AuthContext";
import { uploadFile } from "../lib/storage";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { type Ad, type Strategy } from "../lib/mockData";
import { fetchAds, fetchStrategies } from "../lib/db";

const tabs = [
  { id: "info", label: "معلوماتي" },
  { id: "subscription", label: "اشتراكي" },
  { id: "saved", label: "المفضلة" },
  { id: "strategies", label: "استراتيجياتي" },
  { id: "preferences", label: "التفضيلات" },
];

const planLabels: Record<string, { label: string; color: string; bg: string }> = {
  free: { label: "مجاني", color: "#6b7280", bg: "#f3f5f9" },
  pro: { label: "Pro", color: "#84cc18", bg: "#f7fee7" },
  enterprise: { label: "Enterprise", color: "#1d4ed8", bg: "#eff6ff" },
  admin: { label: "Admin", color: "#b91c1c", bg: "#fef2f2" },
};

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("info");
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.avatar ?? null);
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [email] = useState(user?.email ?? "");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [saved, setSaved] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);
  const [notifs, setNotifs] = useState({ newAds: true, strategies: true, weeklyDigest: false });

  const [savedAds, setSavedAds] = useState<Ad[]>([]);
  const [savedStrategies, setSavedStrategies] = useState<Strategy[]>([]);

  useEffect(() => {
    // Load real data
    fetchAds().then((all) => setSavedAds(all.slice(0, 6)));
    fetchStrategies().then(setSavedStrategies);
  }, []);

  const plan = user?.plan ?? "free";
  const isPro = plan === "pro" || plan === "enterprise" || plan === "admin";
  const planInfo = planLabels[plan] ?? planLabels.free;
  const initials = name.trim().split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "؟";

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url, error } = await uploadFile("user-avatars", file, `${user?.id ?? "anon"}-avatar`);
      if (error) throw new Error(error);
      if (url) {
        setAvatarUrl(url);
        // Persist avatar URL to Supabase
        if (isSupabaseConfigured() && user?.id) {
          await supabase.from("users").update({ avatar_url: url }).eq("id", user.id);
        }
      }
    } catch { /* silent */ }
    setUploading(false);
  };

  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSaveInfo = async () => {
    setSaved(false);
    setSaveError(null);
    try {
      if (isSupabaseConfigured() && user?.id) {
        const { error } = await supabase.from("users").update({
          full_name: name,
        }).eq("id", user.id);
        if (error) throw error;
      }
      setTimeout(() => setSaved(true), 1500);
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : "حدث خطأ في حفظ البيانات");
      setSaved(true);
    }
  };

  const inputStyle = { background: "#ffffff", border: "1px solid #e5e7eb", color: "#1c1c1e" };

  return (
    <AppLayout>
      <div className="px-6 lg:px-10 py-8 max-w-4xl mx-auto">
        {/* Hero header (glassmorphism) */}
        <div className="rounded-2xl p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-5" style={{
          background: "rgba(137,87,246,0.06)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(137,87,246,0.15)",
        }}>
          <div className="relative shrink-0 group">
            {avatarUrl ? (
              <img src={avatarUrl} alt="avatar" className="w-20 h-20 rounded-2xl object-cover" style={{ border: "3px solid #84cc18" }} />
            ) : (
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black text-white"
                style={{ background: "#8957f6", border: "3px solid #84cc18" }}>{initials}</div>
            )}
            <button onClick={() => fileRef.current?.click()} disabled={uploading}
              className="absolute -bottom-1 -left-1 w-7 h-7 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all"
              style={{ background: "#84cc18" }}>
              {uploading ? (
                <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeDasharray="60" strokeDashoffset="20"/></svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
              )}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-extrabold" style={{ color: "#1c1c1e" }}>{name || "المستخدم"}</h1>
            <p className="text-sm" style={{ color: "#6b7280" }}>{email}</p>
            <span className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold"
              style={{ background: planInfo.bg, color: planInfo.color }}>{planInfo.label}</span>
            <div className="flex gap-5 mt-3">
              <div><span className="text-sm font-extrabold" style={{ color: "#84cc18" }}>3</span> <span className="text-xs" style={{ color: "#6b7280" }}>محفوظات</span></div>
              <div><span className="text-sm font-extrabold" style={{ color: "#84cc18" }}>2</span> <span className="text-xs" style={{ color: "#6b7280" }}>استراتيجيات</span></div>
              <div><span className="text-xs" style={{ color: "#6b7280" }}>انضم مارس 2025</span></div>
            </div>
          </div>
          <button onClick={logout}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{ color: "#ef4444", border: "1px solid #e5e7eb" }}>
            تسجيل الخروج
          </button>
        </div>

        {/* Tabs (glassmorphism) */}
        <div className="flex gap-1 mb-6 overflow-x-auto rounded-xl p-1" style={{
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(209,209,214,0.4)",
        }}>
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className="px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all shrink-0"
              style={{
                background: activeTab === tab.id ? "#84cc18" : "transparent",
                color: activeTab === tab.id ? "#fff" : "#6b7280",
              }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab: معلوماتي */}
        {activeTab === "info" && (
          <div className="rounded-2xl p-6" style={{
            background: "rgba(255,255,255,0.8)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(209,209,214,0.4)",
          }}>
            <h3 className="font-extrabold mb-5" style={{ color: "#1c1c1e" }}>المعلومات الشخصية</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "الاسم الكامل", value: name, setter: setName, placeholder: "محمد أحمد", type: "text" },
                { label: "المسمى الوظيفي", value: jobTitle, setter: setJobTitle, placeholder: "مدير تسويق", type: "text" },
                { label: "الشركة", value: company, setter: setCompany, placeholder: "اسم الشركة", type: "text" },
                { label: "رقم الجوال", value: phone, setter: setPhone, placeholder: "+966 5x xxx xxxx", type: "tel" },
              ].map(({ label, value, setter, placeholder, type }) => (
                <div key={label}>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: "#1c1c1e" }}>{label}</label>
                  <input type={type} value={value} onChange={(e) => setter(e.target.value)} placeholder={placeholder}
                    className="w-full px-4 py-2.5 rounded-xl outline-none text-sm focus:ring-2 focus:ring-[#84cc18]/30 transition-all"
                    style={inputStyle} />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "#1c1c1e" }}>البريد الإلكتروني</label>
                <input type="email" value={email} disabled dir="ltr"
                  className="w-full px-4 py-2.5 rounded-xl outline-none text-sm opacity-60 cursor-not-allowed"
                  style={{ background: "#f3f5f9", border: "1px solid #e5e7eb", color: "#1c1c1e" }} />
              </div>
            </div>
            <button onClick={handleSaveInfo}
              className="mt-5 px-6 py-2.5 rounded-xl font-bold text-sm text-white hover:opacity-90 transition-all"
              style={{ background: saved ? "#84cc18" : "#059669" }}>
              {saved ? "حفظ التغييرات" : "✓ جارٍ الحفظ..."}
            </button>
          </div>
        )}

        {/* Tab: اشتراكي */}
        {activeTab === "subscription" && (
          <div className="rounded-2xl p-6" style={{
            background: isPro ? "rgba(137,87,246,0.08)" : "rgba(255,255,255,0.8)",
            backdropFilter: "blur(10px)",
            border: isPro ? "1px solid rgba(137,87,246,0.2)" : "1px solid rgba(209,209,214,0.4)",
          }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#f3eeff" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8957f6" strokeWidth="2">
                  <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
              </div>
              <div>
                <p className="font-extrabold" style={{ color: "#1c1c1e" }}>خطة {planInfo.label}</p>
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
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#84cc18" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  )}
                </div>
              ))}
            </div>
            <Link href="/pricing"
              className="block w-full py-3 rounded-xl font-bold text-sm text-center text-white hover:opacity-90 transition-all"
              style={{ background: isPro ? "#8957f6" : "#84cc18" }}>
              {isPro ? "إدارة الاشتراك" : "ترقية إلى Pro →"}
            </Link>
          </div>
        )}

        {/* Tab: المفضلة */}
        {activeTab === "saved" && (
          <div>
            {savedAds.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {savedAds.slice(0, 3).map((ad) => (
                  <AdCard key={ad.id} ad={ad} onClick={setSelectedAd} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 rounded-2xl" style={{ background: "rgba(255,255,255,0.8)", border: "1px solid rgba(209,209,214,0.4)" }}>
                <div className="text-4xl mb-3">📌</div>
                <p className="font-bold" style={{ color: "#1c1c1e" }}>لم تحفظ أي إعلان بعد</p>
                <p className="text-sm mt-1" style={{ color: "#6b7280" }}>احفظ الإعلانات التي تعجبك لتعود إليها لاحقاً</p>
              </div>
            )}
          </div>
        )}

        {/* Tab: استراتيجياتي */}
        {activeTab === "strategies" && (
          <div>
            {savedStrategies.length > 0 ? (
              <div className="space-y-3">
                {savedStrategies.map((s) => (
                  <div key={s.id} className="rounded-xl p-4 flex items-center justify-between"
                    style={{ background: "#ffffff", border: "1px solid #e5e7eb" }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black text-white"
                        style={{ background: s.brandColor }}>{s.brandInitial}</div>
                      <div>
                        <p className="font-bold text-sm" style={{ color: "#1c1c1e" }}>{s.title}</p>
                        <p className="text-xs" style={{ color: "#6b7280" }}>{s.brand} · {s.sector}</p>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-lg" style={{ background: "#f7fee7", color: "#84cc18" }}>محفوظة</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 rounded-2xl" style={{ background: "rgba(255,255,255,0.8)", border: "1px solid rgba(209,209,214,0.4)" }}>
                <div className="text-4xl mb-3">📊</div>
                <p className="font-bold" style={{ color: "#1c1c1e" }}>لم تحفظ أي استراتيجية بعد</p>
                <p className="text-sm mt-1" style={{ color: "#6b7280" }}>استكشف الاستراتيجيات واحفظ ما يناسبك</p>
              </div>
            )}
          </div>
        )}

        {/* Tab: التفضيلات */}
        {activeTab === "preferences" && (
          <div className="rounded-2xl p-6" style={{
            background: "rgba(255,255,255,0.8)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(209,209,214,0.4)",
          }}>
            <h3 className="font-extrabold mb-4" style={{ color: "#1c1c1e" }}>الإشعارات</h3>
            <div className="space-y-3">
              {[
                { key: "newAds", label: "إعلانات جديدة", desc: "إشعار عند إضافة إعلانات جديدة" },
                { key: "strategies", label: "استراتيجيات جديدة", desc: "إشعار عند نشر استراتيجيات جديدة" },
                { key: "weeklyDigest", label: "ملخص أسبوعي", desc: "تلقي ملخص أسبوعي بأفضل الإعلانات" },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between py-3 border-b last:border-0" style={{ borderColor: "#e5e7eb" }}>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "#1c1c1e" }}>{label}</p>
                    <p className="text-xs" style={{ color: "#9ca3af" }}>{desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifs((n) => ({ ...n, [key]: !n[key as keyof typeof n] }))}
                    className="w-12 h-6 rounded-full transition-all relative"
                    style={{ background: notifs[key as keyof typeof notifs] ? "#84cc18" : "#e5e7eb" }}>
                    <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all"
                      style={{ right: notifs[key as keyof typeof notifs] ? "2px" : "auto", left: notifs[key as keyof typeof notifs] ? "auto" : "2px" }} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <AdModal ad={selectedAd} onClose={() => setSelectedAd(null)} />
    </AppLayout>
  );
}
