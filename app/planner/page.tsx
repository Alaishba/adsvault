"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import AppLayout from "../components/AppLayout";

/* ────────────────────────── types ────────────────────────── */

interface FormData {
  businessName: string;
  businessType: string;
  sector: string;
  customerBase: string;
  goals: string[];
  budget: number;
  platforms: string[];
  gender: string;
  ageGroup: string;
  interests: string;
}

interface WeekPlan {
  content: string;
  platform: string;
  budget: number;
  stage: "وعي" | "اهتمام" | "تحويل";
}

interface StrategyCard {
  idea: string;
  platform: string;
  cost: string;
  result: string;
}

interface ActionItem {
  text: string;
  checked: boolean;
}

/* ────────────────────────── constants ────────────────────────── */

const BUSINESS_TYPES = [
  "تجارة إلكترونية",
  "خدمات",
  "مطاعم",
  "عقارات",
  "تعليم",
  "صحة",
  "أخرى",
];

const CUSTOMER_BASES = [
  "أقل من 100",
  "100-1,000",
  "1,000-10,000",
  "أكثر من 10,000",
];

const GOALS = [
  "زيادة المبيعات",
  "بناء الوعي",
  "جذب عملاء جدد",
  "تعزيز الولاء",
];

const PLATFORMS = ["Meta", "TikTok", "Snap", "Google", "YouTube"];

const GENDERS = ["ذكور", "إناث", "الكل"];

const AGE_GROUPS = ["18-24", "25-34", "35-44", "45+"];

const STAGE_COLORS: Record<string, string> = {
  وعي: "#3b82f6",
  اهتمام: "#eab308",
  تحويل: "#84cc18",
};

/* ────────────────────────── helpers ────────────────────────── */

function generateTimeline(form: FormData): WeekPlan[][] {
  const perWeek = form.budget / 4;
  const plat = form.platforms.length > 0 ? form.platforms : ["Meta"];

  const contentMap: Record<string, string[][]> = {
    "تجارة إلكترونية": [
      ["إعلان عرض تعريفي بالمنتجات", "فيديو قصير لعملية الشراء", "إعلان ترويجي مع خصم"],
      ["ستوري تفاعلية مع منتج مميز", "بوست مراجعة عميل سابق", "إعلان كاروسيل للمنتجات"],
      ["إعلان خصم حصري لمتابعي المنصة", "حملة إعادة استهداف للزوار", "بوست عد تنازلي للعرض"],
      ["حملة تحويل مباشرة للمتجر", "إعلان شهادة عميل راضٍ", "عرض نهاية الشهر"],
    ],
    default: [
      ["إعلان تعريفي بالعلامة التجارية", "فيديو قصير عن الخدمة", "بوست تثقيفي"],
      ["حملة تفاعل مع الجمهور", "ستوري خلف الكواليس", "بوست شهادة عميل"],
      ["إعلان عرض خاص محدود", "حملة استهداف جمهور مشابه", "محتوى تفاعلي"],
      ["حملة تحويل مباشرة", "إعلان إعادة استهداف", "عرض حصري للمتابعين"],
    ],
  };

  const contents = contentMap[form.businessType] || contentMap.default;
  const stages: Array<"وعي" | "اهتمام" | "تحويل"> = ["وعي", "اهتمام", "تحويل"];

  return contents.map((weekContents, wi) =>
    weekContents.map((c, ci) => ({
      content: c,
      platform: plat[ci % plat.length],
      budget: Math.round(perWeek / weekContents.length),
      stage: stages[Math.min(Math.floor((wi * 3) / 4 + ci / 3), 2)],
    }))
  );
}

