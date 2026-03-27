"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Ad, FunnelStage } from "../lib/mockData";
import PlatformBadge from "./PlatformBadge";
import { createClient } from "../lib/supabase/client";
import { getImageUrl } from "../lib/imageUrl";
import PaywallModal from "./PaywallModal";

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
  const current = items[idx] ?? "";
  const isUrl = current.startsWith("http") || current.startsWith("blob:") || current.startsWith("data:");
  return (
    <div className="relative w-full h-full min-h-[220px] flex items-center justify-center overflow-hidden rounded-xl"
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
    (async () => {
      const supabase = createClient();
      const { data: { user: u } } = await supabase.auth.getUser();
      if (u) {
        const { data: profile } = await supabase.from("users").select("plan").eq("id", u.id).single();
        const p = profile?.plan ?? "free";
        setIsPro(p === "pro" || p === "enterprise" || p === "admin");
      }
    })();
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

  const proContent = (
    <div className="divide-y divide-[--border]">
      {ad.apply_idea && ad.apply_idea.length > 0 && (
        <div className="px-5 py-4">
          <p className="text-sm font-extrabold mb-3 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
            <span>💡</span> كيف تطبق هذه الفكرة على مشروعك؟
          </p>
          <ol className="space-y-2">
            {(ad.apply_idea ?? []).map((step, i) => (
              <li key={i} className="flex items-start gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                <span className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold text-white"
                  style={{ background: "#2563eb" }}>{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      )}
      {ad.recommended_action && (
        <div className="px-5 py-4">
          <p className="text-sm font-extrabold mb-2 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
            <span>🎯</span> الإجراء الموصى به
          </p>
          <p className="text-sm font-bold" style={{ color: "#94a3b8" }}>{ad.recommended_action}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 lg:p-6"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden overflow-y-auto"
        style={{ maxHeight: "92vh", background: "var(--card)", animation: "modalIn 0.2s cubic-bezier(0.34,1.56,0.64,1)" }}>
        <style>{`@keyframes modalIn{from{opacity:0;transform:scale(0.95) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>

        {/* TOP: two columns */}
        <div className="flex flex-col md:flex-row">
          {/* RIGHT (40%) — media */}
          <div className="md:w-[40%] shrink-0 p-4 border-b md:border-b-0 md:border-l border-[--border]">
            <MediaSwiper colors={ad.images ?? []} brandColor={ad.brandColor} />
          </div>

          {/* LEFT (60%) — content */}
          <div className="flex-1 min-w-0 p-5 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-sm font-extrabold truncate" style={{ color: "#94a3b8" }}>{ad.brand}</span>
                  <PlatformBadge platform={ad.platform} />
                  {funnel && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{ background: funnel.bg, color: funnel.color }}>{funnel.label}</span>
                  )}
                </div>
                <h2 className="text-lg font-extrabold leading-snug" style={{ color: "var(--text-primary)" }}>{ad.title}</h2>
              </div>
              <button onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 hover:bg-[--surface2] transition-colors"
                style={{ color: "var(--text-secondary)" }}>
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
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-[--border] w-fit hover:border-[#94a3b8]/40 transition-all"
                style={{ color: "var(--text-secondary)" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
                المصدر الأصلي
              </a>
            )}

            <p className="text-xs leading-relaxed line-clamp-3" style={{ color: "var(--text-secondary)" }}>{ad.description}</p>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {dataGrid.map((d) => (
                <div key={d.label} className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>{d.label}</span>
                  <span className="text-xs font-semibold truncate" style={{ color: "var(--text-primary)" }}>{d.value}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-4 pt-2 border-t border-[--border]">
              <div>
                <p className="text-base font-extrabold" style={{ color: "#94a3b8" }}>{ad.views}</p>
                <p className="text-[10px]" style={{ color: "var(--text-secondary)" }}>مشاهدة</p>
              </div>
              <div>
                <p className="text-base font-extrabold" style={{ color: "#94a3b8" }}>{ad.saved}</p>
                <p className="text-[10px]" style={{ color: "var(--text-secondary)" }}>محفوظ</p>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM: analysis */}
        <div className="border-t border-[--border]">
          {/* Basic analysis — always visible */}
          {ad.basic_analysis && ad.basic_analysis.length > 0 && (
            <div className="px-5 py-4" style={{ background: "var(--surface2)" }}>
              <p className="text-sm font-extrabold mb-3 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                <span>⚡</span> التحليل الأساسي
              </p>
              <ul className="space-y-2">
                {(ad.basic_analysis ?? []).map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                    <span className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold"
                      style={{ background: "var(--primary-light)", color: "var(--primary-text)" }}>{i + 1}</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Pro analysis — blurred for free users */}
          {(ad.apply_idea?.length || ad.recommended_action) && (
            isPro ? proContent : <ProBlurOverlay onUpgrade={() => setShowPaywall(true)}>{proContent}</ProBlurOverlay>
          )}
        </div>
      </div>
      {showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} />}
    </div>
  );
}
