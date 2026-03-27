"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import AppLayout from "./components/AppLayout";
import AdCard from "./components/AdCard";
import AdModal from "./components/AdModal";
import { type Ad, type Strategy } from "./lib/mockData";
import { fetchAds, fetchStrategies } from "./lib/db";

/* ─── Animated counter hook ─── */
function useCountUp(target: number, duration = 1500) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const steps = 40;
    const inc = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += inc;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, target, duration]);

  return { count, ref };
}

/* ─── Stats icons ─── */
const statIcons = [
  <svg key="ads" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
  <svg key="countries" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  <svg key="sectors" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  <svg key="strats" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
];

function buildStatsData(ads: Ad[], strategies: Strategy[]) {
  const uniqueCountries = new Set(ads.map((a) => a.country).filter(Boolean));
  const uniqueSectors = new Set(ads.map((a) => a.sector).filter(Boolean));
  return [
    { target: ads.length, prefix: "+", suffix: "", label: "إعلان", sub: "من كبرى العلامات التجارية", icon: statIcons[0] },
    { target: uniqueCountries.size || 0, prefix: "", suffix: "", label: "دولة", sub: "تغطية شاملة لمنطقة MENA", icon: statIcons[1] },
    { target: uniqueSectors.size || 0, prefix: "", suffix: "", label: "قطاع تجاري", sub: "من التقنية إلى العقارات", icon: statIcons[2] },
    { target: strategies.length, prefix: "", suffix: "", label: "استراتيجية", sub: "تحليلات عميقة للحملات", icon: statIcons[3] },
  ];
}

type StatItem = { target: number; prefix: string; suffix: string; label: string; sub: string; icon: React.ReactNode };

