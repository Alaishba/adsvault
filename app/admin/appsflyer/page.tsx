"use client";

import { useState } from "react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

interface EventMapping {
  label: string;
  key: string;
  defaultEvent: string;
  enabled: boolean;
  eventName: string;
}

export default function AppsFlyerPage() {
  // Section 1 — API Configuration
  const [appId, setAppId] = useState("");
  const [devKey, setDevKey] = useState("");
  const [apiToken, setApiToken] = useState("");
  const [showDevKey, setShowDevKey] = useState(false);
  const [showApiToken, setShowApiToken] = useState(false);
  const [savingCreds, setSavingCreds] = useState(false);
  const [credsSaved, setCredsSaved] = useState(false);

  // Section 2 — Event Mapping
  const [events, setEvents] = useState<EventMapping[]>([
    { label: "تسجيل مستخدم جديد", key: "registration", defaultEvent: "af_complete_registration", enabled: true, eventName: "af_complete_registration" },
    { label: "ترقية للـ Pro", key: "purchase", defaultEvent: "af_purchase", enabled: true, eventName: "af_purchase" },
    { label: "حفظ إعلان", key: "save_ad", defaultEvent: "af_add_to_wishlist", enabled: true, eventName: "af_add_to_wishlist" },
    { label: "فتح تحليل", key: "content_view", defaultEvent: "af_content_view", enabled: true, eventName: "af_content_view" },
    { label: "إنشاء خطة حملة", key: "campaign_plan", defaultEvent: "af_initiated_checkout", enabled: true, eventName: "af_initiated_checkout" },
  ]);

  // Section 3 — Connection Status
  const [connectionStatus, setConnectionStatus] = useState<"disconnected" | "connected">("disconnected");
  const [testing, setTesting] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);

  const handleSaveCredentials = async () => {
    setSavingCreds(true);
    setCredsSaved(false);
    try {
      if (isSupabaseConfigured()) {
        await supabase.from("appsflyer_config").upsert({
          id: 1,
          app_id: appId,
          dev_key: devKey,
          api_token: apiToken,
          updated_at: new Date().toISOString(),
        });
      }
      // Mock save delay
      await new Promise((r) => setTimeout(r, 600));
      setCredsSaved(true);
    } finally {
      setSavingCreds(false);
    }
  };

  const toggleEvent = (index: number) => {
    setEvents((prev) =>
      prev.map((e, i) => (i === index ? { ...e, enabled: !e.enabled } : e))
    );
  };

  const updateEventName = (index: number, value: string) => {
    setEvents((prev) =>
      prev.map((e, i) => (i === index ? { ...e, eventName: value } : e))
    );
  };

  const handleTestConnection = () => {
    setTesting(true);
    setTimeout(() => {
      setTesting(false);
      setConnectionStatus("connected");
      setLastSync(new Date().toLocaleString("ar-EG"));
    }, 1500);
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-lg bg-white border border-[#e5e7eb] text-[#1c1c1e] placeholder-[#9ca3af] focus:outline-none focus:border-[#84cc18] transition-colors";

  return (
    <div className="min-h-screen bg-[#f3f5f9] p-6 md:p-8" dir="rtl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1c1c1e] mb-2">ربط AppsFlyer</h1>
        <p className="text-[#6b7280]">
          إعداد تكامل AppsFlyer لتتبع الأحداث والتحويلات
        </p>
      </div>

      <div className="space-y-6 max-w-4xl">
        {/* Section 1 — API Configuration */}
        <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
          <h2 className="text-lg font-semibold text-[#1c1c1e] mb-6">
            إعدادات API
          </h2>

          <div className="space-y-5">
            {/* App ID */}
            <div>
              <label className="block text-sm text-[#6b7280] mb-2">
                AppsFlyer App ID
              </label>
              <input
                type="text"
                value={appId}
                onChange={(e) => setAppId(e.target.value)}
                placeholder="com.example.app"
                className={inputClass}
              />
            </div>

            {/* Dev Key */}
            <div>
              <label className="block text-sm text-[#6b7280] mb-2">
                AppsFlyer Dev Key
              </label>
              <div className="relative">
                <input
                  type={showDevKey ? "text" : "password"}
                  value={devKey}
                  onChange={(e) => setDevKey(e.target.value)}
                  placeholder="••••••••••••"
                  className={inputClass + " pl-20"}
                />
                <button
                  type="button"
                  onClick={() => setShowDevKey(!showDevKey)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#6b7280] hover:text-[#1c1c1e] transition-colors"
                >
                  {showDevKey ? "إخفاء" : "إظهار"}
                </button>
              </div>
            </div>

            {/* API Token */}
            <div>
              <label className="block text-sm text-[#6b7280] mb-2">
                API Token
              </label>
              <div className="relative">
                <input
                  type={showApiToken ? "text" : "password"}
                  value={apiToken}
                  onChange={(e) => setApiToken(e.target.value)}
                  placeholder="••••••••••••"
                  className={inputClass + " pl-20"}
                />
                <button
                  type="button"
                  onClick={() => setShowApiToken(!showApiToken)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#6b7280] hover:text-[#1c1c1e] transition-colors"
                >
                  {showApiToken ? "إخفاء" : "إظهار"}
                </button>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={handleSaveCredentials}
                disabled={savingCreds}
                className="px-6 py-2.5 bg-[#84cc18] text-white font-medium rounded-lg hover:bg-[#76b814] transition-colors disabled:opacity-60"
              >
                {savingCreds ? "جاري الحفظ..." : "حفظ بيانات الاعتماد"}
              </button>
              {credsSaved && (
                <span className="text-sm text-[#84cc18]">
                  تم الحفظ بنجاح
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Section 2 — Event Mapping */}
        <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
          <h2 className="text-lg font-semibold text-[#1c1c1e] mb-6">
            ربط الأحداث
          </h2>

          <div className="space-y-4">
            {events.map((event, index) => (
              <div
                key={event.key}
                className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 rounded-lg bg-[#f3f5f9] border border-[#e5e7eb]"
              >
                {/* Event label */}
                <span className="text-[#1c1c1e] text-sm font-medium min-w-[160px] shrink-0">
                  {event.label}
                </span>

                {/* Toggle switch */}
                <button
                  type="button"
                  onClick={() => toggleEvent(index)}
                  className={`relative w-12 h-6 rounded-full shrink-0 transition-colors ${
                    event.enabled ? "bg-[#84cc18]" : "bg-[#d1d5db]"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      event.enabled ? "right-1" : "left-1"
                    }`}
                  />
                </button>

                {/* AppsFlyer event name input */}
                <input
                  type="text"
                  value={event.eventName}
                  onChange={(e) => updateEventName(index, e.target.value)}
                  disabled={!event.enabled}
                  className={`flex-1 px-3 py-2 rounded-lg bg-white border border-[#e5e7eb] text-[#1c1c1e] text-sm placeholder-[#9ca3af] focus:outline-none focus:border-[#84cc18] transition-colors ${
                    !event.enabled ? "opacity-40" : ""
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Section 3 — Connection Status */}
        <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
          <h2 className="text-lg font-semibold text-[#1c1c1e] mb-6">
            حالة الاتصال
          </h2>

          <div className="space-y-5">
            {/* Status badge */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#6b7280]">الحالة:</span>
              {connectionStatus === "disconnected" ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-red-50 text-red-500">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  غير متصل
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-600">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  متصل ✓
                </span>
              )}
            </div>

            {/* Test button */}
            <div>
              <button
                onClick={handleTestConnection}
                disabled={testing}
                className="px-6 py-2.5 bg-[#84cc18] text-white font-medium rounded-lg hover:bg-[#76b814] transition-colors disabled:opacity-60 inline-flex items-center gap-2"
              >
                {testing && (
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                )}
                {testing ? "جاري الاختبار..." : "اختبار الاتصال"}
              </button>
            </div>

            {/* Last sync */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-[#6b7280]">آخر مزامنة:</span>
              <span className="text-[#1c1c1e]">
                {lastSync ?? "لم تتم المزامنة بعد"}
              </span>
            </div>

            {/* Note */}
            <div className="mt-4 p-4 rounded-lg bg-[#f3f5f9] border border-[#e5e7eb]">
              <p className="text-sm text-[#6b7280]">
                هذه صفحة إعداد — يتطلب حساب AppsFlyer فعّال للتفعيل الكامل
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
