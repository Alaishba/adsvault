"use client";

import { useState, useEffect } from "react";

// ── Mock Data ──────────────────────────────────────────────────────────────────

const visitorKPIs = [
  { label: "زوار اليوم", value: "847", trend: "+12.3%", up: true },
  { label: "زوار الأسبوع", value: "5,231", trend: "+8.7%", up: true },
  { label: "زوار الشهر", value: "18,492", trend: "+15.1%", up: true },
  { label: "زوار فريدون", value: "12,384", trend: "+6.4%", up: true },
  { label: "متوسط مدة الجلسة", value: "4:32", trend: "-2.1%", up: false },
  { label: "معدل الارتداد", value: "34.2%", trend: "-5.6%", up: true },
];

const topAds = [
  { title: "إعلان رمضان كريم", brand: "المراعي", views: 4821, saves: 312 },
  { title: "عرض الجمعة البيضاء", brand: "نون", views: 3945, saves: 287 },
  { title: "حملة العودة للمدارس", brand: "جرير", views: 3412, saves: 245 },
  { title: "إطلاق منتج جديد", brand: "STC", views: 3108, saves: 198 },
  { title: "إعلان اليوم الوطني", brand: "الراجحي", views: 2876, saves: 176 },
  { title: "حملة الصيف", brand: "تمارا", views: 2654, saves: 163 },
  { title: "عرض نهاية السنة", brand: "إكسترا", views: 2398, saves: 142 },
  { title: "إعلان العيد", brand: "هنقرستيشن", views: 2187, saves: 131 },
  { title: "حملة التوفير", brand: "بنده", views: 1943, saves: 118 },
  { title: "إعلان التطبيق", brand: "كريم", views: 1756, saves: 97 },
];

const topStrategies = [
  { title: "استراتيجية التسويق في رمضان", views: 2341, saves: 189 },
  { title: "دليل إعلانات تيك توك", views: 1876, saves: 156 },
  { title: "حملات إعادة الاستهداف", views: 1654, saves: 132 },
  { title: "التسويق عبر المؤثرين", views: 1432, saves: 121 },
  { title: "استراتيجية المحتوى المرئي", views: 1287, saves: 98 },
];

const topInfluencers = [
  { name: "أبو فلة", platform: "يوتيوب", views: 3241 },
  { name: "نارين بيوتي", platform: "إنستقرام", views: 2876 },
  { name: "بدر خلف", platform: "تيك توك", views: 2543 },
  { name: "مشعل الخالدي", platform: "سناب شات", views: 2198 },
  { name: "هند القحطاني", platform: "تويتر", views: 1876 },
];

const filterUsage = [
  { label: "القطاع", pct: 78 },
  { label: "المنصة", pct: 65 },
  { label: "البلد", pct: 52 },
  { label: "الموسم", pct: 41 },
  { label: "القمع", pct: 28 },
];

const searchTags = [
  { text: "رمضان", size: "text-lg" },
  { text: "تيك توك", size: "text-base" },
  { text: "إعلان فيديو", size: "text-sm" },
  { text: "ميتا", size: "text-base" },
  { text: "سناب شات", size: "text-sm" },
  { text: "تجارة إلكترونية", size: "text-lg" },
  { text: "عروض", size: "text-xs" },
  { text: "مؤثرين", size: "text-base" },
  { text: "استراتيجية", size: "text-sm" },
];

const funnelSteps = [
  { label: "زيارة", value: "10,000", width: "100%" },
  { label: "تسجيل", value: "2,400", width: "24%" },
  { label: "اشتراك Pro", value: "340", width: "3.4%" },
];

const geoData = [
  { country: "السعودية", visitors: "8,234", conversion: "4.2%" },
  { country: "الإمارات", visitors: "3,891", conversion: "3.8%" },
  { country: "مصر", visitors: "2,456", conversion: "2.1%" },
  { country: "الكويت", visitors: "1,732", conversion: "3.5%" },
  { country: "قطر", visitors: "1,245", conversion: "4.0%" },
  { country: "البحرين", visitors: "987", conversion: "3.1%" },
  { country: "الأردن", visitors: "876", conversion: "1.9%" },
  { country: "المغرب", visitors: "743", conversion: "1.4%" },
  { country: "عمان", visitors: "612", conversion: "2.7%" },
  { country: "تونس", visitors: "498", conversion: "1.2%" },
];

