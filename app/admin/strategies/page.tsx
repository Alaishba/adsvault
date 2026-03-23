"use client";

import { useState, useRef, useEffect } from "react";
import { type Strategy } from "../../lib/mockData";
import { uploadFile } from "../../lib/storage";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { fetchStrategies } from "../../lib/db";

const emptyForm = {
  brand: "", brandInitial: "", brandColor: "#8957f6",
  title: "", preview: "",
  insights: [] as string[],
  sector: "",
  tags: [] as string[],
  date: "",
  thumbnail: "",
  is_pro_only: false,
};

export default function AdminStrategiesPage() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [thumbPreview, setThumbPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchStrategies().then(setStrategies); }, []);
  const reload = () => fetchStrategies().then(setStrategies);

  const filtered = strategies.filter(
    (s) => s.title.includes(search) || s.brand.includes(search) || s.sector.includes(search)
  );

  const openAdd = () => {
    setForm(emptyForm);
    setEditId(null);
    setThumbPreview(null);
    setShowForm(true);
  };

  const openEdit = (s: Strategy) => {
    setForm({
      brand: s.brand, brandInitial: s.brandInitial, brandColor: s.brandColor,
      title: s.title, preview: s.preview,
      insights: s.insights ?? [],
      sector: s.sector,
      tags: s.tags ?? [],
      date: s.date,
      thumbnail: s.thumbnail ?? "",
      is_pro_only: (s as unknown as Record<string, boolean>).is_pro_only ?? false,
    });
    setThumbPreview(s.thumbnail ?? null);
    setEditId(s.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("strategies").delete().eq("id", id);
    setStrategies((prev) => prev.filter((s) => s.id !== id));
  };

  const handleThumbnailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { url } = await uploadFile("strategy-covers", file, `strategy-${Date.now()}`);
    if (url) {
      setThumbPreview(url);
      setForm((f) => ({ ...f, thumbnail: url }));
    }
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.title || !form.brand) return;
    const stratData = {
      title: form.title, brand: form.brand,
      description: form.preview,
      insights: form.insights, tags: form.tags,
      thumbnail: form.thumbnail || null,
      is_pro_only: form.is_pro_only,
    };
    try {
      if (editId) {
        await supabase.from("strategies").update(stratData).eq("id", editId);
      } else {
        await supabase.from("strategies").insert(stratData);
      }
      await reload();
    } catch (err) { console.error("Save error:", err); }
    setShowForm(false);
    setEditId(null);
  };

  return (
    <div className="px-6 lg:px-10 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1c1c1e]">الاستراتيجيات</h1>
          <p className="text-sm mt-0.5" style={{ color: "#6b7280" }}>{filtered.length} استراتيجية</p>
        </div>
        <button onClick={openAdd}
          className="px-4 py-2 rounded-xl text-sm font-bold transition-all hover:opacity-90"
          style={{ background: "#84cc18", color: "#fff" }}>
          + إضافة استراتيجية
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border mb-5"
        style={{ background: "#ffffff", borderColor: "#e5e7eb" }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث عن استراتيجية..."
          className="bg-transparent outline-none w-full text-sm text-[#1c1c1e] placeholder:text-[#9ca3af]" dir="rtl" />
      </div>

      {/* Table */}
      <div className="rounded-2xl border overflow-hidden" style={{ background: "#ffffff", borderColor: "#e5e7eb" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "#f3f5f9" }}>
                {["العلامة", "العنوان", "القطاع", "Pro فقط", "التاريخ", "الإجراءات"].map((h) => (
                  <th key={h} className="text-right px-5 py-3 text-xs font-bold uppercase tracking-wider"
                    style={{ color: "#6b7280" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "#e5e7eb" }}>
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-[#f3f5f9] transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      {s.thumbnail ? (
                        <img src={s.thumbnail} alt={s.brand}
                          className="w-7 h-7 rounded-lg object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                          style={{ background: s.brandColor }}>{s.brandInitial}</div>
                      )}
                      <span className="font-bold text-[#1c1c1e]">{s.brand}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 max-w-[240px] truncate text-[#1c1c1e]">{s.title}</td>
                  <td className="px-5 py-3" style={{ color: "#6b7280" }}>{s.sector}</td>
                  <td className="px-5 py-3">
                    {(s as unknown as Record<string, boolean>).is_pro_only ? (
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "#f3eeff", color: "#8957f6" }}>Pro</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "#f3f5f9", color: "#6b7280" }}>مجاني</span>
                    )}
                  </td>
                  <td className="px-5 py-3" style={{ color: "#6b7280" }} dir="ltr">{s.date}</td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(s)}
                        className="text-xs px-2.5 py-1 rounded-lg font-medium border border-[#e5e7eb] hover:border-[#8957f6]/40 transition-all"
                        style={{ color: "#6b7280" }}>تعديل</button>
                      <button onClick={() => handleDelete(s.id)}
                        className="text-xs px-2.5 py-1 rounded-lg font-medium border transition-all"
                        style={{ borderColor: "#fecaca", color: "#ef4444" }}>حذف</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(4px)" }}
          onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <div className="w-full max-w-2xl rounded-2xl shadow-2xl overflow-y-auto"
            style={{ background: "#ffffff", maxHeight: "90vh" }}>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "#e5e7eb" }}>
              <h2 className="font-extrabold text-lg text-[#1c1c1e]">
                {editId ? "تعديل الاستراتيجية" : "إضافة استراتيجية جديدة"}
              </h2>
              <button onClick={() => setShowForm(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#f3f5f9] transition-colors"
                style={{ color: "#6b7280" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">

              {/* Thumbnail upload */}
              <div className="col-span-2">
                <label className="block text-xs font-bold mb-2" style={{ color: "#6b7280" }}>صورة الغلاف</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-14 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0"
                    style={{ background: "#f3f5f9", border: "2px dashed #e5e7eb" }}>
                    {thumbPreview ? (
                      <img src={thumbPreview} alt="thumb" className="w-full h-full object-cover" />
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                    )}
                  </div>
                  <div>
                    <button type="button" onClick={() => fileRef.current?.click()}
                      disabled={uploading}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold border border-[#e5e7eb] hover:border-[#8957f6]/40 transition-all"
                      style={{ color: "#8957f6" }}>
                      {uploading ? "جارٍ الرفع..." : "رفع صورة"}
                    </button>
                    <p className="text-xs mt-1" style={{ color: "#9ca3af" }}>JPG, PNG, WEBP — حتى 5MB</p>
                    <input ref={fileRef} type="file" accept="image/jpg,image/jpeg,image/png,image/webp"
                      className="hidden" onChange={handleThumbnailChange} />
                  </div>
                </div>
              </div>

              {[
                { key: "brand", label: "اسم العلامة" },
                { key: "brandInitial", label: "الحرف الأول" },
                { key: "sector", label: "القطاع" },
                { key: "date", label: "التاريخ (YYYY-MM-DD)" },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-xs font-bold mb-1" style={{ color: "#6b7280" }}>{label}</label>
                  <input type="text"
                    value={(form as Record<string, unknown>)[key] as string ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border outline-none text-sm text-[#1c1c1e]"
                    style={{ background: "#ffffff", borderColor: "#e5e7eb" }} />
                </div>
              ))}

              {/* Title full width */}
              <div className="col-span-2">
                <label className="block text-xs font-bold mb-1" style={{ color: "#6b7280" }}>عنوان الاستراتيجية</label>
                <input type="text" value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border outline-none text-sm text-[#1c1c1e]"
                  style={{ background: "#ffffff", borderColor: "#e5e7eb" }} />
              </div>

              {/* Preview */}
              <div className="col-span-2">
                <label className="block text-xs font-bold mb-1" style={{ color: "#6b7280" }}>الوصف المختصر</label>
                <textarea rows={3} value={form.preview}
                  onChange={(e) => setForm((f) => ({ ...f, preview: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border outline-none text-sm resize-none text-[#1c1c1e]"
                  style={{ background: "#ffffff", borderColor: "#e5e7eb" }} />
              </div>

              {/* Insights */}
              <div className="col-span-2">
                <label className="block text-xs font-bold mb-1" style={{ color: "#6b7280" }}>
                  الإحصائيات الرئيسية (كل سطر = إحصائية)
                </label>
                <textarea rows={4}
                  value={form.insights.join("\n")}
                  onChange={(e) => setForm((f) => ({ ...f, insights: e.target.value.split("\n").filter(Boolean) }))}
                  className="w-full px-3 py-2 rounded-xl border outline-none text-sm resize-none text-[#1c1c1e] placeholder:text-[#9ca3af]"
                  style={{ background: "#ffffff", borderColor: "#e5e7eb" }}
                  placeholder="مثال: استخدام العد التنازلي رفع التحويل 340%" />
              </div>

              {/* Tags */}
              <div className="col-span-2">
                <label className="block text-xs font-bold mb-1" style={{ color: "#6b7280" }}>
                  التاغات (مفصولة بفاصلة)
                </label>
                <input type="text"
                  value={form.tags.join(", ")}
                  onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) }))}
                  className="w-full px-3 py-2 rounded-xl border outline-none text-sm text-[#1c1c1e] placeholder:text-[#9ca3af]"
                  style={{ background: "#ffffff", borderColor: "#e5e7eb" }}
                  placeholder="رمضان, موسمي, عاطفي" />
              </div>

              {/* is_pro_only toggle */}
              <div className="col-span-2 flex items-center justify-between py-2 rounded-xl px-4 border"
                style={{ background: "#f3f5f9", borderColor: "#e5e7eb" }}>
                <div>
                  <p className="text-sm font-semibold text-[#1c1c1e]">Pro فقط</p>
                  <p className="text-xs" style={{ color: "#9ca3af" }}>إخفاء هذه الاستراتيجية عن المستخدمين المجانيين</p>
                </div>
                <button type="button" onClick={() => setForm((f) => ({ ...f, is_pro_only: !f.is_pro_only }))}
                  className="w-12 h-6 rounded-full transition-all relative flex-shrink-0"
                  style={{ background: form.is_pro_only ? "#8957f6" : "#d1d5db" }}>
                  <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all"
                    style={{ right: form.is_pro_only ? "2px" : "auto", left: form.is_pro_only ? "auto" : "2px" }} />
                </button>
              </div>

              <div className="col-span-2 flex gap-3 pt-2">
                <button onClick={handleSave}
                  className="flex-1 py-2.5 rounded-xl font-bold text-sm transition-all hover:opacity-90"
                  style={{ background: "#84cc18", color: "#fff" }}>
                  {editId ? "حفظ التعديلات" : "إضافة الاستراتيجية"}
                </button>
                <button onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 rounded-xl font-bold text-sm border"
                  style={{ borderColor: "#e5e7eb", color: "#6b7280" }}>
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
