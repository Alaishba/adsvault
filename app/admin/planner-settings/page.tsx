"use client";

import { useState } from "react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

const platforms = ["Meta", "TikTok", "Snap", "Google", "YouTube"] as const;
type Platform = (typeof platforms)[number];

const sectors = [
  "تجزئة",
  "اتصالات",
  "تجارة إلكترونية",
  "مواد استهلاكية",
  "خدمات مالية",
  "مطاعم",
  "عقارات",
  "تعليم",
] as const;
type Sector = (typeof sectors)[number];

const defaultCPM: Record<Platform, number> = {
  Meta: 25,
  TikTok: 18,
  Snap: 22,
  Google: 30,
  YouTube: 20,
};

const defaultMinBudget: Record<Platform, number> = {
  Meta: 5000,
  TikTok: 3000,
  Snap: 4000,
  Google: 6000,
  YouTube: 4000,
};

const defaultSplit: Record<Platform, number> = {
  Meta: 30,
  TikTok: 25,
  Snap: 15,
  Google: 20,
  YouTube: 10,
};

const defaultSectorTags: Record<Sector, string> = {
  "تجزئة": "عروض, خصومات, تسوق",
  "اتصالات": "باقات, إنترنت, اتصال",
  "تجارة إلكترونية": "شحن, توصيل, متجر",
  "مواد استهلاكية": "منتجات, يومي, عائلة",
  "خدمات مالية": "تمويل, بطاقات, استثمار",
  "مطاعم": "طعام, توصيل, عروض",
  "عقارات": "شقق, فلل, استثمار",
  "تعليم": "دورات, تعلم, تطوير",
};

