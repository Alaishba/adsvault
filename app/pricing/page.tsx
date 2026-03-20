"use client";

import { useState } from "react";
import AppLayout from "../components/AppLayout";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

const plans = [
  {
    name: "مجاني", nameEn: "Free", price: "0", period: "للأبد",
    description: "ابدأ باستكشاف الإعلانات بدون أي تكلفة",
    cta: "ابدأ مجاناً", featured: false, isEnterprise: false,
    features: [
      { label: "عدد الإعلانات", value: "50 إعلان" },
      { label: "التحليل الأساسي", value: true },
      { label: "التحليل المتقدم (Pro)", value: false },
      { label: "إدارة فريق", value: false },
      { label: "الاستراتيجيات", value: "3 شهرياً" },
      { label: "المؤثرون", value: false },
      { label: "الدعم", value: "عام" },
    ],
  },
  {
    name: "Pro", nameEn: "Pro", price: "99", period: "شهرياً",
    description: "للمسوّقين المحترفين وفرق التسويق المتنامية",
    cta: "ابدأ تجربة مجانية 14 يوماً", featured: true, isEnterprise: false,
    features: [
      { label: "عدد الإعلانات", value: "غير محدود" },
      { label: "التحليل الأساسي", value: true },
      { label: "التحليل المتقدم (Pro)", value: true },
      { label: "إدارة فريق", value: "حتى 3 أعضاء" },
      { label: "الاستراتيجيات", value: "غير محدود" },
      { label: "المؤثرون", value: true },
      { label: "الدعم", value: "أولوية" },
    ],
  },
  {
    name: "Enterprise", nameEn: "Enterprise", price: "تواصل معنا", period: "",
    description: "للوكالات والشركات الكبرى مع احتياجات مخصصة",
    cta: "تواصل مع فريق المبيعات", featured: false, isEnterprise: true,
    features: [
      { label: "عدد الإعلانات", value: "غير محدود" },
      { label: "التحليل الأساسي", value: true },
      { label: "التحليل المتقدم (Pro)", value: true },
      { label: "إدارة فريق", value: "غير محدود" },
      { label: "الاستراتيجيات", value: "غير محدود" },
      { label: "المؤثرون", value: true },
      { label: "الدعم", value: "مخصص 24/7" },
    ],
  },
];

