"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Ad, FunnelStage } from "../lib/mockData";
import PlatformBadge from "./PlatformBadge";
import { createClient } from "../lib/supabase/client";
import { getImageUrl } from "../lib/imageUrl";
import PaywallModal from "./PaywallModal";

type ProAnalysis = {
  hook?: string;
  creative_message?: string;
  targeting_strategy?: string;
  creative_strengths?: string[];
  apply_opportunities?: string[];
  analysis_images?: string[];
  video_url?: string;
  attachments?: string[];
  rating?: number;
  metrics?: { ctr?: string; reach?: string; conversion?: string };
};

const funnelConfig: Record<FunnelStage, { label: string; color: string; bg: string }> = {
  awareness:  { label: "وعي",    color: "#1d4ed8", bg: "#eff6ff" },
  interest:   { label: "اهتمام", color: "#b45309", bg: "#fef9c3" },
  conversion: { label: "تحويل",  color: "#15803d", bg: "#f0faf0" },
};

function MediaSwiper({ colors, brandColor }: { colors: string[]; brandColor: string }) {
  const [idx, setIdx] = useState(0);
  const rawItems = colors.length ? colors : [brandColor ?? "#2563eb"];
  const items = rawItems.map((item) => {
    if (!item || item.startsWith("#")) return item;
    return getImageUrl("ads-images", item);
  });

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => {
      setIdx((i) => (i + 1) % items.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [items.length]);

  const current = items[idx] ?? "";
  const isUrl = current.startsWith("http") || current.startsWith("blob:") || current.startsWith("data:");
  return (
    <div className="relative w-full h-full min-h-[320px] flex items-center justify-center overflow-hidden rounded-xl"
      style={{ background: isUrl ? "#f3f5f9" : (current + "22") }}>
      {isUrl ? (
        <img src={current} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "/fallback.png"; e.currentTarget.style.display = "block"; }} />
      ) : (
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl font-black text-white opacity-80"
          style={{ background: current }}>▶</div>
      )}
      {items.length > 1 && (
        <>
          <button onClick={() => setIdx((i) => (i === 0 ? items.length - 1 : i - 1))}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-white hover:scale-110 transition-all"
            style={{ background: "#00000055" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
          <button onClick={() => setIdx((i) => (i + 1) % items.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-white hover:scale-110 transition-all"
            style={{ background: "#00000055" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {items.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)}
                className="w-1.5 h-1.5 rounded-full transition-all"
                style={{ background: i === idx ? "#fff" : "#ffffff88" }} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ProBlurOverlay({ children, onUpgrade }: { children: React.ReactNode; onUpgrade: () => void }) {
  return (
    <div className="relative overflow-hidden rounded-xl">
      <div style={{ filter: "blur(5px)", userSelect: "none", pointerEvents: "none" }}>
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl"
        style={{ background: "linear-gradient(to top, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.5) 100%)" }}>
        <p className="text-white font-extrabold text-sm mb-1 text-center px-4">🔓 احصل على التحليل الكامل</p>
        <p className="text-white/80 text-xs mb-4 text-center px-4">ترقية إلى Pro للوصول الكامل</p>
        <button onClick={onUpgrade}
          className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
          style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.4)" }}>
          ترقية إلى Pro →
        </button>
      </div>
    </div>
  );
}

export default function AdModal({ ad, onClose }: { ad: Ad | null; onClose: () => void }) {
  const [isPro, setIsPro] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const supabase = createClient();
        const { data: { user: u } } = await supabase.auth.getUser();
        if (!mounted) return;
        if (u) {
          const { data: profile } = await supabase.from("users").select("plan").eq("id", u.id).single();
          if (!mounted) return;
          const p = profile?.plan ?? "free";
          setIsPro(p === "pro" || p === "enterprise" || p === "admin");
        }
      } catch {
        // silently ignore lock errors on unmount
      }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!ad) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [ad, onClose]);

  if (!ad) return null;

  const funnel = ad.funnel_stage ? funnelConfig[ad.funnel_stage] : null;
  const dataGrid = [
    { label: "العلامة",     value: ad.brand },
    { label: "القطاع",      value: ad.sector },
    { label: "المنصة",      value: ad.platform },
    { label: "البلد",       value: ad.country },
    { label: "الموسم",      value: ad.season ?? "—" },
    { label: "هدف الإعلان", value: ad.ad_goal ?? "—" },
  ];

  const pro = (ad as unknown as Record<string, unknown>).pro_analysis as ProAnalysis | null;

  const proContent = pro ? (
    <div className="space-y-4 px-5 py-5" style={{ background: "linear-gradient(180deg, #ced3de 0%, #1e3a5f 8%, #1e40af 100%)" }}>
      {/* Hook */}
      {pro.hook && (
        <div>
          <p className="text-xs font-bold text-blue-200 mb-1">الخطاف الرئيسي</p>
          <p className="text-sm text-white">{pro.hook}</p>
        </div>
      )}

      {/* Creative Message + Targeting Strategy — side by side */}
      {(pro.creative_message || pro.targeting_strategy) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {pro.creative_message && (
            <div className="bg-white/10 border border-white/20 rounded-xl p-3">
              <p className="text-xs font-bold text-blue-200 mb-1">الرسالة الإبداعية</p>
              <p className="text-sm text-white">{pro.creative_message}</p>
            </div>
          )}
          {pro.targeting_strategy && (
            <div className="bg-white/10 border border-white/20 rounded-xl p-3">
              <p className="text-xs font-bold text-blue-200 mb-1">استراتيجية الاستهداف</p>
              <p className="text-sm text-white">{pro.targeting_strategy}</p>
            </div>
          )}
        </div>
      )}

      {/* Creative Strengths */}
      {pro.creative_strengths && pro.creative_strengths.length > 0 && (
        <div>
          <p className="text-xs font-bold text-blue-200 mb-2">نقاط القوة الإبداعية</p>
          <ul className="space-y-1">
            {pro.creative_strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-blue-100">
                <span className="w-4 h-4 rounded-full bg-white/20 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">{i+1}</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Apply Opportunities */}
      {pro.apply_opportunities && pro.apply_opportunities.length > 0 && (
        <div>
          <p className="text-xs font-bold text-blue-200 mb-2">فرص التطبيق</p>
          <ul className="space-y-1">
            {pro.apply_opportunities.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-blue-100">
                <span className="w-4 h-4 rounded-full bg-white/20 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">{i+1}</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Metrics — animated cards */}
      {pro.metrics && (
        <div>
          <p className="text-xs font-bold text-blue-200 mb-2">مؤشرات الأداء المتوقعة</p>
          <div className="grid grid-cols-3 gap-3">
            {pro.metrics.reach && (
              <div className="bg-white/10 border border-white/20 rounded-2xl p-4 text-center">
                <p className="text-lg mb-1">👁</p>
                <p className="text-2xl font-black text-white">{pro.metrics.reach}</p>
                <p className="text-xs text-blue-200">الوصول</p>
              </div>
            )}
            {pro.metrics.ctr && (
              <div className="bg-white/10 border border-white/20 rounded-2xl p-4 text-center">
                <p className="text-lg mb-1">🖱</p>
                <p className="text-2xl font-black text-white">{pro.metrics.ctr}%</p>
                <p className="text-xs text-blue-200">نسبة النقر</p>
              </div>
            )}
            {pro.metrics.conversion && (
              <div className="bg-white/10 border border-white/20 rounded-2xl p-4 text-center">
                <p className="text-lg mb-1">🎯</p>
                <p className="text-2xl font-black text-white">{pro.metrics.conversion}%</p>
                <p className="text-xs text-blue-200">التحويل</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Analysis Images — full-width banner + thumbnails */}
      {pro.analysis_images && pro.analysis_images.length > 0 && (
        <div>
          <p className="text-xs font-bold text-blue-200 mb-2">صور التحليل</p>
          <div className="w-full h-48 overflow-hidden" style={{ border: "2px solid rgba(255,255,255,0.4)", borderRadius: 12 }}>
            <img src={getImageUrl("ads-images", pro.analysis_images[0])} alt="" className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.style.display = "none"; }} />
          </div>
          {pro.analysis_images.length > 1 && (
            <div className="flex gap-2 mt-2">
              {pro.analysis_images.slice(1, 4).map((img, i) => (
                <img key={i} src={getImageUrl("ads-images", img)} alt="" className="w-16 h-16 object-cover rounded-lg shrink-0"
                  onError={(e) => { e.currentTarget.style.display = "none"; }} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Video — large player card */}
      {pro.video_url && (
        <a href={pro.video_url} target="_blank" rel="noopener noreferrer"
          className="block bg-black/40 border border-white/20 rounded-2xl p-6 text-center hover:bg-black/60 transition-all cursor-pointer">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </div>
          <p className="text-white font-bold">▶ شاهد فيديو التحليل</p>
          <p className="text-blue-300 text-xs mt-1 truncate max-w-xs mx-auto">{pro.video_url}</p>
        </a>
      )}

      {/* Rating + Attachments — side by side */}
      {((pro.rating && pro.rating > 0) || (pro.attachments && pro.attachments.length > 0)) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Rating */}
          {pro.rating && pro.rating > 0 && (
            <div className="bg-white/10 border border-white/20 rounded-2xl p-4">
              <p className="text-xs font-bold text-blue-200 mb-2">تقييم الإعلان</p>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[1,2,3,4,5].map((star) => (
                    <span key={star} className="text-3xl" style={{ color: star <= pro.rating! ? "#eab308" : "rgba(255,255,255,0.2)" }}>★</span>
                  ))}
                </div>
                <span className="text-white font-bold text-lg">{pro.rating}/5</span>
              </div>
            </div>
          )}
          {/* Attachments */}
          {pro.attachments && pro.attachments.length > 0 && (
            <div className="space-y-2">
              {pro.attachments.slice(0, 2).map((file, i) => (
                <a key={i} href={getImageUrl("ads-images", file)} target="_blank" rel="noopener noreferrer"
                  className="block bg-white/15 border border-white/30 rounded-2xl p-4 text-center hover:bg-white/25 hover:scale-105 transition-all">
                  <p className="text-3xl mb-1">📄</p>
                  <p className="text-white text-xs font-medium">ملف {i + 1}</p>
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  ) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 lg:p-6"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden overflow-y-auto modal-scroll"
        style={{ maxHeight: "85vh", background: "#ced3de", border: "1px solid rgba(206,211,222,0.8)", animation: "modalIn 0.2s cubic-bezier(0.34,1.56,0.64,1)", WebkitOverflowScrolling: "touch", touchAction: "pan-y", scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.3) transparent" }}>
        <style>{`
          @keyframes modalIn{from{opacity:0;transform:scale(0.95) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}
          .modal-scroll::-webkit-scrollbar{width:4px}
          .modal-scroll::-webkit-scrollbar-track{background:transparent}
          .modal-scroll::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.3);border-radius:4px}
        `}</style>

        {/* TOP: two columns */}
        <div className="flex flex-col md:flex-row">
          {/* RIGHT (60%) — media */}
          <div className="md:w-[60%] shrink-0 p-4 border-b md:border-b-0 md:border-l border-slate-300">
            <MediaSwiper colors={ad.images ?? []} brandColor={ad.brandColor} />
          </div>

          {/* LEFT (40%) — content */}
          <div className="flex-1 min-w-0 p-5 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-sm font-extrabold truncate text-slate-700">{ad.brand}</span>
                  <PlatformBadge platform={ad.platform} />
                  {funnel && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{ background: funnel.bg, color: funnel.color }}>{funnel.label}</span>
                  )}
                </div>
                <h2 className="text-lg font-extrabold leading-snug text-slate-900">{ad.title}</h2>
              </div>
              <button onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 hover:bg-slate-200 transition-colors text-slate-500">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>

            {(ad.tags ?? []).length > 0 && (
              <div className="flex flex-wrap gap-1">
                {(ad.tags ?? []).map((tag) => (
                  <span key={tag} className="px-2 py-0.5 text-xs rounded-full font-medium"
                    style={{ background: "var(--primary-light)", color: "var(--primary-text)" }}>#{tag}</span>
                ))}
              </div>
            )}

            {ad.source_url && (
              <a href={ad.source_url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300 w-fit hover:border-blue-400 transition-all text-slate-600">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
                المصدر الأصلي
              </a>
            )}

            <p className="text-xs leading-relaxed line-clamp-3 text-slate-600">{ad.description}</p>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {dataGrid.map((d) => (
                <div key={d.label} className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{d.label}</span>
                  <span className="text-xs font-semibold truncate text-slate-900">{d.value}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-4 pt-2 border-t border-slate-300">
              <div>
                <p className="text-base font-extrabold text-slate-900">{ad.views}</p>
                <p className="text-[10px] text-slate-500">مشاهدة</p>
              </div>
              <div>
                <p className="text-base font-extrabold text-slate-900">{ad.saved}</p>
                <p className="text-[10px] text-slate-500">محفوظ</p>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM: analysis */}
        <div className="border-t border-slate-300">
          {/* Basic analysis — always visible */}
          {ad.basic_analysis && ad.basic_analysis.length > 0 && (
            <div className="px-5 py-4 bg-blue-100/60 border-t border-blue-300/50 backdrop-blur-sm">
              <p className="text-sm font-extrabold mb-3 flex items-center gap-2 text-slate-900">
                <span>⚡</span> التحليل الأساسي
              </p>
              <ul className="space-y-2">
                {(ad.basic_analysis ?? []).map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                    <span className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold text-white bg-blue-600">{i + 1}</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Free fields — always visible */}
          {ad.apply_idea && ad.apply_idea.length > 0 && (
            <div className="px-5 py-4 border-t border-slate-300">
              <p className="text-sm font-extrabold mb-3 flex items-center gap-2 text-slate-900">
                <span>💡</span> خطوات التطبيق
              </p>
              <ol className="space-y-2">
                {ad.apply_idea.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                    <span className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold text-white bg-blue-600">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {ad.recommended_action && (
            <div className="px-5 py-4 border-t border-slate-300">
              <p className="text-sm font-extrabold mb-2 flex items-center gap-2 text-slate-900">
                <span>🎯</span> الإجراء الموصى به
              </p>
              <p className="text-sm font-bold text-blue-700">{ad.recommended_action}</p>
            </div>
          )}

          {ad.video_url && (
            <div className="px-5 py-3 border-t border-slate-300">
              <a href={ad.video_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-700 text-sm font-semibold hover:underline">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                رابط الفيديو
              </a>
            </div>
          )}

          {/* Pro analysis header + content — blurred for free users */}
          {!!pro && (
            <>
              <div className="py-4 flex justify-center border-t border-slate-300" style={{ background: "#ced3de" }}>
                <span className="px-6 py-2 rounded-full bg-white/15 border border-white/30 text-xs font-black text-blue-700 flex items-center gap-2">
                  🔒 التحليل المتقدم — Pro
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-600 text-white">Pro</span>
                </span>
              </div>
              {isPro ? proContent : <ProBlurOverlay onUpgrade={() => setShowPaywall(true)}>{proContent}</ProBlurOverlay>}
            </>
          )}
        </div>
      </div>
      {showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} />}
    </div>
  );
}