export default function PlannerSettingsPage() {
  // Section 1 — Funnel Conversion Rates
  const [awarenessToInterest, setAwarenessToInterest] = useState(30);
  const [interestToConversion, setInterestToConversion] = useState(15);
  const [conversionToLoyalty, setConversionToLoyalty] = useState(25);

  // Section 2 — Platform CPM Rates
  const [cpmRates, setCpmRates] = useState<Record<Platform, number>>({ ...defaultCPM });

  // Section 3 — Sector Multipliers
  const [sectorMultipliers, setSectorMultipliers] = useState<Record<Sector, number>>(
    () => Object.fromEntries(sectors.map((s) => [s, 1.0])) as Record<Sector, number>
  );

  // Section 4 — Budget Recommendations
  const [minBudgets, setMinBudgets] = useState<Record<Platform, number>>({ ...defaultMinBudget });
  const [splitPcts, setSplitPcts] = useState<Record<Platform, number>>({ ...defaultSplit });

  // Section 5 — Strategy Matching Rules
  const [sectorTags, setSectorTags] = useState<Record<Sector, string>>({ ...defaultSectorTags });

  // Save state
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const splitTotal = Object.values(splitPcts).reduce((a, b) => a + b, 0);

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      funnel_rates: {
        awareness_to_interest: awarenessToInterest,
        interest_to_conversion: interestToConversion,
        conversion_to_loyalty: conversionToLoyalty,
      },
      cpm_rates: cpmRates,
      sector_multipliers: sectorMultipliers,
      min_budgets: minBudgets,
      split_percentages: splitPcts,
      sector_tags: sectorTags,
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      await supabase
        .from("planner_settings")
        .upsert({ id: "default", ...payload }, { onConflict: "id" });
    }

    setSaving(false);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 2000);
  };

  /* ── shared styles ── */
  const cardClass =
    "rounded-2xl border p-6 mb-6";
  const cardStyle = { backgroundColor: "#ffffff", borderColor: "#e5e7eb" };
  const inputClass =
    "w-full rounded-lg px-3 py-2 text-sm text-[#1c1c1e] placeholder-[#9ca3af] outline-none focus:ring-0";
  const inputStyle = {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  };
  const inputFocusClass = "focus:border-[#84cc18]/60";
  const labelClass = "block text-sm font-medium text-[#1c1c1e] mb-1";
  const secondaryText = { color: "#6b7280" };

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ backgroundColor: "#f3f5f9" }}>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1c1c1e] mb-2">إعدادات مخطط الحملة</h1>
        <p className="text-sm" style={secondaryText}>
          تعديل معايير الحسابات والتوصيات في مخطط الحملات
        </p>
      </div>

      {/* ── Section 1: Funnel Conversion Rates ── */}
      <div className={cardClass} style={cardStyle}>
        <h2 className="text-lg font-semibold text-[#1c1c1e] mb-4">معدلات التحويل في القمع</h2>

        {[
          { label: "وعي → اهتمام", value: awarenessToInterest, set: setAwarenessToInterest },
          { label: "اهتمام → تحويل", value: interestToConversion, set: setInterestToConversion },
          { label: "تحويل → ولاء", value: conversionToLoyalty, set: setConversionToLoyalty },
        ].map((item) => (
          <div key={item.label} className="mb-5 last:mb-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#1c1c1e]">{item.label}</span>
              <span className="text-sm font-bold" style={{ color: "#84cc18" }}>
                {item.value}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={item.value}
              onChange={(e) => item.set(Number(e.target.value))}
              className="w-full accent-[#84cc18] h-2 rounded-lg cursor-pointer"
              style={{ backgroundColor: "#e5e7eb" }}
            />
          </div>
        ))}
      </div>

      {/* ── Section 2: Platform CPM Rates ── */}
      <div className={cardClass} style={cardStyle}>
        <h2 className="text-lg font-semibold text-[#1c1c1e] mb-4">أسعار CPM حسب المنصة</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {platforms.map((p) => (
            <div key={p}>
              <label className={labelClass}>{p}</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  value={cpmRates[p]}
                  onChange={(e) =>
                    setCpmRates((prev) => ({ ...prev, [p]: Number(e.target.value) }))
                  }
                  className={`${inputClass} ${inputFocusClass}`}
                  style={inputStyle}
                />
                <span className="text-sm whitespace-nowrap" style={secondaryText}>
                  ر.س
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 3: Sector Multipliers ── */}
      <div className={cardClass} style={cardStyle}>
        <h2 className="text-lg font-semibold text-[#1c1c1e] mb-4">معاملات القطاعات</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {sectors.map((s) => (
            <div key={s}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#1c1c1e]">{s}</span>
                <span className="text-sm font-bold" style={{ color: "#8957f6" }}>
                  {sectorMultipliers[s].toFixed(1)}x
                </span>
              </div>
              <input
                type="range"
                min={0.5}
                max={3.0}
                step={0.1}
                value={sectorMultipliers[s]}
                onChange={(e) =>
                  setSectorMultipliers((prev) => ({
                    ...prev,
                    [s]: parseFloat(Number(e.target.value).toFixed(1)),
                  }))
                }
                className="w-full accent-[#8957f6] h-2 rounded-lg cursor-pointer"
                style={{ backgroundColor: "#e5e7eb" }}
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs" style={secondaryText}>0.5x</span>
                <span className="text-xs" style={secondaryText}>3.0x</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 4: Budget Recommendations ── */}
      <div className={cardClass} style={cardStyle}>
        <h2 className="text-lg font-semibold text-[#1c1c1e] mb-4">توصيات الميزانية</h2>

        {/* Minimum budgets */}
        <h3 className="text-sm font-medium mb-3" style={secondaryText}>
          الحد الأدنى للميزانية حسب المنصة (ر.س)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {platforms.map((p) => (
            <div key={p}>
              <label className={labelClass}>{p}</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  value={minBudgets[p]}
                  onChange={(e) =>
                    setMinBudgets((prev) => ({ ...prev, [p]: Number(e.target.value) }))
                  }
                  className={`${inputClass} ${inputFocusClass}`}
                  style={inputStyle}
                />
                <span className="text-sm whitespace-nowrap" style={secondaryText}>
                  ر.س
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Split percentages */}
        <h3 className="text-sm font-medium mb-3" style={secondaryText}>
          نسب التوزيع الموصى بها
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {platforms.map((p) => (
            <div key={p}>
              <label className={labelClass}>{p}</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={splitPcts[p]}
                  onChange={(e) =>
                    setSplitPcts((prev) => ({ ...prev, [p]: Number(e.target.value) }))
                  }
                  className={`${inputClass} ${inputFocusClass}`}
                  style={inputStyle}
                />
                <span className="text-sm" style={secondaryText}>%</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <span className="text-sm" style={secondaryText}>المجموع:</span>
          <span
            className="text-sm font-bold"
            style={{ color: splitTotal === 100 ? "#84cc18" : "#ff453a" }}
          >
            {splitTotal}%
          </span>
          {splitTotal !== 100 && (
            <span className="text-xs" style={{ color: "#ff453a" }}>
              (يجب أن يساوي 100%)
            </span>
          )}
        </div>
      </div>

      {/* ── Section 5: Strategy Matching Rules ── */}
      <div className={cardClass} style={cardStyle}>
        <h2 className="text-lg font-semibold text-[#1c1c1e] mb-2">قواعد مطابقة الاستراتيجيات</h2>
        <p className="text-xs mb-4" style={secondaryText}>
          أدخل الكلمات المفتاحية مفصولة بفواصل لكل قطاع
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sectors.map((s) => (
            <div key={s}>
              <label className={labelClass}>{s}</label>
              <input
                type="text"
                value={sectorTags[s]}
                onChange={(e) =>
                  setSectorTags((prev) => ({ ...prev, [s]: e.target.value }))
                }
                placeholder="كلمات مفتاحية مفصولة بفواصل"
                className={`${inputClass} ${inputFocusClass}`}
                style={inputStyle}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Save Button ── */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3 rounded-xl text-white font-semibold text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: "#84cc18" }}
        >
          {saving ? "جارٍ الحفظ..." : "حفظ الإعدادات"}
        </button>

        {successMsg && (
          <span className="text-sm font-medium" style={{ color: "#84cc18" }}>
            ✓ تم حفظ الإعدادات بنجاح
          </span>
        )}
      </div>
    </div>
  );
}