function FeatureValue({ value }: { value: boolean | string }) {
  if (value === true) return (
    <span className="flex items-center justify-center">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#84cc18" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
    </span>
  );
  if (value === false) return (
    <span className="flex items-center justify-center" style={{ color: "var(--text-secondary)" }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </span>
  );
  return <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{value}</span>;
}

function PaymentModal({ onClose, planName }: { onClose: () => void; planName: string }) {
  const [card, setCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSuccess(true); }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
        style={{ background: "var(--card)", animation: "modalIn 0.2s cubic-bezier(0.34,1.56,0.64,1)" }}>
        <style>{`@keyframes modalIn{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}`}</style>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[--border]">
          <h2 className="font-extrabold text-lg" style={{ color: "var(--text-primary)" }}>
            إتمام الاشتراك — {planName}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[--surface2]"
            style={{ color: "var(--text-secondary)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-4"
              style={{ background: "var(--primary-light)" }}>✓</div>
            <h3 className="text-xl font-extrabold mb-2" style={{ color: "var(--text-primary)" }}>تم الاشتراك بنجاح!</h3>
            <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>مرحباً بك في خطة {planName}</p>
            <button onClick={onClose}
              className="px-6 py-2.5 rounded-xl font-bold text-sm text-white"
              style={{ background: "#84cc18" }}>
              ابدأ الاستخدام
            </button>
          </div>
        ) : (
          <form onSubmit={handlePay} className="p-6 space-y-4">
            <div className="p-3 rounded-xl text-xs text-center" style={{ background: "var(--surface2)", color: "var(--text-secondary)" }}>
              ⚠️ بيئة تجريبية — سيتم ربط بوابة دفع حقيقية لاحقاً
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>رقم البطاقة</label>
              <input type="text" required value={card} onChange={(e) => setCard(e.target.value)}
                placeholder="1234 5678 9012 3456" maxLength={19}
                className="w-full px-4 py-2.5 rounded-xl border border-[--border] outline-none text-sm"
                style={{ background: "#ffffff", color: "var(--text-primary)" }} dir="ltr" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>تاريخ الانتهاء</label>
                <input type="text" required value={expiry} onChange={(e) => setExpiry(e.target.value)}
                  placeholder="MM/YY" maxLength={5}
                  className="w-full px-4 py-2.5 rounded-xl border border-[--border] outline-none text-sm"
                  style={{ background: "#ffffff", color: "var(--text-primary)" }} dir="ltr" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>CVV</label>
                <input type="text" required value={cvv} onChange={(e) => setCvv(e.target.value)}
                  placeholder="123" maxLength={4}
                  className="w-full px-4 py-2.5 rounded-xl border border-[--border] outline-none text-sm"
                  style={{ background: "#ffffff", color: "var(--text-primary)" }} dir="ltr" />
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 disabled:opacity-60"
              style={{ background: "#84cc18" }}>
              {loading ? "جارٍ المعالجة..." : "إتمام الدفع"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function ContactModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (isSupabaseConfigured()) {
      await supabase.from("contact_requests").insert({ ...form, created_at: new Date().toISOString() });
    }
    setTimeout(() => { setLoading(false); setSuccess(true); }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
        style={{ background: "var(--card)", animation: "modalIn 0.2s cubic-bezier(0.34,1.56,0.64,1)" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[--border]">
          <h2 className="font-extrabold text-lg" style={{ color: "var(--text-primary)" }}>تواصل مع فريق المبيعات</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[--surface2]"
            style={{ color: "var(--text-secondary)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>
        {success ? (
          <div className="p-8 text-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mx-auto mb-3"
              style={{ background: "var(--primary-light)" }}>✓</div>
            <p className="font-extrabold mb-1" style={{ color: "var(--text-primary)" }}>تم استلام رسالتك!</p>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>سنتواصل معك خلال 24 ساعة</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {[
              { key: "name", label: "الاسم", placeholder: "محمد أحمد", type: "text" },
              { key: "email", label: "البريد الإلكتروني", placeholder: "you@company.com", type: "email", dir: "ltr" as const },
              { key: "company", label: "الشركة", placeholder: "اسم شركتك", type: "text" },
            ].map(({ key, label, placeholder, type, dir }) => (
              <div key={key}>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>{label}</label>
                <input type={type} required value={(form as Record<string, string>)[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  placeholder={placeholder} dir={dir}
                  className="w-full px-4 py-2.5 rounded-xl border border-[--border] outline-none text-sm"
                  style={{ background: "#ffffff", color: "var(--text-primary)" }} />
              </div>
            ))}
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>رسالتك</label>
              <textarea rows={4} required value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                placeholder="أخبرنا عن احتياجاتك..."
                className="w-full px-4 py-2.5 rounded-xl border border-[--border] outline-none text-sm resize-none"
                style={{ background: "#ffffff", color: "var(--text-primary)" }} />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm text-white hover:opacity-90 disabled:opacity-60"
              style={{ background: "#84cc18" }}>
              {loading ? "جارٍ الإرسال..." : "إرسال"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function PricingPage() {
  const [payModal, setPayModal] = useState<string | null>(null);
  const [contactModal, setContactModal] = useState(false);

  return (
    <AppLayout>
      <div className="px-6 lg:px-10 py-10">
        <div className="text-center mb-12 max-w-xl mx-auto">
          <h1 className="text-3xl font-extrabold mb-3" style={{ color: "var(--text-primary)" }}>خطط بسيطة وشفافة</h1>
          <p className="text-base" style={{ color: "var(--text-secondary)" }}>ابدأ مجاناً وطوّر خطتك عندما تكون مستعداً</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-14">
          {plans.map((plan) => (
            <div key={plan.name}
              className="rounded-2xl border flex flex-col relative overflow-hidden transition-all"
              style={{
                background: plan.featured ? "#1c1c1e" : "var(--card)",
                borderColor: plan.featured ? "#8957f6" : "var(--border)",
                boxShadow: plan.featured ? "0 0 40px #8957f622" : undefined,
              }}>
              {plan.featured && (
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold"
                  style={{ background: "#8957f6", color: "#fff" }}>الأكثر شيوعاً</div>
              )}

              <div className="p-7 pb-5">
                <p className={`text-base font-extrabold mb-1 ${plan.featured ? "text-white" : ""}`}
                  style={{ color: plan.featured ? "#fff" : "var(--text-primary)" }}>{plan.name}</p>
                <div className="flex items-end gap-1 mb-2">
                  {plan.price === "تواصل معنا" ? (
                    <span className="text-2xl font-extrabold" style={{ color: plan.featured ? "#fff" : "var(--text-primary)" }}>تواصل معنا</span>
                  ) : (
                    <>
                      <span className="text-4xl font-black" style={{ color: plan.featured ? "#fff" : "var(--text-primary)" }}>${plan.price}</span>
                      {plan.period && <span className="text-sm pb-1" style={{ color: plan.featured ? "#aeaeb2" : "var(--text-secondary)" }}>/{plan.period}</span>}
                    </>
                  )}
                </div>
                <p className="text-sm" style={{ color: plan.featured ? "#aeaeb2" : "var(--text-secondary)" }}>{plan.description}</p>
              </div>

              <div className="px-7 pb-7">
                <button
                  onClick={() => plan.isEnterprise ? setContactModal(true) : setPayModal(plan.name)}
                  className="block w-full py-3 rounded-xl font-bold text-sm text-center transition-all hover:opacity-90"
                  style={plan.featured
                    ? { background: "#84cc18", color: "#fff" }
                    : { background: "var(--surface2)", color: "var(--text-primary)", border: "1px solid var(--border)" }
                  }>
                  {plan.cta}
                </button>
              </div>

              <div className="border-t px-7 py-5 flex-1 space-y-3"
                style={{ borderColor: plan.featured ? "#3a3a3c" : "var(--border)" }}>
                {plan.features.map((f) => (
                  <div key={f.label} className="flex items-center justify-between gap-2">
                    <span className="text-sm" style={{ color: plan.featured ? "#d1d5db" : "var(--text-secondary)" }}>{f.label}</span>
                    <FeatureValue value={f.value} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center text-sm" style={{ color: "var(--text-secondary)" }}>
          هل لديك سؤال؟{" "}
          <button onClick={() => setContactModal(true)} className="font-semibold hover:underline" style={{ color: "#84cc18" }}>
            تواصل معنا
          </button>
        </div>
      </div>

      {payModal && <PaymentModal planName={payModal} onClose={() => setPayModal(null)} />}
      {contactModal && <ContactModal onClose={() => setContactModal(false)} />}
    </AppLayout>
  );
}
