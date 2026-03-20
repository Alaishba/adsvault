const stats = [
  {
    value: "+12,000",
    label: "إعلان محلل",
    sublabel: "من كبرى العلامات التجارية",
    icon: "◈",
  },
  {
    value: "22",
    label: "دولة عربية",
    sublabel: "تغطية شاملة لمنطقة MENA",
    icon: "◎",
  },
  {
    value: "+85",
    label: "قطاع تجاري",
    sublabel: "من التقنية إلى العقارات",
    icon: "◐",
  },
  {
    value: "4.9★",
    label: "تقييم المستخدمين",
    sublabel: "رضا عملائنا أولويتنا",
    icon: "◉",
  },
];

export default function StatsRow() {
  return (
    <section className="px-6 py-6">
      <div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 rounded-2xl p-6"
        style={{
          background: "#141414",
          border: "1px solid #1e1e1e",
        }}
      >
        {stats.map((stat, i) => (
          <div
            key={i}
            className="flex flex-col items-center text-center py-4 px-2 rounded-xl relative"
            style={{
              background: i % 2 === 0 ? "#1a1a1a" : "transparent",
            }}
          >
            <span className="text-2xl mb-2" style={{ color: "#22c55e33" }}>
              {stat.icon}
            </span>
            <span
              className="text-3xl font-extrabold mb-1"
              style={{ color: "#22c55e" }}
            >
              {stat.value}
            </span>
            <span className="text-sm font-semibold text-white mb-0.5">
              {stat.label}
            </span>
            <span className="text-xs" style={{ color: "#6b7280" }}>
              {stat.sublabel}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
