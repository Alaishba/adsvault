"use client";

import Link from "next/link";

const tiers = [
  { name: "مجاني", price: "0", features: ["50 إعلان", "التحليل الأساسي", "3 استراتيجيات شهرياً"] },
  { name: "Pro", price: "$99/شهرياً", features: ["إعلانات غير محدودة", "التحليل المتقدم", "جميع الاستراتيجيات", "قاعدة المؤثرين"], featured: true },
  { name: "Enterprise", price: "تواصل معنا", features: ["كل مزايا Pro", "إدارة فريق", "دعم مخصص 24/7"] },
];

export default function PaywallModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
        style={{ background: "#ffffff", animation: "modalIn 0.2s ease" }}>
        <style>{`@keyframes modalIn{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}`}</style>

        {/* Header */}
        <div className="px-6 pt-6 pb-4 text-center">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
            style={{ background: "rgba(37,99,235,0.15)" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h2 className="text-xl font-extrabold" style={{ color: "#1c1c1e" }}>محتوى حصري لمشتركي Pro</h2>
          <p className="text-sm mt-1" style={{ color: "#6b7280" }}>ترقّ للوصول الكامل لجميع التحليلات والاستراتيجيات</p>
        </div>

        {/* Tiers */}
        <div className="px-6 pb-4 space-y-3">
          {tiers.map((tier) => (
            <div key={tier.name} className="rounded-xl p-4 flex items-center justify-between"
              style={{
                background: tier.featured ? "rgba(137,87,246,0.06)" : "#f3f5f9",
                border: tier.featured ? "2px solid #2563eb" : "1px solid #e5e7eb",
              }}>
              <div>
                <p className="font-extrabold text-sm" style={{ color: tier.featured ? "#2563eb" : "#1c1c1e" }}>
                  {tier.name}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>{tier.price}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {tier.features.map((f) => (
                    <span key={f} className="text-[10px] px-2 py-0.5 rounded-full"
                      style={{ background: tier.featured ? "rgba(37,99,235,0.15)" : "#ffffff", color: "#6b7280" }}>{f}</span>
                  ))}
                </div>
              </div>
              {tier.featured && (
                <span className="text-[10px] px-2 py-1 rounded-full font-bold shrink-0"
                  style={{ background: "#2563eb", color: "#fff" }}>الأفضل</span>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="px-6 pb-6 space-y-2">
          <Link href="/pricing" onClick={onClose}
            className="block w-full py-3 rounded-xl font-bold text-sm text-center text-white transition-all hover:opacity-90"
            style={{ background: "#2563eb" }}>
            عرض جميع الخطط
          </Link>
          <button onClick={onClose}
            className="block w-full py-2 rounded-xl text-sm font-semibold text-center transition-all"
            style={{ color: "#6b7280" }}>
            ليس الآن
          </button>
        </div>
      </div>
    </div>
  );
}