function generateStrategies(form: FormData): StrategyCard[] {
  const base: StrategyCard[] = [];
  const budgetLabel = (pct: number) =>
    `${Math.round(form.budget * pct).toLocaleString("ar-SA")} ريال`;

  if (form.goals.includes("بناء الوعي") || form.goals.includes("جذب عملاء جدد")) {
    base.push({
      idea: `حملة فيديو قصير على ${form.platforms[0] || "Meta"} تعرّف الجمهور بنشاطك في مجال ${form.sector || form.businessType}`,
      platform: form.platforms[0] || "Meta",
      cost: budgetLabel(0.3),
      result: "زيادة الوصول بنسبة 40-60%",
    });
  }
  if (form.goals.includes("زيادة المبيعات")) {
    base.push({
      idea: "حملة إعادة استهداف للزوار السابقين مع عرض حصري محدود المدة",
      platform: form.platforms.includes("Google") ? "Google" : form.platforms[0] || "Meta",
      cost: budgetLabel(0.25),
      result: "معدل تحويل متوقع 3-5%",
    });
  }
  base.push({
    idea: `إعلان تفاعلي (استفتاء/مسابقة) لبناء مجتمع حول ${form.businessName || "علامتك التجارية"}`,
    platform: form.platforms.includes("TikTok") ? "TikTok" : form.platforms.includes("Snap") ? "Snap" : "Meta",
    cost: budgetLabel(0.15),
    result: "زيادة التفاعل 25-35%",
  });
  if (form.goals.includes("تعزيز الولاء")) {
    base.push({
      idea: "برنامج ولاء رقمي مع محتوى حصري ونقاط مكافآت للعملاء الحاليين",
      platform: "Meta",
      cost: budgetLabel(0.1),
      result: "تحسين معدل الاحتفاظ 20%",
    });
  }
  if (base.length < 3) {
    base.push({
      idea: "حملة شهادات عملاء حقيقيين على شكل ستوريز قصيرة",
      platform: form.platforms.includes("Snap") ? "Snap" : "Meta",
      cost: budgetLabel(0.2),
      result: "زيادة الثقة وتحسين التحويل 15%",
    });
  }
  return base.slice(0, 4);
}

function generateActions(): string[][] {
  return [
    [
      "تجهيز المحتوى البصري (صور + فيديو قصير)",
      "إعداد حسابات الإعلانات على المنصات المختارة",
      "تحديد الجمهور المستهدف وإنشاء الشرائح",
      "إطلاق حملة الوعي الأولى",
    ],
    [
      "مراجعة أداء الأسبوع الأول وتحسين الاستهداف",
      "إطلاق حملة تفاعلية (استفتاء / مسابقة)",
      "نشر محتوى شهادة عميل",
      "تعديل الميزانية بناءً على الأداء",
    ],
    [
      "إطلاق حملة إعادة استهداف",
      "نشر عرض خاص محدود المدة",
      "تحليل مصادر الزيارات وتحسين القنوات",
      "إنشاء محتوى خلف الكواليس",
    ],
    [
      "مراجعة شاملة لأداء الحملات",
      "إطلاق عرض نهاية الشهر",
      "تجميع البيانات وإعداد تقرير الأداء",
      "التخطيط للشهر القادم بناءً على النتائج",
    ],
  ];
}

/* ────────────────────────── component ────────────────────────── */

