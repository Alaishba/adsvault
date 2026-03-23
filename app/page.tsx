"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import AppLayout from "./components/AppLayout";
import AdCard from "./components/AdCard";
import AdModal from "./components/AdModal";
import PlatformBadge from "./components/PlatformBadge";
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

/* ─── Hero stacked card preview (glassmorphism) ─── */
function HeroAdPreview({ ad, style }: { ad: Ad; style?: React.CSSProperties }) {
  return (
    <div className="glass-purple rounded-2xl p-4 shadow-lg" style={style}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black text-white shrink-0"
          style={{ background: ad.brandColor }}>{ad.brandInitial}</div>
        <div>
          <p className="text-xs font-bold text-white">{ad.brand}</p>
          <p className="text-xs text-white/60 truncate max-w-[160px]">{ad.title}</p>
        </div>
      </div>
      <div className="flex gap-1.5 flex-wrap">
        <PlatformBadge platform={ad.platform} />
        <span className="px-2 py-0.5 text-xs rounded-md font-medium bg-white/10 text-white/70">{ad.sector}</span>
      </div>
    </div>
  );
}

/* ─── Stats ─── */
const statsData = [
  { target: 12000, prefix: "+", suffix: "", label: "إعلان محلي", sub: "من كبرى العلامات التجارية",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#84cc18" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg> },
  { target: 22, prefix: "", suffix: "", label: "دولة عربية", sub: "تغطية شاملة لمنطقة MENA",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#84cc18" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> },
  { target: 85, prefix: "+", suffix: "", label: "قطاع تجاري", sub: "من التقنية إلى العقارات",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#84cc18" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
  { target: 49, prefix: "", suffix: "", label: "تقييم المستخدمين", sub: "رضا عملائنا أولويتنا",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#84cc18" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
];

function StatCard({ stat }: { stat: typeof statsData[0] }) {
  const { count, ref } = useCountUp(stat.target);
  const display = stat.target === 49
    ? `${(count / 10).toFixed(1)}`
    : `${stat.prefix}${count.toLocaleString()}${stat.suffix}`;
  return (
    <div ref={ref} className="rounded-xl p-2.5 flex items-center gap-2.5" style={{
      background: "rgba(255,255,255,0.6)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      border: "1px solid rgba(209,209,214,0.4)",
    }}>
      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: "var(--primary-light)" }}>
        {stat.icon}
      </div>
      <div className="min-w-0">
        <p className="text-base font-extrabold leading-tight" style={{ color: "var(--primary)" }}>{display}</p>
        <p className="text-[10px] font-semibold truncate" style={{ color: "var(--text-primary)" }}>{stat.label}</p>
      </div>
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
      <section className="px-6 lg:px-10 pt-10 pb-8" style={{ animation: "fadeInUp 0.5s ease both" }}>
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1 min-w-0 lg:max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-5"
              style={{ background: "var(--primary-light)", color: "var(--primary-text)", border: "1px solid var(--primary)" }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--primary)" }} />
              منصة الذكاء الإعلاني الأولى في MENA ✦
            </div>

            <h1 className="text-3xl lg:text-5xl font-extrabold leading-tight mb-4" style={{ color: "var(--text-primary)" }}>
              فكّك الإعلانات الناجحة.{" "}
              <span style={{ color: "#84cc18" }}>طبّقها باحتراف.</span>
            </h1>

            <p className="text-base leading-relaxed mb-8 max-w-md" style={{ color: "var(--text-secondary)" }}>
              استكشف آلاف الإعلانات من كبرى العلامات في المنطقة، افهم ما يجعلها
              تنجح، وطبّق الاستراتيجيات على حملاتك التسويقية.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/library"
                className="px-7 py-3 rounded-xl font-bold text-base text-white transition-all hover:opacity-90 hover:scale-[1.02]"
                style={{ background: "#84cc18", boxShadow: "0 4px 20px rgba(132,204,24,0.3)" }}>
                ابدأ مجاناً
              </Link>
              <Link href="/library"
                className="px-7 py-3 rounded-xl font-bold text-base border transition-all hover:border-[#84cc18]/40"
                style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}>
                استعرض المكتبة
              </Link>
            </div>

            <p className="mt-6 text-xs" style={{ color: "var(--text-secondary)" }}>
              يستخدمه أكثر من{" "}
              <span style={{ color: "#84cc18" }} className="font-bold">500+ فريق تسويقي</span>{" "}
              في المنطقة
            </p>
          </div>

          {/* Stacked preview cards (glassmorphism) */}
          <div className="flex-1 w-full lg:max-w-sm relative pt-4 pl-4">
            {ads.length >= 3 ? (
              <>
                <div className="relative z-10 mx-8 animate-float-2">
                  <HeroAdPreview ad={ads[2]} style={{ opacity: 0.6, transform: "scale(0.92)", transformOrigin: "top center" }} />
                </div>
                <div className="relative z-20 mx-4 -mt-10 animate-float-1">
                  <HeroAdPreview ad={ads[1]} style={{ opacity: 0.82, transform: "scale(0.96)", transformOrigin: "top center" }} />
                </div>
                <div className="relative z-30 -mt-10 animate-float-0">
                  <HeroAdPreview ad={ads[0]} />
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-64 rounded-2xl" style={{ background: "rgba(137,87,246,0.08)" }}>
                <p className="text-sm font-semibold" style={{ color: "#8957f6" }}>أضف إعلانات من لوحة التحكم</p>
              </div>
            )}
            <div className="absolute top-0 left-0 px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg z-40"
              style={{ background: "#84cc18", color: "#fff", animation: "pulse-badge 2s ease infinite" }}>
              +12,000 إعلان
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS (glassmorphism, smaller) ── */}
      <section className="px-6 lg:px-10 pb-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {statsData.map((s, i) => <StatCard key={i} stat={s} />)}
        </div>
      </section>

      {/* ── LATEST ADS ── */}
      <section className="px-6 lg:px-10 pb-10">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="text-xl font-extrabold" style={{ color: "var(--text-primary)" }}>أحدث الإعلانات</h2>
            <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>آخر الإعلانات المضافة من كبرى العلامات في MENA</p>
          </div>
          <Link href="/library" className="text-sm font-semibold transition-colors" style={{ color: "#84cc18" }}>
            عرض الكل ←
          </Link>
        </div>
        {ads.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {ads.map((ad) => <AdCard key={ad.id} ad={ad} onClick={setSelectedAd} />)}
          </div>
        ) : (
          <div className="text-center py-12 rounded-2xl" style={{ background: "#ffffff", border: "1px solid #e5e7eb" }}>
            <p className="text-3xl mb-2">📢</p>
            <p className="font-bold" style={{ color: "#1c1c1e" }}>لا يوجد إعلانات بعد</p>
            <p className="text-sm mt-1" style={{ color: "#6b7280" }}>أضف إعلانات من لوحة التحكم لتظهر هنا</p>
          </div>
        )}
      </section>

      {/* ── LATEST STRATEGIES ── */}
      <section className="px-6 lg:px-10 pb-12">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="text-xl font-extrabold" style={{ color: "var(--text-primary)" }}>أحدث الاستراتيجيات</h2>
            <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>تحليلات عميقة لحملات ناجحة في المنطقة</p>
          </div>
          <Link href="/analysis" className="text-sm font-semibold transition-colors" style={{ color: "#84cc18" }}>
            عرض الكل ←
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {strategies.map((s) => (
            <Link key={s.id} href="/analysis"
              className="card-base card-hover overflow-hidden group p-0">
              <div className="w-full h-36 flex items-center justify-center" style={{ background: "#0f0f0f" }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black"
                  style={{ background: s.brandColor === "#000000" ? "#1a1a1a" : `${s.brandColor}22`, color: s.brandColor === "#000000" ? "#fff" : s.brandColor, border: `2px solid ${s.brandColor === "#000000" ? "#333" : s.brandColor + "44"}` }}>
                  {s.brandInitial}
                </div>
              </div>
              <div className="p-5">
                <p className="text-xs font-bold mb-1" style={{ color: "#8957f6" }}>{s.brand}</p>
                <h3 className="text-sm font-extrabold leading-snug mb-2 group-hover:text-[#84cc18] transition-colors" style={{ color: "var(--text-primary)" }}>
                  {s.title}
                </h3>
                <p className="text-xs leading-relaxed mb-3 line-clamp-2" style={{ color: "var(--text-secondary)" }}>{s.preview}</p>
                <div className="flex flex-wrap gap-1">
                  {s.tags.slice(0, 3).map((tag) => (
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
