"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import AppLayout from "../components/AppLayout";
import FilterBar from "../components/FilterBar";
import { createClient } from "../lib/supabase/client";
import { type Strategy } from "../lib/mockData";
import { fetchStrategies } from "../lib/db";

const filterConfigs = [
  { key: "sector", label: "القطاع", options: ["مطاعم", "أزياء رياضية", "خدمات مالية", "تجارة إلكترونية", "اتصالات"] },
  { key: "tag", label: "التاغ", options: ["رمضان", "موسمي", "عائلي", "مؤثرون", "UGC", "هوية العلامة", "رقمي", "إلحاح"] },
];

function ProBlurOverlay() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl z-10"
      style={{ background: "linear-gradient(to top, rgba(137,87,246,0.95), rgba(137,87,246,0.5))" }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="mb-1">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
      <p className="text-white text-xs font-bold mb-1">محتوى Pro</p>
      <Link href="/pricing"
        className="px-3 py-1 rounded-lg text-[10px] font-bold text-white border border-white/50 hover:bg-white/20 transition-all">
        ترقية إلى Pro →
      </Link>
    </div>
  );
}

function StrategyModal({ s, onClose, isPro }: { s: Strategy; onClose: () => void; isPro: boolean }) {
  const isLocked = !isPro && s.is_pro_only;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden"
        style={{ background: "var(--card)", animation: "modalIn 0.2s cubic-bezier(0.34,1.56,0.64,1)" }}>
        <style>{`@keyframes modalIn{from{opacity:0;transform:scale(0.95) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
        <div className="w-full h-40 flex items-center justify-center" style={{ background: "#0f0f0f" }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black"
            style={{ background: s.brandColor === "#000000" ? "#1a1a1a" : `${s.brandColor}22`, color: s.brandColor === "#000000" ? "#fff" : s.brandColor }}>
            {s.brandInitial}
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-bold mb-1" style={{ color: "#8957f6" }}>{s.brand}</p>
              <h2 className="text-xl font-extrabold" style={{ color: "var(--text-primary)" }}>{s.title}</h2>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[--surface2]"
              style={{ color: "var(--text-secondary)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>
          <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--text-secondary)" }}>{s.preview}</p>
          <div className="mb-5 relative">
            {isLocked && <ProBlurOverlay />}
            <div style={isLocked ? { filter: "blur(5px)", userSelect: "none", pointerEvents: "none" } : {}}>
              <p className="text-xs font-extrabold mb-3" style={{ color: "var(--text-primary)" }}>الرؤى الرئيسية</p>
              <ul className="space-y-2">
                {(s.insights ?? []).map((insight, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <span className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                      style={{ background: "var(--accent-light)", color: "var(--accent-text)" }}>✓</span>
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-5">
            {(s.tags ?? []).map((tag) => (
              <span key={tag} className="px-2.5 py-1 text-xs rounded-full font-medium"
                style={{ background: "var(--accent-light)", color: "var(--accent-text)" }}>#{tag}</span>
            ))}
          </div>
          <button className="w-full py-3 rounded-xl font-bold text-sm text-white" style={{ background: "#84cc18" }}>
            تطبيق هذه الاستراتيجية
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AnalysisPage() {
  const [isPro, setIsPro] = useState(false);
  const [selected, setSelected] = useState<Strategy | null>(null);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [allStrategies, setAllStrategies] = useState<Strategy[]>([]);

  useEffect(() => {
    fetchStrategies().then(setAllStrategies);
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

  const handleFilterChange = (key: string, value: string | null) => {
    setActiveFilters((prev) => {
      const next = { ...prev };
      if (value === null) delete next[key];
      else next[key] = value;
      return next;
    });
  };

  const filtered = useMemo(() => {
    return allStrategies.filter((s) => {
      if (activeFilters.sector && s.sector !== activeFilters.sector) return false;
      if (activeFilters.tag && !(s.tags ?? []).includes(activeFilters.tag)) return false;
      return true;
    });
  }, [allStrategies, activeFilters]);

  return (
    <AppLayout>
      <FilterBar
        filters={filterConfigs}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        resultCount={filtered.length}
      />
      <div className="px-6 lg:px-10 py-8">
        <div className="mb-7">
          <h1 className="text-2xl font-extrabold" style={{ color: "var(--text-primary)" }}>الاستراتيجيات</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>تحليلات عميقة لأنجح الحملات الإعلانية في MENA</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((s) => {
            const isLocked = !isPro && s.is_pro_only;
            return (
              <div key={s.id} onClick={() => setSelected(s)}
                className="card-base card-hover cursor-pointer group p-0 overflow-hidden relative">
                {/* Cover image area */}
                <div className="relative w-full" style={{ aspectRatio: "16/9", background: "#0f0f0f" }}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black"
                      style={{ background: s.brandColor === "#000000" ? "#1a1a1a" : `${s.brandColor}22`, color: s.brandColor === "#000000" ? "#fff" : s.brandColor }}>
                      {s.brandInitial}
                    </div>
                  </div>
                  {/* Brand overlay */}
                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black text-white"
                      style={{ background: s.brandColor }}>{s.brandInitial}</div>
                    <span className="text-xs font-bold text-white drop-shadow">{s.brand}</span>
                  </div>
                  {/* Date badge */}
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md text-[10px] font-medium" style={{ background: "rgba(0,0,0,0.5)", color: "#fff" }}>
                    {s.date}
                  </div>
                  {/* Pro locked overlay */}
                  {isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(137,87,246,0.6)", backdropFilter: "blur(2px)" }}>
                      <div className="flex items-center gap-1.5">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                        <span className="text-xs font-bold text-white px-2 py-0.5 rounded-full" style={{ background: "#8957f6" }}>Pro</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-extrabold text-sm leading-snug mb-2 line-clamp-2 group-hover:text-[#84cc18] transition-colors"
                    style={{ color: "var(--text-primary)" }}>{s.title}</h3>
                  <div className="space-y-1 mb-3">
                    {(s.insights ?? []).slice(0, 2).map((insight, i) => (
                      <p key={i} className="text-[11px] truncate flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
                        <span className="w-1 h-1 rounded-full shrink-0" style={{ background: "#84cc18" }} />
                        {insight}
                      </p>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(s.tags ?? []).slice(0, 3).map((tag) => (
                      <span key={tag} className="px-2 py-0.5 text-[10px] rounded-full font-medium"
                        style={{ background: "var(--accent-light)", color: "var(--accent-text)" }}>{tag}</span>
                    ))}
                    <span className="px-2 py-0.5 text-[10px] rounded-full font-medium" style={{ background: "var(--surface2)", color: "var(--text-secondary)" }}>{s.sector}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selected && <StrategyModal s={selected} onClose={() => setSelected(null)} isPro={isPro} />}
    </AppLayout>
  );
}