const devices = [
  {
    name: "سطح المكتب",
    pct: 62,
    color: "#8957f6",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
  {
    name: "الجوال",
    pct: 31,
    color: "#84cc18",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <path d="M12 18h.01" />
      </svg>
    ),
  },
  {
    name: "التابلت",
    pct: 7,
    color: "#8957f6",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <path d="M12 18h.01" />
      </svg>
    ),
  },
];

// ── Component ──────────────────────────────────────────────────────────────────

export default function AdminAnalyticsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div dir="rtl" className="min-h-screen p-6 space-y-8" style={{ background: "#f3f5f9", color: "#1c1c1e" }}>
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">تحليلات متقدمة</h1>
        <p className="mt-1" style={{ color: "#6b7280" }}>
          نظرة شاملة على أداء المنصة وسلوك المستخدمين
        </p>
      </div>

      {/* Section 1 — Visitor Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {visitorKPIs.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl p-4"
            style={{ background: "#ffffff", border: "1px solid #e5e7eb" }}
          >
            <p className="text-2xl font-bold">{kpi.value}</p>
            <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
              {kpi.label}
            </p>
            <span
              className="text-xs font-medium mt-2 inline-block"
              style={{ color: kpi.up ? "#84cc18" : "#ef4444" }}
            >
              {kpi.trend}
            </span>
          </div>
        ))}
      </div>

      {/* Section 2 — Most Viewed Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Ads */}
        <div className="rounded-xl p-5" style={{ background: "#ffffff", border: "1px solid #e5e7eb" }}>
          <h2 className="text-lg font-bold mb-4">أكثر الإعلانات مشاهدة</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ color: "#6b7280", borderBottom: "1px solid #e5e7eb" }}>
                  <th className="pb-2 text-right font-medium">#</th>
                  <th className="pb-2 text-right font-medium">العنوان</th>
                  <th className="pb-2 text-right font-medium">البراند</th>
                  <th className="pb-2 text-right font-medium">المشاهدات</th>
                  <th className="pb-2 text-right font-medium">المحفوظات</th>
                </tr>
              </thead>
              <tbody>
                {topAds.map((ad, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #e5e7eb" }}>
                    <td className="py-2" style={{ color: "#6b7280" }}>{i + 1}</td>
                    <td className="py-2">{ad.title}</td>
                    <td className="py-2" style={{ color: "#8957f6" }}>{ad.brand}</td>
                    <td className="py-2">{ad.views.toLocaleString()}</td>
                    <td className="py-2" style={{ color: "#84cc18" }}>{ad.saves}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Strategies + Top Influencers */}
        <div className="space-y-6">
          <div className="rounded-xl p-5" style={{ background: "#ffffff", border: "1px solid #e5e7eb" }}>
            <h2 className="text-lg font-bold mb-4">أكثر الاستراتيجيات مشاهدة</h2>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ color: "#6b7280", borderBottom: "1px solid #e5e7eb" }}>
                  <th className="pb-2 text-right font-medium">#</th>
                  <th className="pb-2 text-right font-medium">العنوان</th>
                  <th className="pb-2 text-right font-medium">المشاهدات</th>
                  <th className="pb-2 text-right font-medium">المحفوظات</th>
                </tr>
              </thead>
              <tbody>
                {topStrategies.map((s, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #e5e7eb" }}>
                    <td className="py-2" style={{ color: "#6b7280" }}>{i + 1}</td>
                    <td className="py-2">{s.title}</td>
                    <td className="py-2">{s.views.toLocaleString()}</td>
                    <td className="py-2" style={{ color: "#84cc18" }}>{s.saves}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-xl p-5" style={{ background: "#ffffff", border: "1px solid #e5e7eb" }}>
            <h2 className="text-lg font-bold mb-4">أكثر المؤثرين مشاهدة</h2>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ color: "#6b7280", borderBottom: "1px solid #e5e7eb" }}>
                  <th className="pb-2 text-right font-medium">#</th>
                  <th className="pb-2 text-right font-medium">الاسم</th>
                  <th className="pb-2 text-right font-medium">المنصة</th>
                  <th className="pb-2 text-right font-medium">المشاهدات</th>
                </tr>
              </thead>
              <tbody>
                {topInfluencers.map((inf, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #e5e7eb" }}>
                    <td className="py-2" style={{ color: "#6b7280" }}>{i + 1}</td>
                    <td className="py-2">{inf.name}</td>
                    <td className="py-2" style={{ color: "#8957f6" }}>{inf.platform}</td>
                    <td className="py-2">{inf.views.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Section 3 — User Behavior */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Filter Usage Bar Chart */}
        <div className="rounded-xl p-5" style={{ background: "#ffffff", border: "1px solid #e5e7eb" }}>
          <h2 className="text-lg font-bold mb-4">الفلاتر الأكثر استخداماً</h2>
          <div className="space-y-4">
            {filterUsage.map((f) => (
              <div key={f.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{f.label}</span>
                  <span style={{ color: "#6b7280" }}>{f.pct}%</span>
                </div>
                <div className="h-3 rounded-full overflow-hidden" style={{ background: "#e5e7eb" }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      background: "#84cc18",
                      width: mounted ? `${f.pct}%` : "0%",
                      transition: "width 0.8s ease-out",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search Tags */}
        <div className="rounded-xl p-5" style={{ background: "#ffffff", border: "1px solid #e5e7eb" }}>
          <h2 className="text-lg font-bold mb-4">أكثر الكلمات بحثاً</h2>
          <div className="flex flex-wrap gap-2">
            {searchTags.map((tag) => (
              <span
                key={tag.text}
                className={`rounded-full px-3 py-1 cursor-default transition-colors ${tag.size}`}
                style={{ background: "#f3f5f9", color: "#6b7280" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#1c1c1e")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
              >
                {tag.text}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="rounded-xl p-5" style={{ background: "#ffffff", border: "1px solid #e5e7eb" }}>
        <h2 className="text-lg font-bold mb-6">قمع التحويل</h2>
        <div className="space-y-4">
          {funnelSteps.map((step, i) => {
            const colors = ["#8957f6", "#8957f6", "#84cc18"];
            return (
              <div key={step.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{step.label}</span>
                  <span style={{ color: "#6b7280" }}>{step.value}</span>
                </div>
                <div className="h-8 rounded-lg overflow-hidden" style={{ background: "#e5e7eb" }}>
                  <div
                    className="h-full rounded-lg flex items-center justify-center text-xs font-bold text-white"
                    style={{
                      background: colors[i],
                      width: mounted ? step.width : "0%",
                      transition: "width 1s ease-out",
                      minWidth: mounted ? "40px" : "0px",
                    }}
                  >
                    {step.value}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 4 — Geographic Distribution */}
      <div className="rounded-xl p-5" style={{ background: "#ffffff", border: "1px solid #e5e7eb" }}>
        <h2 className="text-lg font-bold mb-4">التوزيع الجغرافي</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ color: "#6b7280", borderBottom: "1px solid #e5e7eb" }}>
                <th className="pb-2 text-right font-medium">#</th>
                <th className="pb-2 text-right font-medium">البلد</th>
                <th className="pb-2 text-right font-medium">الزوار</th>
                <th className="pb-2 text-right font-medium">نسبة التحويل</th>
              </tr>
            </thead>
            <tbody>
              {geoData.map((row, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td className="py-2" style={{ color: "#6b7280" }}>{i + 1}</td>
                  <td className="py-2">{row.country}</td>
                  <td className="py-2">{row.visitors}</td>
                  <td className="py-2">
                    <span
                      className="inline-block rounded-full px-2 py-0.5 text-xs font-medium"
                      style={{
                        background: parseFloat(row.conversion) >= 3 ? "#f7fee7" : "#f3eeff",
                        color: parseFloat(row.conversion) >= 3 ? "#84cc18" : "#8957f6",
                      }}
                    >
                      {row.conversion}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 5 — Device Breakdown */}
      <div className="rounded-xl p-5" style={{ background: "#ffffff", border: "1px solid #e5e7eb" }}>
        <h2 className="text-lg font-bold mb-6">توزيع الأجهزة</h2>
        <div className="grid grid-cols-3 gap-6">
          {devices.map((d) => (
            <div key={d.name} className="flex flex-col items-center text-center space-y-3">
              <div style={{ color: d.color }}>{d.icon}</div>
              <p className="text-3xl font-bold">{d.pct}%</p>
              <p className="text-sm" style={{ color: "#6b7280" }}>{d.name}</p>
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "#e5e7eb" }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    background: d.color,
                    width: mounted ? `${d.pct}%` : "0%",
                    transition: "width 0.8s ease-out",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