function StatCard({ stat }: { stat: StatItem }) {
  const { count, ref } = useCountUp(stat.target);
  const display = `${stat.prefix}${count.toLocaleString()}${stat.suffix}`;
  return (
    <div ref={ref} className="rounded-xl p-3 flex flex-col items-center justify-center text-center w-40 h-28" style={{
      background: "rgba(206,211,222,0.2)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      border: "1px solid rgba(206,211,222,0.4)",
    }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-1.5" style={{ background: "rgba(37,99,235,0.15)" }}>
        {stat.icon}
      </div>
      <p className="text-lg font-extrabold leading-tight text-blue-400">{display}</p>
      <p className="text-[10px] font-semibold text-white mt-0.5">{stat.label}</p>
    </div>
  );
}

export default function HomePage() {
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [ads, setAds] = useState<Ad[]>([]);
  const [strategies, setStrategies] = useState<Strategy[]>([]);

  useEffect(() => {
    fetchAds().then(setAds);
    fetchStrategies().then(setStrategies);
  }, []);

  return (
    <AppLayout>
      {/* ── HERO ── */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-[#1C4ED8] via-[#0d1b4b] to-black -mt-20 pt-20 overflow-hidden" style={{ animation: "fadeInUp 0.5s ease both" }}>
        <div className="flex flex-col lg:flex-row gap-12 items-center w-full px-6 lg:px-10">
          {/* LEFT column (40%) — laptop placeholder, bleeds off left edge */}
          <div className="w-full lg:w-[40%] order-2 lg:order-2 lg:-ml-[5%]">
            <div className="rounded-2xl bg-white/5 border border-white/10 w-full h-80 flex items-center justify-center lg:-translate-x-8">
              <span className="text-4xl">📸 صورة اللابتوب</span>
            </div>
          </div>

          {/* RIGHT column (60%) — glassmorphism card */}
          <div className="w-full lg:w-[60%] order-1 lg:order-1">
            <div className="backdrop-blur-lg bg-[#ced3de]/20 border border-[#ced3de]/40 rounded-3xl p-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 bg-white/10 border border-white/20 text-white">
                أول منصة ذكاء تسويقي متكامل في السعودية 🇸🇦
              </div>

              <h1 className="text-3xl lg:text-5xl font-extrabold leading-tight mb-5 text-white">
                إستلهم،
                <br />
                من أفضل الإعلانات التجارية الناجحة
              </h1>

              <p className="text-base leading-relaxed mb-8 max-w-lg text-slate-200">
                تعرّف معنا كيف تنجح أقوى الإعلانات، وطبّق استراتيجياتها على حملاتك التسويقية.
              </p>

              <Link href="/library"
                className="inline-block bg-white text-blue-900 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-all">
                مكتبة الإعلانات
              </Link>
            </div>
          </div>
        </div>
        {/* Gradient fade at bottom of hero */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#0a0a2e] pointer-events-none" />
      </section>

      {/* ── STATS (glassmorphism, smaller) ── */}
      <section className="px-6 lg:px-10 pb-10 bg-[#0a0a2e]">
        <div className="flex justify-center gap-6 flex-wrap">
          {buildStatsData(ads, strategies).map((s, i) => <StatCard key={i} stat={s} />)}
        </div>
      </section>

      {/* ── LATEST ADS ── */}
      <section className="px-6 lg:px-10 pb-10 bg-[#0a0a2e]">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="text-xl font-extrabold" style={{ color: "var(--text-primary)" }}>أحدث الإعلانات</h2>
            <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>آخر الإعلانات المضافة من كبرى العلامات في MENA</p>
          </div>
          <Link href="/library" className="text-sm font-semibold transition-colors text-blue-400">
            عرض الكل ←
          </Link>
        </div>
        {ads.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {ads.map((ad) => <AdCard key={ad.id} ad={ad} onClick={setSelectedAd} />)}
          </div>
        ) : (
          <div className="text-center py-12 rounded-2xl" style={{ background: "rgba(206,211,222,0.3)", border: "1px solid rgba(206,211,222,0.5)" }}>
            <p className="text-3xl mb-2">📢</p>
            <p className="font-bold text-white">لا يوجد إعلانات بعد</p>
            <p className="text-sm mt-1 text-slate-400">أضف إعلانات من لوحة التحكم لتظهر هنا</p>
          </div>
        )}
      </section>

      {/* ── LATEST STRATEGIES ── */}
      <section className="px-6 lg:px-10 pb-12 bg-[#0a0a2e]">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="text-xl font-extrabold" style={{ color: "var(--text-primary)" }}>أحدث الاستراتيجيات</h2>
            <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>تحليلات عميقة لحملات ناجحة في المنطقة</p>
          </div>
          <Link href="/analysis" className="text-sm font-semibold transition-colors text-blue-400">
            عرض الكل ←
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {strategies.map((s) => (
            <Link key={s.id} href="/analysis"
              className="rounded-xl overflow-hidden group p-0 bg-[#ced3de] border border-[#ced3de] transition-all duration-200 hover:shadow-md hover:scale-[1.02]">
              <div className="w-full h-48 flex items-center justify-center" style={{ background: "#0f0f0f" }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black"
                  style={{ background: s.brandColor === "#000000" ? "#1a1a1a" : `${s.brandColor}22`, color: s.brandColor === "#000000" ? "#fff" : s.brandColor, border: `2px solid ${s.brandColor === "#000000" ? "#333" : s.brandColor + "44"}` }}>
                  {s.brandInitial}
                </div>
              </div>
              <div className="p-5">
                <p className="text-xs font-bold mb-1 text-slate-300">{s.brand}</p>
                <h3 className="text-sm font-extrabold leading-snug mb-2 group-hover:text-blue-400 transition-colors" style={{ color: "var(--text-primary)" }}>
                  {s.title}
                </h3>
                <p className="text-xs leading-relaxed mb-3 line-clamp-2" style={{ color: "var(--text-secondary)" }}>{s.preview}</p>
                <div className="flex flex-wrap gap-1">
                  {(s.tags ?? []).slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-0.5 text-xs rounded-full font-medium"
                      style={{ background: "var(--accent-light)", color: "var(--accent-text)" }}>{tag}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <AdModal ad={selectedAd} onClose={() => setSelectedAd(null)} />
    </AppLayout>
  );
}
