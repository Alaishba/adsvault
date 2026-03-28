"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import AppLayout from "./components/AppLayout";
import AdCard from "./components/AdCard";
import AdModal from "./components/AdModal";
import { type Ad, type Strategy, type Influencer } from "./lib/mockData";
import { type BlogArticle } from "./lib/blogData";
import { fetchAds, fetchStrategies, fetchInfluencers } from "./lib/db";
import { supabase, isSupabaseConfigured } from "./lib/supabase";
import { getImageUrl } from "./lib/imageUrl";
import PlatformBadge from "./components/PlatformBadge";
import type { Platform } from "./lib/mockData";

function getCountryFlag(country: string): string {
  const flags: Record<string, string> = {
    "السعودية": "🇸🇦", "الإمارات": "🇦🇪", "الكويت": "🇰🇼",
    "مصر": "🇪🇬", "قطر": "🇶🇦", "البحرين": "🇧🇭", "عمان": "🇴🇲",
  };
  return flags[country] ?? "🌍";
}

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
    { target: uniqueCountries.size || 0, prefix: "", suffix: "", label: "دولة", sub: "تغطية شاملة للمنطقة العربية", icon: statIcons[1] },
    { target: uniqueSectors.size || 0, prefix: "", suffix: "", label: "قطاع تجاري", sub: "من التقنية إلى العقارات", icon: statIcons[2] },
    { target: strategies.length, prefix: "", suffix: "", label: "استراتيجية", sub: "تحليلات عميقة للحملات", icon: statIcons[3] },
  ];
}

type StatItem = { target: number; prefix: string; suffix: string; label: string; sub: string; icon: React.ReactNode };

