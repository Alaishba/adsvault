"use client";

import { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import PlatformBadge from "../components/PlatformBadge";
import { type Influencer, type Platform } from "../lib/mockData";
import { fetchInfluencers } from "../lib/db";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { getImageUrl } from "../lib/imageUrl";

function InfluencerModal({ inf, onClose }: { inf: Influencer; onClose: () => void }) {
  const [tab, setTab] = useState<"info" | "contact">("info");
  const [contactForm, setContactForm] = useState({ name: "", email: "", type: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError(null);
    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase.from("contact_requests").insert({
          name: contactForm.name,
          email: contactForm.email,
          company: contactForm.type,
          message: `طلب تعاون مع ${inf.name}: ${contactForm.message}`,
          created_at: new Date().toISOString(),
        });
        if (error) throw error;
      }
      setSubmitted(true);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "حدث خطأ، حاول مجدداً");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-xl rounded-2xl shadow-2xl overflow-y-auto"
        style={{ background: "#ced3de", animation: "modalIn 0.2s cubic-bezier(0.34,1.56,0.64,1)", maxHeight: "90vh" }}
      >
        <style>{`@keyframes modalIn{from{opacity:0;transform:scale(0.95) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div className="flex items-center gap-4">
            {(inf as unknown as Record<string, string>).profile_image ? (
              <img src={getImageUrl("influencer-photos", (inf as unknown as Record<string, string>).profile_image)}
                alt={inf.name} className="w-16 h-16 rounded-2xl object-cover shrink-0"
                onError={(e) => { e.currentTarget.src = "/fallback.png"; e.currentTarget.style.display = "block"; }} />
            ) : (
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white shrink-0"
                style={{ background: inf.color }}>
                {inf.initial}
              </div>
            )}
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">{inf.name}</h2>
              <p className="text-sm text-slate-600">{inf.category} · {inf.country}</p>
              <div className="flex gap-1 mt-1">
                {(inf.platforms ?? []).map((p) => <PlatformBadge key={p} platform={p as Platform} />)}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 hover:bg-white/10 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 px-6">
          {(["info", "contact"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className="px-4 py-2 text-sm font-semibold border-b-2 transition-colors -mb-px"
              style={{
                borderBottomColor: tab === t ? "#2563eb" : "transparent",
                color: tab === t ? "#15803d" : "var(--text-secondary)",
              }}>
              {t === "info" ? "معلومات المؤثر" : "طلب تعاون"}
            </button>
          ))}
        </div>

        {tab === "info" ? (
          <div className="px-6 pb-6 space-y-5 pt-5">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white/5 text-center">
                <p className="text-xl font-extrabold" style={{ color: "#2563eb" }}>{inf.followers}</p>
                <p className="text-xs text-slate-600">متابع</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 text-center">
                <p className="text-xl font-extrabold" style={{ color: "#2563eb" }}>{inf.engagement}</p>
                <p className="text-xs text-slate-600">معدل التفاعل</p>
              </div>
            </div>

            {/* Bio */}
            <div>
              <p className="text-xs font-bold text-slate-900 mb-1">نبذة</p>
              <p className="text-sm text-slate-600 leading-relaxed">{inf.bio}</p>
            </div>

            {/* Audience age */}
            <div>
              <p className="text-xs font-bold text-slate-900 mb-2">توزيع الجمهور حسب العمر</p>
              <div className="space-y-2">
                {(inf.audienceAge ?? []).map((a) => (
                  <div key={a.label} className="flex items-center gap-3">
                    <span className="text-xs text-slate-600 w-12 text-left">{a.label}</span>
                    <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${a.pct}%`, background: "#2563eb" }} />
                    </div>
                    <span className="text-xs text-slate-600 w-8">{a.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Audience country */}
            {inf.audienceCountry && inf.audienceCountry.length > 0 && (
              <div>
                <p className="text-xs font-bold text-slate-900 mb-2">توزيع الجمهور حسب البلد</p>
                <div className="space-y-2">
                  {inf.audienceCountry.map((a) => (
                    <div key={a.label} className="flex items-center gap-3">
                      <span className="text-xs text-slate-600 w-16">{a.label}</span>
                      <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${a.pct}%`, background: "#3b82f6" }} />
                      </div>
                      <span className="text-xs text-slate-600 w-8">{a.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strengths/Weaknesses */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-bold text-slate-900 mb-2">نقاط قوة</p>
                <div className="flex flex-wrap gap-1">
                  {(inf.strengths ?? []).map((s) => (
                    <span key={s} className="px-2 py-0.5 text-xs rounded-full font-medium" style={{ background: "#f0faf0", color: "#15803d" }}>{s}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 mb-2">نقاط ضعف</p>
                <div className="flex flex-wrap gap-1">
                  {(inf.weaknesses ?? []).map((w) => (
                    <span key={w} className="px-2 py-0.5 text-xs rounded-full font-medium" style={{ background: "#fef2f2", color: "#b91c1c" }}>{w}</span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setTab("contact")}
              className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90"
              style={{ background: "#2563eb", color: "#fff" }}
            >
              طلب تعاون
            </button>
          </div>
        ) : (
          <div className="px-6 pb-6 pt-5">
            {submitted ? (
              <div className="text-center py-10">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mx-auto mb-4" style={{ background: "#f0faf0" }}>✅</div>
                <h3 className="text-lg font-extrabold mb-2" style={{ color: "var(--text-primary)" }}>تم إرسال طلبك!</h3>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>سنتواصل معك خلال 48 ساعة.</p>
                <button onClick={() => { setSubmitted(false); setTab("info"); }}
                  className="mt-5 px-5 py-2 rounded-xl text-sm font-bold border border-white/10"
                  style={{ color: "var(--text-secondary)" }}>
                  رجوع
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold mb-1" style={{ color: "var(--text-secondary)" }}>اسمك</label>
                  <input type="text" required value={contactForm.name}
                    onChange={(e) => setContactForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="محمد أحمد"
                    className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 outline-none text-sm focus:border-blue-500/60 transition-colors"
                    style={{ color: "var(--text-primary)" }} />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1" style={{ color: "var(--text-secondary)" }}>بريدك الإلكتروني</label>
                  <input type="email" required value={contactForm.email}
                    onChange={(e) => setContactForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="you@example.com"
                    className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 outline-none text-sm focus:border-blue-500/60 transition-colors"
                    style={{ color: "var(--text-primary)" }} dir="ltr" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1" style={{ color: "var(--text-secondary)" }}>نوع التعاون</label>
                  <select required value={contactForm.type}
                    onChange={(e) => setContactForm((f) => ({ ...f, type: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 outline-none text-sm"
                    style={{ color: "var(--text-primary)" }}>
                    <option value="">اختر نوع التعاون</option>
                    <option>إعلان ممول</option>
                    <option>مراجعة منتج</option>
                    <option>سفير علامة تجارية</option>
                    <option>محتوى مشترك</option>
                    <option>حضور فعالية</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1" style={{ color: "var(--text-secondary)" }}>رسالتك</label>
                  <textarea required rows={4} value={contactForm.message}
                    onChange={(e) => setContactForm((f) => ({ ...f, message: e.target.value }))}
                    placeholder="اكتب تفاصيل طلبك هنا..."
                    className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 outline-none text-sm resize-none focus:border-blue-500/60 transition-colors"
                    style={{ color: "var(--text-primary)" }} />
                </div>
                {submitError && (
                  <div className="px-3 py-2 rounded-lg text-xs" style={{ background: "#fef2f2", color: "#b91c1c" }}>{submitError}</div>
                )}
                <button type="submit" disabled={submitLoading}
                  className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 disabled:opacity-60"
                  style={{ background: "#2563eb", color: "#fff" }}>
                  {submitLoading ? "جارٍ الإرسال..." : "إرسال الطلب"}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function InfluencersPage() {
  const [selected, setSelected] = useState<Influencer | null>(null);
  const [influencers, setInfluencers] = useState<Influencer[]>([]);

  useEffect(() => { fetchInfluencers().then(setInfluencers); }, []);

  return (
    <AppLayout>
      <div className="px-6 lg:px-10 py-8">
        <div className="mb-7">
          <h1 className="text-2xl font-extrabold text-[#ffffff]">المؤثرون</h1>
          <p className="text-sm text-[#94a3b8] mt-1">اكتشف أبرز المؤثرين في المنطقة العربية وحلّل أداءهم</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {influencers.map((inf) => (
            <div
              key={inf.id}
              onClick={() => setSelected(inf)}
              className="rounded-2xl p-5 cursor-pointer transition-all hover:shadow-md hover:scale-[1.02] group"
              style={{ background: "#ced3de", border: "1px solid #ced3de", borderRadius: "12px" }}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                {(inf as unknown as Record<string, string>).profile_image ? (
                  <img src={getImageUrl("influencer-photos", (inf as unknown as Record<string, string>).profile_image)}
                    alt={inf.name} className="w-12 h-12 rounded-2xl object-cover shrink-0"
                    onError={(e) => { e.currentTarget.src = "/fallback.png"; e.currentTarget.style.display = "block"; }} />
                ) : (
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black text-white shrink-0"
                    style={{ background: inf.color }}>
                    {inf.initial}
                  </div>
                )}
                <div>
                  <p className="font-bold text-sm transition-colors group-hover:text-blue-400" style={{ color: "#ffffff" }}>{inf.name}</p>
                  <p className="text-xs text-[#94a3b8]">{inf.category} · {inf.country}</p>
                </div>
              </div>

              {/* Platform badges */}
              <div className="flex flex-wrap gap-1 mb-4">
                {(inf.platforms ?? []).map((p) => <PlatformBadge key={p} platform={p as Platform} />)}
              </div>

              {/* Stats row */}
              <div className="flex gap-3 mb-4 pb-4 border-b border-white/10">
                <div>
                  <p className="text-base font-extrabold" style={{ color: "#2563eb" }}>{inf.followers}</p>
                  <p className="text-xs text-[#94a3b8]">متابع</p>
                </div>
                <div className="w-px bg-white/10" />
                <div>
                  <p className="text-base font-extrabold" style={{ color: "#2563eb" }}>{inf.engagement}</p>
                  <p className="text-xs text-[#94a3b8]">تفاعل</p>
                </div>
              </div>

              {/* Strength tags */}
              <div className="flex flex-wrap gap-1">
                {(inf.strengths ?? []).slice(0, 2).map((s) => (
                  <span key={s} className="px-2 py-0.5 text-xs rounded-full font-medium" style={{ background: "#f0faf0", color: "#15803d" }}>{s}</span>
                ))}
                {(inf.weaknesses ?? []).slice(0, 1).map((w) => (
                  <span key={w} className="px-2 py-0.5 text-xs rounded-full font-medium" style={{ background: "#fef2f2", color: "#b91c1c" }}>{w}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selected && <InfluencerModal inf={selected} onClose={() => setSelected(null)} />}
    </AppLayout>
  );
}
