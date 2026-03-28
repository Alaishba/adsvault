"use client";

import { useState } from "react";
import AppLayout from "../components/AppLayout";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

const termsSections = [
  { title: "قبول الشروط", content: `باستخدامك منصة مُلهِم فأنت توافق على هذه الشروط كاملةً وتلتزم بها. إن كنت لا توافق على أي بند، يُرجى التوقف عن استخدام المنصة.` },
  { title: "طبيعة المنصة", content: `مُلهِم منصة تعليمية وتحليلية متخصصة في دراسة الإعلانات التجارية الناجحة. جميع المحتويات المعروضة — بما فيها الإعلانات والتحليلات — هي لأغراض تعليمية وبحثية حصراً، تهدف إلى مساعدة المسوقين وأصحاب النشاطات التجارية على فهم آليات نجاح الحملات الإعلانية واستلهام الأفكار منها لحملاتهم الخاصة. لا تدّعي مُلهِم ملكية أي إعلان معروض على المنصة.` },
  { title: "إخلاء المسؤولية عن الملكية الفكرية — بيان الاستخدام العادل", content: `تحترم منصة مُلهِم حقوق الملكية الفكرية لجميع العلامات التجارية والشركات. الإعلانات المعروضة هي ملك حصري لأصحابها الأصليين. استخدام هذا المحتوى يندرج ضمن مبدأ الاستخدام العادل (Fair Use) وفق ما تنص عليه قوانين حقوق الملكية الفكرية الدولية، وذلك للأسباب التالية:\n- الغرض تعليمي وتحليلي وليس تجارياً أو ربحياً مباشراً\n- المحتوى يُستخدم بصورة تحويلية (Transformative) — أي إضافة تحليل ونقد وقيمة جديدة تختلف عن الغرض الأصلي للإعلان\n- لا يُشكّل العرض بديلاً عن الإعلان الأصلي ولا يُلحق ضرراً بسوقه\n- يُنسب المحتوى دائماً لأصحابه الأصليين، كما يوجد اختصار للمصدر الأصلي في جميع بطاقات الإعلانات` },
  { title: "حظر الاستخدام التجاري للمحتوى", content: `لا يحق لأي مستخدم إعادة نشر أو توزيع أو بيع أو استخدام الإعلانات المعروضة على مُلهِم لأغراض تجارية دون الحصول على إذن صريح من أصحابها الأصليين. مُلهِم غير مسؤولة عن أي استخدام مخالف من قِبل المستخدمين.` },
  { title: "طلبات إزالة المحتوى", content: `إذا كنت صاحب علامة تجارية أو حامل حقوق وترغب في إزالة إعلانك من المنصة، يحق لك تقديم طلب رسمي عبر صفحة "طلب إزالة المحتوى" أو التواصل معنا عبر البريد الإلكتروني. تلتزم مُلهِم بمراجعة الطلب والرد خلال 7 أيام عمل، وإزالة المحتوى فور التحقق من صحة الطلب.` },
  { title: "حدود المسؤولية", content: `التحليلات المقدمة على المنصة هي آراء تعليمية لا تمثل ضماناً لنتائج تجارية. مُلهِم غير مسؤولة عن أي قرارات تجارية أو تسويقية تُبنى على محتواها. النتائج تختلف بحسب طبيعة كل منطقة وعلامة تجارية ونشاطها وسوقها.` },
  { title: "حساب المستخدم", content: `أنت مسؤول عن الحفاظ على سرية بيانات دخولك. تحتفظ مُلهِم بحق تعليق أو إلغاء أي حساب يخالف هذه الشروط.` },
  { title: "التعديلات", content: `تحتفظ مُلهِم بحق تعديل هذه الشروط في أي وقت. يُعدّ استمرارك في استخدام المنصة بعد نشر التعديلات موافقةً ضمنية عليها.` },
  { title: "القانون المطبّق", content: `تخضع هذه الشروط لأحكام نظام التجارة الإلكترونية في المملكة العربية السعودية وأنظمة حماية الملكية الفكرية المعمول بها.` },
];