function StatCard({ stat }: { stat: StatItem }) {
  const { count, ref } = useCountUp(stat.target);
  const display = `${stat.prefix}${count.toLocaleString()}${stat.suffix}`;
  return (
    <div ref={ref} className="rounded-xl p-3 flex flex-col items-center justify-center text-center w-48 h-28" style={{
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
  const [influencers, setInfluencers] = useState<(Influencer & { profile_image?: string })[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogArticle[]>([]);
  const [promoBanners, setPromoBanners] = useState<Record<string, string>>({});

  useEffect(() => {
    // Fetch featured ads (2), fallback to latest
    fetchAds().then((all) => {
      const featured = all.filter((a) => (a as unknown as Record<string, unknown>).featured);
      const result = featured.length >= 2 ? featured.slice(0, 2) : [...featured, ...all.filter((a) => !(a as unknown as Record<string, unknown>).featured)].slice(0, 2);
      setAds(result);
    });
    // Fetch featured strategies (2), fallback to latest
    fetchStrategies().then((all) => {
      const featured = all.filter((s) => (s as unknown as Record<string, unknown>).featured);
      const result = featured.length >= 2 ? featured.slice(0, 2) : [...featured, ...all.filter((s) => !(s as unknown as Record<string, unknown>).featured)].slice(0, 2);
      setStrategies(result);
    });
    // Fetch featured influencers (3), fallback to latest
    fetchInfluencers().then((all) => {
      const featured = all.filter((i) => (i as unknown as Record<string, unknown>).featured);
      const result = featured.length >= 3 ? featured.slice(0, 3) : [...featured, ...all.filter((i) => !(i as unknown as Record<string, unknown>).featured)].slice(0, 3);
      setInfluencers(result);
    });
    // Fetch promo banners + blog posts
    if (isSupabaseConfigured()) {
      supabase.from("promo_banners").select("section,image_url")
        .then(({ data }: { data: { section: string; image_url: string }[] | null }) => {
          if (data) {
            const map: Record<string, string> = {};
            data.forEach((r) => { map[r.section] = r.image_url; });
            setPromoBanners(map);
          }
        });
      supabase.from("blog_posts").select("*").eq("status", "published").order("created_at", { ascending: false }).limit(10)
        .then(({ data }: { data: Record<string, unknown>[] | null }) => {
          if (data && data.length > 0) {
            const all = data.map((d: Record<string, unknown>) => ({
              id: d.id as number, slug: (d.slug as string) ?? "",
              title: (d.title as string) ?? "", excerpt: ((d.content as string) ?? "").slice(0, 120),
              category: (d.category as string) ?? "تسويق",
              coverImage: (d.banner_image as string) ?? "#2563eb",
              author: (d.author as string) ?? "فريق Molhm",
              date: ((d.created_at as string) ?? "").slice(0, 10),
              readTime: "5 دقائق", tags: (d.tags as string[]) ?? [],
              featured: d.featured as boolean,
            }));
            const feat = all.filter((a) => a.featured);
            const result = feat.length >= 2 ? feat.slice(0, 2) : [...feat, ...all.filter((a) => !a.featured)].slice(0, 2);
            setBlogPosts(result);
          }
        });
    }
  }, []);

  return (
    <AppLayout>
      {/* ── HERO ── */}
      <section className="relative min-h-[80vh] flex items-center bg-gradient-to-br from-[#1C4ED8] via-[#0d1b4b] to-black -mt-20 pt-8 overflow-hidden" style={{ animation: "fadeInUp 0.5s ease both" }}>
        <div className="flex flex-col lg:flex-row gap-12 items-center w-full px-6 lg:px-10">
          {/* LEFT column (40%) — laptop placeholder, bleeds off left edge */}
          <div className="w-full lg:w-[40%] order-2 lg:order-2 lg:-ml-[5%]">
            <div className="rounded-2xl bg-white/5 border border-white/10 w-full h-80 flex items-center justify-center lg:-translate-x-8 overflow-hidden">
              {promoBanners["hero_laptop"] ? (
                <img src={promoBanners["hero_laptop"]} alt="Molhm" className="w-full h-full object-cover" />
              ) : null}
            </div>
          </div>

          {/* RIGHT column (60%) — glassmorphism card */}
          <div className="w-full lg:w-[60%] order-1 lg:order-1">
            <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-10">
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
      <section className="px-6 lg:px-10 pt-2 pb-10 bg-[#0a0a2e]">
        <div className="flex justify-center gap-6 flex-wrap">
          {buildStatsData(ads, strategies).map((s, i) => <StatCard key={i} stat={s} />)}
        </div>
      </section>

      {/* ── ABOUT MOLHM ── */}
      <section className="px-6 lg:px-10 pb-10 bg-[#0a0a2e]">
        <div className="max-w-2xl mx-auto text-center mb-10 bg-[#ced3de]/30 border border-[#ced3de]/50 rounded-2xl p-8">
          <p className="text-xl font-black text-white mb-3">منصة ملهم — ذكاء تسويقي متكامل</p>
          <p className="text-sm text-slate-300 leading-relaxed mb-2">نساعدك على استكشاف أفضل الإعلانات التجارية الناجحة في المنطقة العربية، وتحليل استراتيجياتها، وتطبيقها على حملاتك التسويقية.</p>
          <p className="text-sm font-bold text-blue-400">إستلهم. حلّل. طبّق.</p>
        </div>
      </section>

      {/* ── LATEST ADS ── */}
      <section className="px-6 lg:px-10 pb-10 bg-[#0a0a2e]">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="text-xl font-extrabold" style={{ color: "var(--text-primary)" }}>أحدث الإعلانات</h2>
            <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>آخر الإعلانات المضافة من كبرى العلامات التجارية</p>
          </div>
          <Link href="/library" className="text-sm font-semibold transition-colors text-blue-400">
            عرض الكل ←
          </Link>
        </div>
        {ads.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ads.slice(0, 2).map((ad) => (
              <div key={ad.id} className="rounded-2xl" style={{ height: 360, overflow: "hidden" }}>
                <AdCard ad={ad} onClick={setSelectedAd} />
              </div>
            ))}
            {/* Promo banner */}
            <div className="rounded-2xl overflow-hidden" style={{ height: 360 }}>
              {promoBanners["ads"] ? (
                <img src={promoBanners["ads"]} alt="" className="w-full h-full object-cover" />
              ) : <div className="w-full h-full bg-[#ced3de]/20" />}
            </div>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {strategies.slice(0, 2).map((s) => (
            <Link key={s.id} href="/analysis"
              className="rounded-xl overflow-hidden group p-0 bg-[#ced3de] border border-[#ced3de] transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
              style={{ height: 280 }}>
              <div className="w-full h-40 flex items-center justify-center relative overflow-hidden" style={{ background: "#0f0f0f" }}>
                {s.thumbnail && !s.thumbnail.startsWith("#") ? (
                  <img src={getImageUrl("strategy-covers", s.thumbnail)} alt={s.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = "none"; }} />
                ) : null}
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black relative"
                  style={{ background: s.brandColor === "#000000" ? "#1a1a1a" : `${s.brandColor}22`, color: s.brandColor === "#000000" ? "#fff" : s.brandColor, border: `2px solid ${s.brandColor === "#000000" ? "#333" : s.brandColor + "44"}` }}>
                  {s.brandInitial}
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs font-bold mb-1 text-slate-700">{s.brand}</p>
                <h3 className="text-sm font-extrabold leading-snug mb-1 group-hover:text-blue-400 transition-colors text-slate-900 line-clamp-1">
                  {s.title}
                </h3>
                <p className="text-xs leading-relaxed mb-2 line-clamp-1 text-slate-700">{s.preview}</p>
                <div className="flex flex-wrap gap-1">
                  {(s.tags ?? []).slice(0, 2).map((tag) => (
                    <span key={tag} className="px-2 py-0.5 text-xs rounded-full font-medium bg-blue-100 text-blue-700">{tag}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
          {/* Promo banner */}
          <div className="rounded-2xl bg-[#ced3de]/20 overflow-hidden" style={{ height: 280 }}>
            {promoBanners["strategies"] ? (
              <img src={promoBanners["strategies"]} alt="" className="w-full h-full object-cover" />
            ) : <div className="w-full h-full bg-[#ced3de]/20" />}
          </div>
        </div>
      </section>

      {/* ── TOP INFLUENCERS ── */}
      {influencers.length > 0 && (
        <section className="px-6 lg:px-10 pb-12 bg-[#0a0a2e]">
          <div className="flex items-end justify-between mb-5">
            <div>
              <h2 className="text-xl font-extrabold text-white">أبرز المؤثرين</h2>
              <p className="text-sm mt-0.5 text-slate-400">أبرز المؤثرين في المنطقة العربية</p>
            </div>
            <Link href="/influencers" className="text-sm font-semibold transition-colors text-blue-400">
              عرض الكل ←
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {influencers.slice(0, 3).map((inf) => (
              <Link key={inf.id} href="/influencers"
                className="rounded-xl p-3 bg-[#ced3de] border border-[#ced3de] transition-all duration-200 hover:shadow-md hover:scale-[1.02] overflow-hidden"
                style={{ height: 160 }}>
                <div className="flex items-center gap-3 mb-2">
                  {inf.profile_image ? (
                    <img src={getImageUrl("influencer-photos", inf.profile_image)} alt={inf.name}
                      className="w-14 h-14 rounded-full object-cover shrink-0"
                      onError={(e) => { e.currentTarget.style.display = "none"; }} />
                  ) : (
                    <div className="w-14 h-14 rounded-full flex items-center justify-center text-sm font-black text-white shrink-0"
                      style={{ background: inf.color }}>{inf.initial}</div>
                  )}
                  <div>
                    <p className="font-bold text-sm text-slate-900">{inf.name}</p>
                    <p className="text-xs text-slate-600">{inf.category} · {inf.country}</p>
                  </div>
                </div>
                <div className="flex gap-3 text-xs">
                  <span className="text-slate-900 font-bold">{inf.followers} <span className="text-slate-500 font-normal">متابع</span></span>
                  <span className="text-slate-900 font-bold">{inf.engagement} <span className="text-slate-500 font-normal">تفاعل</span></span>
                </div>
                {inf.country && (
                  <p className="text-[10px] text-slate-500 mt-1">{getCountryFlag(inf.country)} {inf.country}</p>
                )}
                {(inf as any).niche && (
                  <p className="text-[10px] text-slate-400 mt-0.5">{(inf as any).niche}</p>
                )}
                {((inf as any).interests as string[] ?? []).length > 0 && (
                  <div className="flex flex-wrap gap-0.5 mt-1">
                    {((inf as any).interests as string[] ?? []).slice(0, 3).map((i: string) => (
                      <span key={i} className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-100/60 text-blue-800">#{i}</span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
            {/* Promo banner */}
            <div className="rounded-2xl bg-[#ced3de]/20 overflow-hidden" style={{ height: 160 }}>
              {promoBanners["influencers"] ? (
                <img src={promoBanners["influencers"]} alt="" className="w-full h-full object-cover" />
              ) : <div className="w-full h-full bg-[#ced3de]/20" />}
            </div>
          </div>
        </section>
      )}

      {/* ── LATEST BLOG POSTS ── */}
      {blogPosts.length > 0 && (
        <section className="px-6 lg:px-10 pb-12 bg-[#0a0a2e]">
          <div className="flex items-end justify-between mb-5">
            <div>
              <h2 className="text-xl font-extrabold text-white">آخر المقالات</h2>
              <p className="text-sm mt-0.5 text-slate-400">أحدث المقالات والنصائح التسويقية</p>
            </div>
            <Link href="/blog" className="text-sm font-semibold transition-colors text-blue-400">
              عرض الكل ←
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {blogPosts.slice(0, 2).map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}
                className="rounded-xl overflow-hidden bg-[#ced3de] border border-[#ced3de] transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
                style={{ height: 280 }}>
                <div className="h-40 flex items-center justify-center relative overflow-hidden"
                  style={{ background: post.coverImage.startsWith("#") ? post.coverImage : "#2563eb" }}>
                  {!post.coverImage.startsWith("#") && (
                    <img src={getImageUrl("Blog-images", post.coverImage)} alt={post.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.style.display = "none"; }} />
                  )}
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white">
                    {post.category}
                  </span>
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-sm leading-snug mb-1 line-clamp-1 text-slate-900">{post.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-1 mb-1">{post.excerpt}</p>
                  <span className="text-xs text-slate-500">{post.date}</span>
                </div>
              </Link>
            ))}
            {/* Promo banner */}
            <div className="rounded-2xl bg-[#ced3de]/20 overflow-hidden" style={{ height: 280 }}>
              {promoBanners["blog"] ? (
                <img src={promoBanners["blog"]} alt="" className="w-full h-full object-cover" />
              ) : <div className="w-full h-full bg-[#ced3de]/20" />}
            </div>
          </div>
        </section>
      )}

      <AdModal ad={selectedAd} onClose={() => setSelectedAd(null)} />
    </AppLayout>
  );
}
