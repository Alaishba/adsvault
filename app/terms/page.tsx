"use client";

import { useState } from "react";
import AppLayout from "../components/AppLayout";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

const defaultSections = [
  { title: "مقدمة", content: `منصة AdVault MENA هي خدمة B2B متخصصة في تحليل الإعلانات الرقمية لمنطقة الشرق الأوسط وشمال أفريقيا. باستخدام هذه المنصة، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على هذه الشروط، يرجى التوقف عن استخدام المنصة فوراً.` },
  { title: "شروط الاستخدام", content: `يجب أن يكون المستخدم شركة أو فرداً يعمل في مجال التسويق الرقمي. يُحظر استخدام المنصة لأي أغراض غير مشروعة أو مضللة. لا يجوز إعادة بيع أو توزيع المحتوى دون إذن خطي مسبق.` },
  { title: "سياسة الخصوصية", content: `نحن نجمع معلومات الحساب (الاسم والبريد الإلكتروني) وبيانات الاستخدام لتحسين الخدمة. لن نبيع بياناتك الشخصية لأطراف ثالثة. تُخزَّن بياناتك على خوادم آمنة.` },
  { title: "حقوق الملكية الفكرية", content: `جميع الإعلانات المعروضة على المنصة مستخدمة لأغراض التحليل والدراسة وفق مبدأ الاستخدام العادل. المحتوى التحليلي والاستراتيجيات المنشورة على AdVault هي ملكية فكرية للمنصة.` },
  { title: "إخلاء المسؤولية", content: `المعلومات المقدمة على المنصة هي لأغراض تعليمية وتحليلية فقط. لا تضمن AdVault دقة أو اكتمال جميع البيانات المعروضة.` },
  { title: "التواصل", content: `لأي استفسارات قانونية أو شكاوى:\nالبريد الإلكتروني: legal@advaultmena.com\nالعنوان: دبي، الإمارات العربية المتحدة\nساعات العمل: الأحد - الخميس، 9 صباحاً - 6 مساءً` },
];

export default function TermsPage() {
  const [showSupport, setShowSupport] = useState(false);
  const [supportForm, setSupportForm] = useState({ name: "", email: "", type: "", message: "" });
  const [supportLoading, setSupportLoading] = useState(false);
  const [supportSuccess, setSupportSuccess] = useState(false);

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSupportLoading(true);
    try {
      if (isSupabaseConfigured()) {
        await supabase.from("support_requests").insert({
          name: supportForm.name, email: supportForm.email,
          request_type: supportForm.type, message: supportForm.message,
          created_at: new Date().toISOString(),
        });
      }
      setSupportSuccess(true);
    } catch { /* fallback */ setSupportSuccess(true); }
    finally { setSupportLoading(false); }
  };

  return (
    <AppLayout>
      <div className="px-6 lg:px-10 py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold" style={{ color: "#ffffff" }}>الشروط والأحكام</h1>
          <p className="text-sm mt-1" style={{ color: "#94a3b8" }}>
            آخر تحديث: مارس 2025 — يرجى قراءة هذه الشروط بعناية قبل استخدام المنصة
          </p>
        </div>

        <div className="space-y-6">
          {defaultSections.map((section, i) => (
            <div key={i} className="rounded-2xl border overflow-hidden" style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)" }}>
              <div className="px-6 py-4 border-b" style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.1)" }}>
                <h2 className="font-extrabold text-base flex items-center gap-2" style={{ color: "#ffffff" }}>
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white"
                    style={{ background: "#2563eb" }}>{i + 1}</span>
                  {section.title}
                </h2>
              </div>
              <div className="px-6 py-5">
                <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "#94a3b8" }}>{section.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Customer Support Section */}
        <div className="mt-8 rounded-2xl border p-6" style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)" }}>
          <h3 className="font-extrabold text-base mb-2" style={{ color: "#ffffff" }}>خدمة العملاء</h3>
          <p className="text-sm mb-4" style={{ color: "#94a3b8" }}>
            هل تحتاج مساعدة؟ فريق الدعم الفني جاهز لمساعدتك في أي استفسار أو مشكلة تواجهها.
          </p>
          <button onClick={() => setShowSupport(true)}
            className="px-5 py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90"
            style={{ background: "#2563eb" }}>
            تواصل مع الدعم
          </button>
        </div>

        <div className="mt-6 p-4 rounded-xl border text-center" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
          <p className="text-xs" style={{ color: "#64748b" }}>AdVault MENA © 2025 — جميع الحقوق محفوظة</p>
        </div>
      </div>

      {/* Support Modal */}
      {showSupport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
          onClick={(e) => e.target === e.currentTarget && setShowSupport(false)}>
          <div className="w-full max-w-md rounded-2xl shadow-2xl p-6" style={{ background: "rgba(15,23,42,0.95)", backdropFilter: "blur(12px)" }}>
            {supportSuccess ? (
              <div className="text-center py-6">
                <div className="text-3xl mb-3">✅</div>
                <h3 className="font-extrabold text-lg mb-1" style={{ color: "#ffffff" }}>تم إرسال طلبك</h3>
                <p className="text-sm mb-4" style={{ color: "#94a3b8" }}>سنتواصل معك قريباً</p>
                <button onClick={() => { setShowSupport(false); setSupportSuccess(false); }}
                  className="px-5 py-2 rounded-xl text-sm font-bold text-white" style={{ background: "#2563eb" }}>
                  إغلاق
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-extrabold text-lg" style={{ color: "#ffffff" }}>تواصل مع الدعم</h3>
                  <button onClick={() => setShowSupport(false)} style={{ color: "#64748b" }}>✕</button>
                </div>
                <form onSubmit={handleSupportSubmit} className="space-y-3">
                  <input type="text" required placeholder="الاسم" value={supportForm.name}
                    onChange={(e) => setSupportForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border outline-none text-sm"
                    style={{ borderColor: "rgba(255,255,255,0.1)", color: "#ffffff" }} />
                  <input type="email" required placeholder="البريد الإلكتروني" value={supportForm.email}
                    onChange={(e) => setSupportForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border outline-none text-sm" dir="ltr"
                    style={{ borderColor: "rgba(255,255,255,0.1)", color: "#ffffff" }} />
                  <select required value={supportForm.type}
                    onChange={(e) => setSupportForm((f) => ({ ...f, type: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border outline-none text-sm"
                    style={{ borderColor: "rgba(255,255,255,0.1)", color: "#ffffff" }}>
                    <option value="">نوع الطلب</option>
                    <option>استفسار عام</option>
                    <option>مشكلة تقنية</option>
                    <option>استفسار عن الاشتراك</option>
                    <option>اقتراح</option>
                    <option>أخرى</option>
                  </select>
                  <textarea required rows={4} placeholder="رسالتك..." value={supportForm.message}
                    onChange={(e) => setSupportForm((f) => ({ ...f, message: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border outline-none text-sm resize-none"
                    style={{ borderColor: "rgba(255,255,255,0.1)", color: "#ffffff" }} />
                  <button type="submit" disabled={supportLoading}
                    className="w-full py-3 rounded-xl font-bold text-sm text-white disabled:opacity-60"
                    style={{ background: "#2563eb" }}>
                    {supportLoading ? "جارٍ الإرسال..." : "إرسال"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </AppLayout>
  );
}