const privacySections = [
  { title: "البيانات التي نجمعها", content: `نجمع البيانات التالية عند التسجيل واستخدام المنصة: الاسم الكامل، البريد الإلكتروني، المسمى الوظيفي والشركة (اختياري)، بيانات الاستخدام (الصفحات، الإعلانات المحفوظة، مدة الجلسة).` },
  { title: "كيف نستخدم بياناتك", content: `تُستخدم البيانات لتشغيل حسابك وتحسين تجربتك، وإرسال تحديثات عن المنصة إن وافقت، وتحليل أنماط الاستخدام لتطوير الخدمة. لا نبيع بياناتك لأطراف ثالثة بأي شكل من الأشكال.` },
  { title: "المحتوى المعروض والخصوصية", content: `مُلهِم لا تجمع أي بيانات شخصية أو تجارية خاصة بالشركات أصحاب الإعلانات المعروضة. البيانات المجموعة تخص المستخدمين المسجلين فقط.` },
  { title: "الغرض التعليمي وعدم الاستغلال التجاري للبيانات", content: `تؤكد مُلهِم أنها لا تستخدم بيانات المستخدمين أو محتوى الإعلانات لأغراض تجارية مباشرة كبيع الإعلانات أو استهداف المستخدمين. جميع البيانات تُستخدم حصراً لتحسين تجربة التعلم والتحليل داخل المنصة.` },
  { title: "الأمان", content: `نستخدم تقنيات تشفير وبنية تحتية آمنة لحماية بياناتك. رغم ذلك، لا يمكن ضمان أمان مطلق لأي منصة رقمية.` },
  { title: "ملفات الكوكيز", content: `نستخدم كوكيز ضرورية لتشغيل المنصة وتحسين الأداء.` },
  { title: "حقوقك كمستخدم", content: `يحق لك في أي وقت: الاطلاع على بياناتك المحفوظة، تعديلها من صفحة حسابك، طلب حذف حسابك وجميع بياناتك نهائياً عبر صفحة "طلب إزالة المحتوى".` },
  { title: "التواصل", content: `لأي استفسار أو طلب متعلق بخصوصيتك: Support@mulhem.sa` },
];

const contactSection = { title: "الدعم والتواصل", content: `لأي استفسارات تقنية أو قانونية أو شكاوى:\nالبريد الإلكتروني: Support@mulhem.sa\nواتساب: +966597005000\nالعنوان: الرياض، المملكة العربية السعودية\nساعات العمل: الأحد - الخميس، 9 صباحاً - 6 مساءً` };

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
      <div className="px-6 lg:px-10 py-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold" style={{color:'#ffffff'}}>الشروط والأحكام — منصة مُلهِم</h1>
          <p className="text-sm mt-1" style={{color:'#ffffff'}}>
            آخر تحديث: مارس 2026 — يرجى قراءة هذه الشروط بعناية قبل استخدام المنصة
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* RIGHT column — الشروط والأحكام */}
          <div className="bg-[#ced3de] rounded-2xl p-6">
            <h2 className="text-lg font-extrabold text-slate-900 mb-4">الشروط والأحكام</h2>
            {termsSections.map((section, idx) => (
              <div key={idx}>
                <h3 className="text-sm font-bold text-slate-900 mb-2">{idx + 1}. {section.title}</h3>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line mb-4">{section.content}</p>
              </div>
            ))}
          </div>

          {/* LEFT column — سياسة الخصوصية */}
          <div className="bg-[#ced3de] rounded-2xl p-6">
            <h2 className="text-lg font-extrabold text-slate-900 mb-4">سياسة الخصوصية — منصة مُلهِم</h2>
            <p className="text-xs text-slate-600 mb-4">آخر تحديث: مارس 2026</p>
            {privacySections.map((section, idx) => (
              <div key={idx}>
                <h3 className="text-sm font-bold text-slate-900 mb-2">{idx + 1}. {section.title}</h3>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line mb-4">{section.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* الدعم والتواصل */}
        <div className="bg-[#ced3de] rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-extrabold text-slate-900 mb-3">الدعم والتواصل</h2>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line mb-4">{contactSection.content}</p>
          <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-slate-700">
            <span>Support@mulhem.sa</span>
            <span>الرياض، المملكة العربية السعودية</span>
          </div>
          <button onClick={() => setShowSupport(true)}
            className="px-5 py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90"
            style={{ background: "#2563eb" }}>
            تواصل مع الدعم
          </button>
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
