"use client";

import { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import PlatformBadge from "../components/PlatformBadge";
import { type Influencer, type Platform } from "../lib/mockData";
import { fetchInfluencers } from "../lib/db";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { getImageUrl } from "../lib/imageUrl";

function getCountryFlag(country: string): string {
  const flags: Record<string, string> = {
    "السعودية": "🇸🇦", "الإمارات": "🇦🇪", "الكويت": "🇰🇼",
    "مصر": "🇪🇬", "قطر": "🇶🇦", "البحرين": "🇧🇭", "عمان": "🇴🇲",
  };
  return flags[country] ?? "🌍";
}

function InfluencerModal({ inf, onClose }: { inf: Influencer; onClose: () => void }) {
  const [tab, setTab] = useState<"info" | "contact">("info");
  const [contactForm, setContactForm] = useState({ name: "", email: "", type: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [barsAnimated, setBarsAnimated] = useState(false);

  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setBarsAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

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
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-xl rounded-2xl shadow-2xl overflow-y-auto"
        style={{ background: "#ced3de", border: "1px solid rgba(206,211,222,0.8)", animation: "modalIn 0.2s cubic-bezier(0.34,1.56,0.64,1)", maxHeight: "85vh", WebkitOverflowScrolling: "touch", touchAction: "pan-y" }}
      >
        <style>{`@keyframes modalIn{from{opacity:0;transform:scale(0.95) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div className="flex items-center gap-4">
            {(inf as unknown as Record<string, string>).profile_image ? (
              <img src={getImageUrl("influencer-photos", (inf as unknown as Record<string, string>).profile_image)}
                alt={inf.name} className="w-24 h-24 rounded-full object-cover shrink-0"
                onError={(e) => { e.currentTarget.src = "/fallback.png"; e.currentTarget.style.display = "block"; }} />
            ) : (
              <div className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-black text-white shrink-0"
                style={{ background: inf.color }}>
                {inf.initial}
              </div>
            )}
            <div>
              <h2 className="text-xl font-black text-slate-900">{inf.name}</h2>
              <p className="text-sm text-slate-700">{inf.category} {getCountryFlag(inf.country ?? "")}</p>
              <div className="flex gap-1 mt-1">
                {(inf.platforms ?? []).map((p) => <PlatformBadge key={p} platform={p as Platform} />)}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-300 px-6">
          {(["info", "contact"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className="px-4 py-2 text-sm font-semibold border-b-2 transition-colors -mb-px"
              style={{
                borderBottomColor: tab === t ? "#2563eb" : "transparent",
                color: tab === t ? "#15803d" : "#64748b",
              }}>
              {t === "info" ? "معلومات المؤثر" : "طلب تعاون"}
            </button>
          ))}
        </div>

        {tab === "info" ? (
          <div className="px-6 pb-6 space-y-5 pt-5">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white text-center">
                <p className="text-xl font-extrabold" style={{ color: "#2563eb" }}>{inf.followers}</p>
                <p className="text-xs text-slate-600">متابع</p>
              </div>
              <div className="p-3 rounded-xl bg-white text-center">
                <p className="text-xl font-extrabold" style={{ color: "#2563eb" }}>{inf.engagement}</p>
                <p className="text-xs text-slate-600">معدل التفاعل</p>
              </div>
            </div>

            {/* Bio */}
            <div>
              <p className="text-xs font-bold text-slate-900 mb-1">نبذة</p>
              <p className="text-sm text-slate-600 leading-relaxed">{inf.bio}</p>
            </div>

            {/* Contact Method — blurred */}
            <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-3">
              <p className="text-xs font-bold text-slate-900 mb-1">طريقة التواصل</p>
              <p className="text-sm text-slate-700 select-none" style={{ filter: "blur(4px)" }}>
                {(inf as any).contactEmail || "contact@gmail.com"}
              </p>
            </div>

            {/* Niche */}
            {!!(inf as unknown as Record<string, unknown>).niche && (
              <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-3">
                <p className="text-xs font-bold text-slate-900 mb-1">مجال المؤثر</p>
                <p className="text-sm text-slate-700">{(inf as unknown as Record<string, string>).niche}</p>
              </div>
            )}

            {/* Target Audience */}
            {!!(inf as unknown as Record<string, unknown>).target_audience && (
              <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-3">
                <p className="text-xs font-bold text-slate-900 mb-1">الجمهور المستهدف</p>
                <p className="text-sm text-slate-700">{(inf as unknown as Record<string, string>).target_audience}</p>
              </div>
            )}

            {/* Interests */}
            {((inf as unknown as Record<string, unknown>).interests as string[] | undefined)?.length ? (
              <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-3">
                <p className="text-xs font-bold text-slate-900 mb-2">الاهتمامات</p>
                <div className="flex flex-wrap gap-1.5">
                  {((inf as unknown as Record<string, string[]>).interests ?? []).map((interest: string) => (
                    <span key={interest} className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs">#{interest}</span>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Historical Performance */}
            {!!(inf as unknown as Record<string, unknown>).historical_performance && typeof (inf as unknown as Record<string, unknown>).historical_performance === "object" && (
              <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-3">
                <p className="text-xs font-bold text-slate-900 mb-2">الأداء التاريخي</p>
                <div className="space-y-1">
                  {Object.entries((inf as unknown as Record<string, Record<string, string>>).historical_performance ?? {}).map(([key, val]) => (
                    <div key={key} className="flex justify-between text-xs">
                      <span className="text-slate-600">{key}</span>
                      <span className="text-slate-900 font-semibold">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Demographics */}
            {!!(inf as unknown as Record<string, unknown>).demographics && typeof (inf as unknown as Record<string, unknown>).demographics === "object" && (
              <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-3">
                <p className="text-xs font-bold text-slate-900 mb-2">التركيبة السكانية</p>
                <div className="space-y-1">
                  {Object.entries((inf as unknown as Record<string, Record<string, string>>).demographics ?? {}).map(([key, val]) => (
                    <div key={key} className="flex justify-between text-xs">
                      <span className="text-slate-600">{key}</span>
                      <span className="text-slate-900 font-semibold">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Audience age — animated bars */}
            {(inf.audienceAge ?? []).length > 0 && (
              <div>
                <p className="text-xs font-bold text-slate-900 mb-2">توزيع الجمهور حسب العمر</p>
                <div className="space-y-2">
                  {(inf.audienceAge ?? []).map((a) => (
                    <div key={a.label} className="flex items-center gap-3">
                      <span className="text-xs text-slate-600 w-12 text-left">{a.label}</span>
                      <div className="flex-1 h-2 rounded-full bg-white overflow-hidden">
                        <div
                          className="h-full rounded-full bg-blue-500"
                          style={{
                            width: barsAnimated ? `${a.pct}%` : "0%",
                            transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)",
                          }}
                        />
                      </div>
                      <span className="text-xs text-slate-600 w-8">{a.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Audience country */}
            {inf.audienceCountry && inf.audienceCountry.length > 0 && (
              <div>
                <p className="text-xs font-bold text-slate-900 mb-2">توزيع الجمهور حسب البلد</p>
                <div className="space-y-2">
                  {inf.audienceCountry.map((a) => (
                    <div key={a.label} className="flex items-center gap-3">
                      <span className="text-xs text-slate-600 w-16">{a.label}</span>
                      <div className="flex-1 h-2 rounded-full bg-white overflow-hidden">
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
                <h3 className="text-lg font-extrabold mb-2" style={{ color: "#0f172a" }}>تم إرسال طلبك!</h3>
                <p className="text-sm" style={{ color: "#64748b" }}>سنتواصل معك خلال 48 ساعة.</p>
                <button onClick={() => { setSubmitted(false); setTab("info"); }}
                  className="mt-5 px-5 py-2 rounded-xl text-sm font-bold border border-slate-300"
                  style={{ color: "#64748b" }}>
                  رجوع
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold mb-1" style={{ color: "#64748b" }}>اسمك</label>
                  <input type="text" required value={contactForm.name}
                    onChange={(e) => setContactForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="محمد أحمد"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white outline-none text-sm focus:border-blue-500/60 transition-colors"
                    style={{ color: "#0f172a" }} />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1" style={{ color: "#64748b" }}>بريدك الإلكتروني</label>
                  <input type="email" required value={contactForm.email}
                    onChange={(e) => setContactForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="you@example.com"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white outline-none text-sm focus:border-blue-500/60 transition-colors"
                    style={{ color: "#0f172a" }} dir="ltr" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1" style={{ color: "#64748b" }}>نوع التعاون</label>
                  <select required value={contactForm.type}
                    onChange={(e) => setContactForm((f) => ({ ...f, type: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white outline-none text-sm"
                    style={{ color: "#0f172a" }}>
                    <option value="">اختر نوع التعاون</option>
                    <option>إعلان ممول</option>
                    <option>مراجعة منتج</option>
                    <option>سفير علامة تجارية</option>
                    <option>محتوى مشترك</option>
                    <option>حضور فعالية</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1" style={{ color: "#64748b" }}>رسالتك</label>
                  <textarea required rows={4} value={contactForm.message}
                    onChange={(e) => setContactForm((f) => ({ ...f, message: e.target.value }))}
                    placeholder="اكتب تفاصيل طلبك هنا..."
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white outline-none text-sm resize-none focus:border-blue-500/60 transition-colors"
                    style={{ color: "#0f172a" }} />
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
          <p className="text-sm text-[#94a3b8] mt-1">اكتشف أبرز المؤثرين في السعودية 🇸🇦</p>
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
                    alt={inf.name} className="w-20 h-20 rounded-2xl object-cover shrink-0"
                    onError={(e) => { e.currentTarget.src = "/fallback.png"; e.currentTarget.style.display = "block"; }} />
                ) : (
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-lg font-black text-white shrink-0"
                    style={{ background: inf.color }}>
                    {inf.initial}
                  </div>
                )}
                <div>
                  <p className="font-black text-base transition-colors group-hover:text-blue-400 text-slate-900">{inf.name} {getCountryFlag(inf.country ?? "")}</p>
                  <p className="text-sm text-slate-700">{inf.category}</p>
                </div>
              </div>

              {/* Platform badges */}
              <div className="flex flex-wrap gap-1 mb-4">
                {(inf.platforms ?? []).map((p) => <PlatformBadge key={p} platform={p as Platform} />)}
              </div>

              {/* Stats row */}
              <div className="flex gap-3 mb-4 pb-4 border-b border-slate-300">
                <div>
                  <p className="text-base font-extrabold" style={{ color: "#2563eb" }}>{inf.followers}</p>
                  <p className="text-xs text-[#94a3b8]">متابع</p>
                </div>
                <div className="w-px bg-slate-300" />
                <div>
                  <p className="text-base font-extrabold" style={{ color: "#2563eb" }}>{inf.engagement}</p>
                  <p className="text-xs text-[#94a3b8]">تفاعل</p>
                </div>
              </div>

              {!!inf.niche && (
                <p className="text-xs text-slate-500 mt-1 text-left" dir="ltr">{inf.niche}</p>
              )}
              {(inf.interests ?? []).length > 0 && (
                <div className="flex justify-start flex-wrap gap-1 mt-2" dir="ltr">
                  {(inf.interests ?? []).slice(0, 3).map((i: string) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-blue-100/60 text-blue-800">#{i}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {selected && <InfluencerModal inf={selected} onClose={() => setSelected(null)} />}
    </AppLayout>
  );
}
