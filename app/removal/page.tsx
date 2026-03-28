"use client";

import { useState } from "react";
import AppLayout from "../components/AppLayout";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

export default function RemovalPage() {
  const [form, setForm] = useState({ name: "", email: "", url: "", reason: "", details: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isSupabaseConfigured()) {
        const { error: dbError } = await supabase.from("removal_requests").insert({
          name: form.name,
          email: form.email,
          content_url: form.url,
          reason: form.reason,
          details: form.details,
          created_at: new Date().toISOString(),
        });
        if (dbError) throw dbError;
      }
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "حدث خطأ، يرجى المحاولة مجدداً");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AppLayout>
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="text-center max-w-sm">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-4"
              style={{ background: "var(--primary-light)" }}>✅</div>
            <h2 className="text-xl font-extrabold mb-2" style={{ color: "var(--text-primary)" }}>
              تم استلام طلبك
            </h2>
            <p className="text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
              سيتم مراجعة طلبك خلال 3-5 أيام عمل
            </p>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              سنتواصل معك على البريد الإلكتروني المقدم
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="px-6 lg:px-10 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold" style={{ color: "var(--text-primary)" }}>طلب إزالة محتوى</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            إذا كنت تعتقد أن محتوى على منصتنا ينتهك حقوقك، يرجى ملء النموذج أدناه
          </p>
        </div>

        <div className="rounded-2xl border border-[--border] p-6" style={{ background: "var(--card)" }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>الاسم الكامل</label>
                <input type="text" required value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="محمد أحمد"
                  className="w-full px-4 py-2.5 rounded-xl border border-[--border] outline-none text-sm transition-colors focus:border-blue-500/60"
                  style={{ background: "#ffffff", color: "var(--text-primary)" }} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>البريد الإلكتروني</label>
                <input type="email" required value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-[--border] outline-none text-sm transition-colors focus:border-blue-500/60"
                  style={{ background: "#ffffff", color: "var(--text-primary)" }} dir="ltr" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>رابط المحتوى</label>
              <input type="url" required value={form.url}
                onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                placeholder="https://mulhem.com/..."
                className="w-full px-4 py-2.5 rounded-xl border border-[--border] outline-none text-sm transition-colors focus:border-blue-500/60"
                style={{ background: "#ffffff", color: "var(--text-primary)" }} dir="ltr" />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>سبب الإزالة</label>
              <select required value={form.reason}
                onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-[--border] outline-none text-sm"
                style={{ background: "#ffffff", color: "var(--text-primary)" }}>
                <option value="">اختر السبب</option>
                <option>انتهاك حقوق الملكية الفكرية</option>
                <option>محتوى مضلل أو غير دقيق</option>
                <option>انتهاك الخصوصية</option>
                <option>محتوى مسيء أو ضار</option>
                <option>انتهاك العلامة التجارية</option>
                <option>أخرى</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>تفاصيل إضافية</label>
              <textarea required rows={5} value={form.details}
                onChange={(e) => setForm((f) => ({ ...f, details: e.target.value }))}
                placeholder="اشرح سبب طلب الإزالة بالتفصيل وأي معلومات إضافية تساعدنا في مراجعة طلبك..."
                className="w-full px-4 py-2.5 rounded-xl border border-[--border] outline-none text-sm resize-none transition-colors focus:border-blue-500/60"
                style={{ background: "#ffffff", color: "var(--text-primary)" }} />
            </div>

            {error && (
              <div className="px-3 py-2 rounded-lg text-xs" style={{ background: "#fef2f2", color: "#b91c1c" }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 disabled:opacity-60"
              style={{ background: "#2563eb" }}>
              {loading ? "جارٍ الإرسال..." : "إرسال طلب الإزالة"}
            </button>
          </form>
        </div>

        <div className="mt-4 p-4 rounded-xl border border-[--border] text-sm" style={{ color: "var(--text-secondary)" }}>
          <strong style={{ color: "var(--text-primary)" }}>ملاحظة:</strong> سيتم مراجعة جميع الطلبات خلال 3-5 أيام عمل. في الحالات الطارئة، يمكنك التواصل مباشرة على: legal@mulhem.com
        </div>
      </div>
    </AppLayout>
  );
}
