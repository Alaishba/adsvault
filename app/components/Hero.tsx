export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-16 px-8 text-center">
      {/* Background glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, #22c55e18 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-medium"
        style={{
          background: "#22c55e15",
          border: "1px solid #22c55e30",
          color: "#22c55e",
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        منصة الذكاء الإعلاني الأولى في MENA
      </div>

      {/* Headline */}
      <h1
        className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4"
        style={{ color: "#ffffff", letterSpacing: "-0.02em" }}
      >
        فكّك الإعلانات الناجحة.{" "}
        <span
          style={{
            background: "linear-gradient(90deg, #22c55e, #4ade80)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          طبّقها باحتراف
        </span>
      </h1>

      {/* Subheadline */}
      <p
        className="text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
        style={{ color: "#9ca3af" }}
      >
        استكشف آلاف الإعلانات من كبرى العلامات في المنطقة، وافهم ما يجعلها
        تنجح، وطبّق الاستراتيجيات على حملاتك التسويقية.
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          className="px-8 py-3.5 rounded-xl font-bold text-base transition-all hover:scale-105"
          style={{
            background: "#22c55e",
            color: "#0f0f0f",
            boxShadow: "0 0 30px #22c55e44",
          }}
        >
          ابدأ مجاناً الآن
        </button>
        <button
          className="px-8 py-3.5 rounded-xl font-bold text-base transition-all hover:border-green-500"
          style={{
            background: "transparent",
            color: "#ffffff",
            border: "1px solid #2a2a2a",
          }}
        >
          استعرض المكتبة
        </button>
      </div>

      {/* Trusted by */}
      <p className="mt-8 text-xs" style={{ color: "#4b5563" }}>
        يستخدمه أكثر من{" "}
        <span style={{ color: "#22c55e" }}>500+ فريق تسويقي</span> في المنطقة
      </p>
    </section>
  );
}
