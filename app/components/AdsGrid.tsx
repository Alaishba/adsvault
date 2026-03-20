"use client";

const platformColors: Record<string, string> = {
  Instagram: "#e1306c22",
  "Instagram text": "#e1306c",
  TikTok: "#010101",
  "TikTok text": "#ffffff",
  YouTube: "#ff000022",
  "YouTube text": "#ff4444",
  Facebook: "#1877f222",
  "Facebook text": "#4a9cf5",
  Snapchat: "#fffc0022",
  "Snapchat text": "#d4b800",
  Twitter: "#1da1f222",
  "Twitter text": "#1da1f2",
  LinkedIn: "#0a66c222",
  "LinkedIn text": "#4a9cf5",
};

const ads = [
  {
    brand: "جرير",
    logo: "J",
    logoColor: "#22c55e",
    title: "حملة العودة للمدرسة 2024",
    description: "إعلان عاطفي يستهدف الأسر في موسم بدء العام الدراسي",
    platforms: ["Instagram", "TikTok", "Snapchat"],
    sector: "تجزئة",
    views: "2.3M",
    saved: 847,
  },
  {
    brand: "STC",
    logo: "S",
    logoColor: "#7c3aed",
    title: "رامي للإنترنت الفائق",
    description: "حملة كوميدية ترويجية لخدمة الإنترنت المنزلي بالسعودية",
    platforms: ["YouTube", "Facebook"],
    sector: "اتصالات",
    views: "5.1M",
    saved: 1203,
  },
  {
    brand: "أمازون السعودية",
    logo: "A",
    logoColor: "#f59e0b",
    title: "فرصة اليوم الواحد – ماجيك ديل",
    description: "إعلان مباشر بعروض لحظية يعتمد على الإلحاح وعد التنازلي",
    platforms: ["Instagram", "Snapchat"],
    sector: "تجارة إلكترونية",
    views: "8.7M",
    saved: 2104,
  },
  {
    brand: "نون",
    logo: "N",
    logoColor: "#facc15",
    title: "رمضان مع نون",
    description: "حملة رمضانية بأسلوب درامي يربط المنتج بقيم العائلة",
    platforms: ["TikTok", "YouTube", "Facebook"],
    sector: "تجارة إلكترونية",
    views: "3.8M",
    saved: 932,
  },
  {
    brand: "اتصالات الإمارات",
    logo: "E",
    logoColor: "#06b6d4",
    title: "خطط 5G الجديدة",
    description: "إعلان تقني يبرز سرعة الشبكة مع مؤثرين إماراتيين",
    platforms: ["Instagram", "Twitter", "YouTube"],
    sector: "اتصالات",
    views: "1.9M",
    saved: 541,
  },
  {
    brand: "أكواتيل",
    logo: "Q",
    logoColor: "#10b981",
    title: "الصيف مع أكواتيل",
    description: "حملة موسمية للمياه المعبأة تعتمد على الرياضة والطبيعة",
    platforms: ["Snapchat", "Instagram"],
    sector: "مواد استهلاكية",
    views: "1.1M",
    saved: 318,
  },
];

function PlatformTag({ name }: { name: string }) {
  return (
    <span
      className="px-2 py-0.5 rounded-md text-xs font-medium"
      style={{
        background: platformColors[name] ?? "#22c55e22",
        color: platformColors[`${name} text`] ?? "#22c55e",
      }}
    >
      {name}
    </span>
  );
}

export default function AdsGrid() {
  return (
    <section className="px-6 pb-10">
      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">أحدث الإعلانات</h2>
          <p className="text-sm" style={{ color: "#6b7280" }}>
            آخر الإعلانات المضافة من كبرى العلامات في MENA
          </p>
        </div>
        <button
          className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
          style={{
            background: "#1a1a1a",
            border: "1px solid #2a2a2a",
            color: "#d1d5db",
          }}
        >
          عرض الكل →
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {ads.map((ad, i) => (
          <article
            key={i}
            className="rounded-2xl p-5 cursor-pointer group transition-all duration-200"
            style={{
              background: "#141414",
              border: "1px solid #1e1e1e",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.border =
                "1px solid #22c55e30";
              (e.currentTarget as HTMLElement).style.background = "#161616";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.border =
                "1px solid #1e1e1e";
              (e.currentTarget as HTMLElement).style.background = "#141414";
            }}
          >
            {/* Brand header */}
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-extrabold shrink-0"
                style={{
                  background: `${ad.logoColor}22`,
                  color: ad.logoColor,
                  border: `1px solid ${ad.logoColor}33`,
                }}
              >
                {ad.logo}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">
                    {ad.brand}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: "#22c55e15",
                      color: "#22c55e",
                    }}
                  >
                    {ad.sector}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs" style={{ color: "#6b7280" }}>
                    👁 {ad.views} مشاهدة
                  </span>
                  <span className="text-xs" style={{ color: "#6b7280" }}>
                    🔖 {ad.saved} محفوظ
                  </span>
                </div>
              </div>
            </div>

            {/* Ad preview placeholder */}
            <div
              className="w-full h-32 rounded-xl mb-3 flex items-center justify-center"
              style={{
                background: "#1a1a1a",
                border: "1px solid #222222",
              }}
            >
              <span className="text-4xl opacity-20">▶</span>
            </div>

            {/* Title & description */}
            <h3 className="font-bold text-white text-sm mb-1 leading-snug">
              {ad.title}
            </h3>
            <p
              className="text-xs leading-relaxed mb-3 line-clamp-2"
              style={{ color: "#6b7280" }}
            >
              {ad.description}
            </p>

            {/* Platforms */}
            <div className="flex flex-wrap gap-1.5">
              {ad.platforms.map((p) => (
                <PlatformTag key={p} name={p} />
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