export default function PlannerPage() {
  const [step, setStep] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [form, setForm] = useState<FormData>({
    businessName: "",
    businessType: "",
    sector: "",
    customerBase: "",
    goals: [],
    budget: 10000,
    platforms: [],
    gender: "الكل",
    ageGroup: "25-34",
    interests: "",
  });

  /* action plan checkboxes */
  const [actions, setActions] = useState<ActionItem[][]>([]);

  /* animation trigger */
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* step 2 init */
  useEffect(() => {
    if (step === 2) {
      const generated = generateActions();
      setActions(generated.map((week) => week.map((t) => ({ text: t, checked: false }))));
      requestAnimationFrame(() => {
        setTimeout(() => setAnimateIn(true), 50);
      });
    } else {
      setAnimateIn(false);
    }
  }, [step]);

  /* funnel numbers based on budget */
  const funnel = useMemo(() => {
    const mult = form.budget / 5000;
    return {
      وعي: Math.round(1000 * mult),
      اهتمام: Math.round(300 * mult),
      تحويل: Math.round(45 * mult),
      ولاء: Math.round(12 * mult),
    };
  }, [form.budget]);

  const timeline = useMemo(() => generateTimeline(form), [form]);
  const strategies = useMemo(() => generateStrategies(form), [form]);

  /* budget allocation */
  const platformAlloc = useMemo(() => {
    const plats = form.platforms.length > 0 ? form.platforms : ["Meta"];
    const each = form.budget / plats.length;
    return plats.map((p) => ({ name: p, amount: each, pct: 100 / plats.length }));
  }, [form.platforms, form.budget]);

  /* action plan progress */
  const actionProgress = useMemo(() => {
    const total = actions.flat().length;
    if (total === 0) return 0;
    const checked = actions.flat().filter((a) => a.checked).length;
    return Math.round((checked / total) * 100);
  }, [actions]);

  const toggleAction = useCallback((wi: number, ai: number) => {
    setActions((prev) =>
      prev.map((week, w) =>
        w === wi ? week.map((a, i) => (i === ai ? { ...a, checked: !a.checked } : a)) : week
      )
    );
  }, []);

  const toggleGoal = (g: string) =>
    setForm((f) => ({
      ...f,
      goals: f.goals.includes(g) ? f.goals.filter((x) => x !== g) : [...f.goals, g],
    }));

  const togglePlatform = (p: string) =>
    setForm((f) => ({
      ...f,
      platforms: f.platforms.includes(p) ? f.platforms.filter((x) => x !== p) : [...f.platforms, p],
    }));

  const handleExport = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  if (!mounted) return null;

  /* ── shared styles ── */
  const cardClass =
    "rounded-2xl border p-6 transition-all duration-500";
  const cardStyle = {
    background: "var(--card)",
    borderColor: "var(--border)",
  };

  const labelClass = "block text-sm font-medium mb-2";
  const inputClass =
    "w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-[#84cc18]";
  const inputStyle = {
    background: "var(--surface2)",
    borderColor: "var(--border)",
    color: "var(--text-primary)",
  };

  return (
    <AppLayout>
      <div
        className="min-h-screen px-4 py-8 sm:px-6 lg:px-10"
        style={{ background: "var(--bg)", color: "var(--text-primary)" }}
      >
        {/* ── page title ── */}
        <h1 className="text-3xl font-bold mb-2">مخطط الحملات الإعلانية</h1>
        <p className="mb-8" style={{ color: "var(--text-secondary)" }}>
          أنشئ خطة إعلانية متكاملة مخصصة لنشاطك التجاري في دقائق
        </p>

        {/* ── step indicator ── */}
        <div className="flex items-center justify-center gap-4 mb-10">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300"
                style={{
                  background: step >= s ? "#84cc18" : "var(--surface2)",
                  color: step >= s ? "#fff" : "var(--text-secondary)",
                }}
              >
                {s}
              </div>
              <span
                className="text-sm font-medium hidden sm:inline"
                style={{ color: step >= s ? "var(--text-primary)" : "var(--text-secondary)" }}
              >
                {s === 1 ? "بيانات النشاط" : "لوحة الحملة"}
              </span>
              {s === 1 && (
                <div
                  className="w-16 h-1 rounded-full mx-2"
                  style={{ background: step >= 2 ? "#84cc18" : "var(--border)" }}
                />
              )}
            </div>
          ))}
        </div>

        {/* ══════════════ STEP 1 ══════════════ */}
        {step === 1 && (
          <div className="max-w-3xl mx-auto animate-fadeIn">
            <div className={cardClass} style={cardStyle}>
              <h2 className="text-xl font-bold mb-6">الملف التجاري</h2>

              <div className="grid gap-6 sm:grid-cols-2">
                {/* business name */}
                <div>
                  <label className={labelClass}>اسم نشاطك التجاري</label>
                  <input
                    className={inputClass}
                    style={inputStyle}
                    value={form.businessName}
                    onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                    placeholder="مثال: متجر نوران"
                  />
                </div>

                {/* business type */}
                <div>
                  <label className={labelClass}>نوع النشاط</label>
                  <select
                    className={inputClass}
                    style={inputStyle}
                    value={form.businessType}
                    onChange={(e) => setForm({ ...form, businessType: e.target.value })}
                  >
                    <option value="">اختر نوع النشاط</option>
                    {BUSINESS_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {/* sector */}
                <div>
                  <label className={labelClass}>المجال / القطاع</label>
                  <input
                    className={inputClass}
                    style={inputStyle}
                    value={form.sector}
                    onChange={(e) => setForm({ ...form, sector: e.target.value })}
                    placeholder="مثال: أزياء نسائية"
                  />
                </div>

                {/* customer base */}
                <div>
                  <label className={labelClass}>حجم قاعدة العملاء الحالية</label>
                  <select
                    className={inputClass}
                    style={inputStyle}
                    value={form.customerBase}
                    onChange={(e) => setForm({ ...form, customerBase: e.target.value })}
                  >
                    <option value="">اختر الحجم</option>
                    {CUSTOMER_BASES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* goals */}
              <div className="mt-6">
                <label className={labelClass}>الهدف الرئيسي</label>
                <div className="flex flex-wrap gap-2">
                  {GOALS.map((g) => (
                    <button
                      key={g}
                      onClick={() => toggleGoal(g)}
                      className="px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200"
                      style={{
                        background: form.goals.includes(g) ? "#84cc18" : "var(--surface2)",
                        color: form.goals.includes(g) ? "#fff" : "var(--text-primary)",
                        borderColor: form.goals.includes(g) ? "#84cc18" : "var(--border)",
                      }}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* budget slider */}
              <div className="mt-6">
                <label className={labelClass}>
                  الميزانية الشهرية للإعلانات:{" "}
                  <span className="font-bold" style={{ color: "#84cc18" }}>
                    {form.budget.toLocaleString("ar-SA")} ريال
                  </span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={50000}
                  step={500}
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: +e.target.value })}
                  className="w-full accent-[#84cc18] h-2 rounded-lg cursor-pointer"
                  style={{ accentColor: "#84cc18" }}
                />
                <div
                  className="flex justify-between text-xs mt-1"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <span>0</span>
                  <span>50,000 ريال</span>
                </div>
              </div>

              {/* platforms */}
              <div className="mt-6">
                <label className={labelClass}>المنصات المستخدمة حالياً</label>
                <div className="flex flex-wrap gap-2">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p}
                      onClick={() => togglePlatform(p)}
                      className="px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200"
                      style={{
                        background: form.platforms.includes(p) ? "#8957f6" : "var(--surface2)",
                        color: form.platforms.includes(p) ? "#fff" : "var(--text-primary)",
                        borderColor: form.platforms.includes(p) ? "#8957f6" : "var(--border)",
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* target audience */}
              <div className="mt-6">
                <label className="block text-base font-bold mb-4">الجمهور المستهدف</label>

                <div className="grid gap-5 sm:grid-cols-3">
                  {/* gender */}
                  <div>
                    <label className={labelClass}>الجنس</label>
                    <div className="flex flex-wrap gap-2">
                      {GENDERS.map((g) => (
                        <button
                          key={g}
                          onClick={() => setForm({ ...form, gender: g })}
                          className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
                          style={{
                            background: form.gender === g ? "#84cc18" : "var(--surface2)",
                            color: form.gender === g ? "#fff" : "var(--text-primary)",
                            borderColor: form.gender === g ? "#84cc18" : "var(--border)",
                          }}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* age */}
                  <div>
                    <label className={labelClass}>الفئة العمرية</label>
                    <div className="flex flex-wrap gap-2">
                      {AGE_GROUPS.map((a) => (
                        <button
                          key={a}
                          onClick={() => setForm({ ...form, ageGroup: a })}
                          className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
                          style={{
                            background: form.ageGroup === a ? "#84cc18" : "var(--surface2)",
                            color: form.ageGroup === a ? "#fff" : "var(--text-primary)",
                            borderColor: form.ageGroup === a ? "#84cc18" : "var(--border)",
                          }}
                        >
                          {a}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* interests */}
                  <div>
                    <label className={labelClass}>الاهتمامات</label>
                    <input
                      className={inputClass}
                      style={inputStyle}
                      value={form.interests}
                      onChange={(e) => setForm({ ...form, interests: e.target.value })}
                      placeholder="أزياء، تقنية، رياضة ..."
                    />
                  </div>
                </div>
              </div>

              {/* next button */}
              <div className="mt-8 flex justify-start">
                <button
                  onClick={() => setStep(2)}
                  className="px-8 py-3 rounded-xl text-white font-bold text-base transition-transform hover:scale-[1.03] active:scale-95"
                  style={{ background: "#84cc18" }}
                >
                  التالي ←
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════ STEP 2 ══════════════ */}
        {step === 2 && (
          <div className="space-y-8 max-w-6xl mx-auto">
            {/* back button */}
            <button
              onClick={() => setStep(1)}
              className="px-5 py-2 rounded-xl text-sm font-medium border transition hover:opacity-80"
              style={{
                borderColor: "var(--border)",
                color: "var(--text-primary)",
                background: "var(--surface2)",
              }}
            >
              → رجوع
            </button>

            {/* ── A. Campaign Timeline ── */}
            <section
              className={`${cardClass} overflow-hidden`}
              style={{
                ...cardStyle,
                opacity: animateIn ? 1 : 0,
                transform: animateIn ? "translateY(0)" : "translateY(24px)",
                transitionDuration: "700ms",
              }}
            >
              <h2 className="text-xl font-bold mb-6">الجدول الزمني للحملة</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {timeline.map((week, wi) => (
                  <div
                    key={wi}
                    className="rounded-xl border p-4 space-y-3"
                    style={{ borderColor: "var(--border)", background: "var(--surface2)" }}
                  >
                    <h3 className="font-bold text-sm mb-2">الأسبوع {wi + 1}</h3>
                    {week.map((item, ii) => (
                      <div
                        key={ii}
                        className="rounded-lg p-3 text-xs space-y-1"
                        style={{
                          background: "var(--card)",
                          borderRight: `3px solid ${STAGE_COLORS[item.stage]}`,
                        }}
                      >
                        <p className="font-medium leading-relaxed">{item.content}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span
                            className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                            style={{ background: "#8957f6" }}
                          >
                            {item.platform}
                          </span>
                          <span style={{ color: "var(--text-secondary)" }}>
                            {item.budget.toLocaleString("ar-SA")} ريال
                          </span>
                        </div>
                        <span
                          className="inline-block px-2 py-0.5 rounded text-[10px] font-medium text-white mt-1"
                          style={{ background: STAGE_COLORS[item.stage] }}
                        >
                          {item.stage}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              {/* legend */}
              <div className="flex flex-wrap gap-4 mt-4 text-xs" style={{ color: "var(--text-secondary)" }}>
                {Object.entries(STAGE_COLORS).map(([label, color]) => (
                  <span key={label} className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full inline-block" style={{ background: color }} />
                    {label}
                  </span>
                ))}
              </div>
            </section>

            {/* ── B. Customer Journey Funnel ── */}
            <section
              className={cardClass}
              style={{
                ...cardStyle,
                opacity: animateIn ? 1 : 0,
                transform: animateIn ? "translateY(0)" : "translateY(24px)",
                transitionDelay: "150ms",
                transitionDuration: "700ms",
              }}
            >
              <h2 className="text-xl font-bold mb-6">محاكاة رحلة العميل</h2>
              <div className="space-y-4">
                {(
                  [
                    { key: "وعي", color: "#3b82f6", suggestion: "إعلانات الوصول والفيديو", costPct: 0.4, resultLabel: "مشاهدة" },
                    { key: "اهتمام", color: "#eab308", suggestion: "إعلانات تفاعلية وإعادة استهداف", costPct: 0.3, resultLabel: "تفاعل" },
                    { key: "تحويل", color: "#84cc18", suggestion: "إعلانات مباشرة مع عرض خاص", costPct: 0.2, resultLabel: "عملية شراء" },
                    { key: "ولاء", color: "#8957f6", suggestion: "محتوى حصري وبرنامج مكافآت", costPct: 0.1, resultLabel: "عميل دائم" },
                  ] as const
                ).map((stage) => {
                  const count = funnel[stage.key];
                  const maxCount = funnel["وعي"];
                  const widthPct = maxCount > 0 ? (count / maxCount) * 100 : 0;
                  return (
                    <div key={stage.key}>
                      <div className="flex items-center justify-between mb-1 text-sm">
                        <span className="font-bold">{stage.key}</span>
                        <span style={{ color: "var(--text-secondary)" }}>
                          {count.toLocaleString("ar-SA")}
                        </span>
                      </div>
                      <div
                        className="w-full h-8 rounded-lg overflow-hidden"
                        style={{ background: "var(--surface2)" }}
                      >
                        <div
                          className="h-full rounded-lg transition-all duration-1000 ease-out flex items-center justify-end px-3"
                          style={{
                            width: animateIn ? `${widthPct}%` : "0%",
                            background: stage.color,
                            minWidth: animateIn ? "60px" : "0",
                          }}
                        >
                          <span className="text-white text-xs font-bold">
                            {count.toLocaleString("ar-SA")}
                          </span>
                        </div>
                      </div>
                      <div
                        className="flex flex-wrap gap-x-6 gap-y-1 mt-1 text-xs"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        <span>المحتوى: {stage.suggestion}</span>
                        <span>
                          التكلفة: {Math.round(form.budget * stage.costPct).toLocaleString("ar-SA")} ريال
                        </span>
                        <span>
                          النتيجة المتوقعة: {count.toLocaleString("ar-SA")} {stage.resultLabel}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ── C & D: Budget Allocator + Strategy Cards ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* C. Budget Allocator */}
              <section
                className={cardClass}
                style={{
                  ...cardStyle,
                  opacity: animateIn ? 1 : 0,
                  transform: animateIn ? "translateY(0)" : "translateY(24px)",
                  transitionDelay: "300ms",
                  transitionDuration: "700ms",
                }}
              >
                <h2 className="text-xl font-bold mb-6">توزيع الميزانية</h2>
                <div className="space-y-4">
                  {platformAlloc.map((p) => (
                    <div key={p.name}>
                      <div className="flex items-center justify-between mb-1 text-sm">
                        <span className="font-medium">{p.name}</span>
                        <span style={{ color: "var(--text-secondary)" }}>
                          {Math.round(p.amount).toLocaleString("ar-SA")} ريال ({Math.round(p.pct)}%)
                        </span>
                      </div>
                      <div
                        className="w-full h-4 rounded-full overflow-hidden"
                        style={{ background: "var(--surface2)" }}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: animateIn ? `${p.pct}%` : "0%",
                            background: "#8957f6",
                            minWidth: animateIn ? "20px" : "0",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs mt-4" style={{ color: "var(--text-secondary)" }}>
                  إجمالي الميزانية الشهرية: {form.budget.toLocaleString("ar-SA")} ريال
                </p>
              </section>

              {/* D. Recommended Strategy Cards */}
              <section
                className={cardClass}
                style={{
                  ...cardStyle,
                  opacity: animateIn ? 1 : 0,
                  transform: animateIn ? "translateY(0)" : "translateY(24px)",
                  transitionDelay: "450ms",
                  transitionDuration: "700ms",
                }}
              >
                <h2 className="text-xl font-bold mb-6">استراتيجيات مقترحة</h2>
                <div className="space-y-3">
                  {strategies.map((s, i) => (
                    <div
                      key={i}
                      className="rounded-xl border p-4"
                      style={{ borderColor: "var(--border)", background: "var(--surface2)" }}
                    >
                      <p className="text-sm font-medium leading-relaxed mb-2">{s.idea}</p>
                      <div className="flex flex-wrap items-center gap-3 text-xs">
                        <span
                          className="px-2 py-0.5 rounded-full text-white font-bold"
                          style={{ background: "#8957f6" }}
                        >
                          {s.platform}
                        </span>
                        <span style={{ color: "var(--text-secondary)" }}>التكلفة: {s.cost}</span>
                        <span style={{ color: "#84cc18" }} className="font-medium">
                          {s.result}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* ── E. Action Plan ── */}
            <section
              className={cardClass}
              style={{
                ...cardStyle,
                opacity: animateIn ? 1 : 0,
                transform: animateIn ? "translateY(0)" : "translateY(24px)",
                transitionDelay: "600ms",
                transitionDuration: "700ms",
              }}
            >
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h2 className="text-xl font-bold">خطة العمل</h2>
                <div className="flex items-center gap-3">
                  <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    الإنجاز: {actionProgress}%
                  </span>
                  <div
                    className="w-32 h-3 rounded-full overflow-hidden"
                    style={{ background: "var(--surface2)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${actionProgress}%`,
                        background: "#84cc18",
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {actions.map((week, wi) => (
                  <div
                    key={wi}
                    className="rounded-xl border p-4"
                    style={{ borderColor: "var(--border)", background: "var(--surface2)" }}
                  >
                    <h3 className="font-bold text-sm mb-3">الأسبوع {wi + 1}</h3>
                    <div className="space-y-2">
                      {week.map((item, ai) => (
                        <label
                          key={ai}
                          className="flex items-start gap-2 cursor-pointer text-xs leading-relaxed"
                        >
                          <input
                            type="checkbox"
                            checked={item.checked}
                            onChange={() => toggleAction(wi, ai)}
                            className="mt-0.5 rounded accent-[#84cc18]"
                            style={{ accentColor: "#84cc18" }}
                          />
                          <span
                            style={{
                              textDecoration: item.checked ? "line-through" : "none",
                              color: item.checked ? "var(--text-secondary)" : "var(--text-primary)",
                            }}
                          >
                            {item.text}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── F. Export Button ── */}
            <div
              className="flex justify-center"
              style={{
                opacity: animateIn ? 1 : 0,
                transform: animateIn ? "translateY(0)" : "translateY(24px)",
                transition: "all 700ms ease",
                transitionDelay: "750ms",
              }}
            >
              <button
                onClick={handleExport}
                className="px-8 py-3 rounded-xl text-white font-bold text-base transition-transform hover:scale-[1.03] active:scale-95"
                style={{ background: "#8957f6" }}
              >
                تصدير الخطة PDF
              </button>
            </div>
          </div>
        )}

        {/* ── Toast ── */}
        {showToast && (
          <div
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl text-white font-medium text-sm shadow-lg animate-bounce"
            style={{ background: "#84cc18" }}
          >
            تم تجهيز الخطة للتصدير ✓
          </div>
        )}
      </div>
    </AppLayout>
  );
}
