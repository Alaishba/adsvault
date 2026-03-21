"use client";

import { useState, useRef, useEffect } from "react";
import { mockAds, type Ad } from "../../lib/mockData";
import { uploadFile } from "../../lib/storage";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { fetchAds } from "../../lib/db";

const platforms = ["Meta", "TikTok", "Snap", "YouTube", "Instagram"];
const sectors = ["تجزئة", "اتصالات", "تجارة إلكترونية", "مواد استهلاكية", "خدمات مالية", "مطاعم", "عقارات", "تعليم"];
const countries = ["السعودية", "الإمارات", "الكويت", "مصر", "قطر", "البحرين", "الأردن", "المغرب"];
const seasons = ["عام", "رمضان", "صيف", "شتاء", "عيد", "العودة للمدرسة", "بلاك فرايدي"];
const adGoals = ["تعزيز الوعي", "زيادة المبيعات", "تحويل مباشر", "بناء العلامة", "استقطاب عملاء"];
const funnelOptions = [
  { value: "awareness", label: "وعي" },
  { value: "interest", label: "اهتمام" },
  { value: "conversion", label: "تحويل" },
];

type ProAnalysis = {
  hook: string;
  creative_message: string;
  targeting_strategy: string;
  creative_strengths: string[];
  apply_opportunities: string[];
  analysis_images: string[];
  video_url: string;
  attachments: string[];
  rating: number;
  metrics: { ctr: string; conversion: string; reach: string };
};

const emptyProAnalysis: ProAnalysis = {
  hook: "", creative_message: "", targeting_strategy: "",
  creative_strengths: [], apply_opportunities: [],
  analysis_images: [], video_url: "", attachments: [],
  rating: 0, metrics: { ctr: "", conversion: "", reach: "" },
};

type FormAd = Partial<Ad> & { is_pro_only?: boolean; pro_analysis?: ProAnalysis };

const emptyForm: FormAd = {
  brand: "", brandInitial: "", brandColor: "#84cc18", title: "", description: "",
  platform: "Meta", sector: "", country: "", season: "", ad_goal: "", funnel_stage: "awareness",
  tags: [], source_url: "", basic_analysis: [], apply_idea: [], recommended_action: "",
  is_pro_only: false, pro_analysis: { ...emptyProAnalysis },
};

/* ─── Star Rating ─── */
function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button" onClick={() => onChange(star)}
          className="text-xl transition-all hover:scale-110"
          style={{ color: star <= value ? "#eab308" : "#d1d5db" }}>
          ★
        </button>
      ))}
    </div>
  );
}

/* ─── Dynamic List ─── */
function DynamicList({ items, onChange, placeholder }: { items: string[]; onChange: (v: string[]) => void; placeholder: string }) {
  const [input, setInput] = useState("");
  const add = () => { if (input.trim()) { onChange([...items, input.trim()]); setInput(""); } };
  return (
    <div>
      <div className="flex gap-2 mb-2">
        <input value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 rounded-xl border border-[#e5e7eb] bg-white outline-none text-sm text-[#1c1c1e]" />
        <button type="button" onClick={add}
          className="px-3 py-2 rounded-xl text-xs font-bold border border-[#e5e7eb] text-[#84cc18] hover:border-[#84cc18]/40 transition-all">+</button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium"
            style={{ background: "#f3f5f9", color: "#6b7280" }}>
            <span className="text-[10px] font-bold" style={{ color: "#84cc18" }}>{i + 1}.</span>
            {item}
            <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="text-red-400 hover:text-red-500 ml-1">×</button>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function AdminAdsPage() {
  const [ads, setAds] = useState<Ad[]>(mockAds);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormAd>(emptyForm);
  const [search, setSearch] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const analysisImgRef = useRef<HTMLInputElement>(null);
  const attachRef = useRef<HTMLInputElement>(null);

  const pro = form.pro_analysis ?? emptyProAnalysis;
  const setPro = (update: Partial<ProAnalysis>) =>
    setForm((f) => ({ ...f, pro_analysis: { ...(f.pro_analysis ?? emptyProAnalysis), ...update } }));

  // Load from Supabase on mount
  useEffect(() => { fetchAds().then(setAds); }, []);

  const reload = () => fetchAds().then(setAds);

  const filtered = ads.filter((a) =>
    a.title.includes(search) || a.brand.includes(search) || a.sector.includes(search)
  );

  const openAdd = () => { setForm(emptyForm); setEditId(null); setImageFiles([]); setImagePreviews([]); setShowForm(true); };
  const openEdit = (ad: Ad) => { setForm({ ...ad, is_pro_only: false, pro_analysis: { ...emptyProAnalysis } }); setEditId(ad.id); setImageFiles([]); setImagePreviews(ad.images ?? []); setShowForm(true); };
  const handleDelete = async (id: string) => {
    if (isSupabaseConfigured()) {
      await supabase.from("ads").delete().eq("id", id);
    }
    setAds((prev) => prev.filter((a) => a.id !== id));
  };

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 5);
    setImageFiles(files);
    const readers = files.map((f) => new Promise<string>((res) => { const r = new FileReader(); r.onload = () => res(r.result as string); r.readAsDataURL(f); }));
    Promise.all(readers).then(setImagePreviews);
  };

  const handleAnalysisImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 3);
    for (const file of files) {
      const { url } = await uploadFile("ads-images", file, `analysis-${Date.now()}`);
      if (url) setPro({ analysis_images: [...pro.analysis_images, url] });
    }
  };

  const handleAttachments = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 2);
    for (const file of files) {
      const { url } = await uploadFile("ads-images", file, `attach-${Date.now()}`);
      if (url) setPro({ attachments: [...pro.attachments, url] });
    }
  };

  const handleSave = async () => {
    if (!form.title || !form.brand) return;
    setUploading(true);
    try {
      let images = form.images ?? [];
      if (imageFiles.length > 0) {
        const uploads = await Promise.all(imageFiles.map((f) => uploadFile("ads-images", f)));
        images = uploads.filter((u) => u.url).map((u) => u.url as string);
      }
      const adData = {
        title: form.title, brand: form.brand,
        brand_initial: form.brandInitial || form.brand?.[0] || "?",
        brand_color: form.brandColor || "#84cc18",
        description: form.description || "", platform: form.platform || "Meta",
        sector: form.sector || "", country: form.country || "",
        season: form.season || "", ad_goal: form.ad_goal || "",
        funnel_stage: form.funnel_stage || "awareness",
        tags: form.tags ?? [], images,
        source_url: form.source_url || "", video_url: (form as Record<string, unknown>).video_url as string || "",
        basic_analysis: form.basic_analysis ?? [],
        apply_idea: form.apply_idea ?? [],
        recommended_action: form.recommended_action || "",
        is_pro_only: form.is_pro_only ?? false,
      };

      if (isSupabaseConfigured()) {
        if (editId) {
          await supabase.from("ads").update(adData).eq("id", editId);
        } else {
          await supabase.from("ads").insert(adData);
        }
        await reload();
      } else {
        // Local fallback
        if (editId) {
          setAds((prev) => prev.map((a) => (a.id === editId ? { ...a, ...form, images } as Ad : a)));
        } else {
          const newAd = { ...emptyForm, ...form, images, id: Date.now().toString(), views: "0", saved: 0, tags: form.tags ?? [], basic_analysis: form.basic_analysis ?? [], apply_idea: form.apply_idea ?? [] } as Ad;
          setAds((prev) => [newAd, ...prev]);
        }
      }
    } catch (err) {
      console.error("Save error:", err);
    }
    setUploading(false);
    setShowForm(false);
    setEditId(null);
  };

  const inputCls = "w-full px-3 py-2 rounded-xl border border-[#e5e7eb] bg-white outline-none text-sm text-[#1c1c1e] focus:border-[#84cc18]/60 transition-colors";
  const labelCls = "block text-xs font-bold mb-1 text-[#6b7280]";

  return (
    <div className="px-6 lg:px-10 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1c1c1e]">الإعلانات</h1>
          <p className="text-sm mt-0.5" style={{ color: "#6b7280" }}>{filtered.length} إعلان</p>
        </div>
        <button onClick={openAdd}
          className="px-4 py-2 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
          style={{ background: "#84cc18" }}>+ إضافة إعلان</button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-[#e5e7eb] mb-5" style={{ background: "#ffffff" }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ابحث عن إعلان..."
          className="bg-transparent outline-none w-full text-sm text-[#1c1c1e]" dir="rtl" />
      </div>

      {/* Table */}
      <div className="rounded-2xl border overflow-hidden" style={{ background: "#ffffff", borderColor: "#e5e7eb" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "#f3f5f9" }}>
                {["العلامة", "العنوان", "القطاع", "المنصة", "البلد", "Pro فقط", "الإجراءات"].map((h) => (
                  <th key={h} className="text-right px-5 py-3 text-xs font-bold uppercase tracking-wider" style={{ color: "#6b7280" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "#e5e7eb" }}>
              {filtered.map((ad) => (
                <tr key={ad.id} className="hover:bg-[#f3f5f9] transition-colors">
                  <td className="px-5 py-3 font-bold" style={{ color: "#8957f6" }}>{ad.brand}</td>
                  <td className="px-5 py-3 max-w-[200px] truncate text-[#1c1c1e]">{ad.title}</td>
                  <td className="px-5 py-3" style={{ color: "#6b7280" }}>{ad.sector}</td>
                  <td className="px-5 py-3" style={{ color: "#6b7280" }}>{ad.platform}</td>
                  <td className="px-5 py-3" style={{ color: "#6b7280" }}>{ad.country}</td>
                  <td className="px-5 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: "#f3eeff", color: "#8957f6" }}>Pro</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(ad)} className="text-xs px-2.5 py-1 rounded-lg font-medium border border-[#e5e7eb] hover:border-[#8957f6]/40 transition-all" style={{ color: "#6b7280" }}>تعديل</button>
                      <button onClick={() => handleDelete(ad.id)} className="text-xs px-2.5 py-1 rounded-lg font-medium border transition-all" style={{ borderColor: "#fecaca", color: "#ef4444" }}>حذف</button>
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
          <div className="w-full max-w-3xl rounded-2xl shadow-2xl overflow-y-auto"
            style={{ maxHeight: "92vh", background: "#ffffff", border: "1px solid #e5e7eb" }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e7eb]">
              <h2 className="font-extrabold text-lg text-[#1c1c1e]">{editId ? "تعديل الإعلان" : "إضافة إعلان جديد"}</h2>
              <button onClick={() => setShowForm(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#f3f5f9]" style={{ color: "#6b7280" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* ─── BASIC FIELDS ─── */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: "brand", label: "اسم البراند" },
                  { key: "brandInitial", label: "الحرف الأول" },
                  { key: "title", label: "عنوان الإعلان" },
                  { key: "source_url", label: "رابط المصدر", type: "url" },
                ].map(({ key, label, type }) => (
                  <div key={key}>
                    <label className={labelCls}>{label}</label>
                    <input type={type ?? "text"}
                      value={(form as Record<string, unknown>)[key] as string ?? ""}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                      className={inputCls} />
                  </div>
                ))}
                {[
                  { key: "platform", label: "المنصة", options: platforms },
                  { key: "sector", label: "القطاع", options: sectors },
                  { key: "country", label: "البلد", options: countries },
                  { key: "season", label: "الموسم", options: seasons },
                  { key: "ad_goal", label: "هدف الإعلان", options: adGoals },
                ].map(({ key, label, options }) => (
                  <div key={key}>
                    <label className={labelCls}>{label}</label>
                    <select value={(form as Record<string, unknown>)[key] as string ?? ""}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                      className={inputCls}>
                      <option value="">اختر...</option>
                      {options.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>

              {/* Funnel */}
              <div>
                <label className={labelCls}>مرحلة القمع</label>
                <div className="flex gap-3">
                  {funnelOptions.map((f) => (
                    <label key={f.value} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="funnel" value={f.value}
                        checked={form.funnel_stage === f.value}
                        onChange={() => setForm((prev) => ({ ...prev, funnel_stage: f.value as Ad["funnel_stage"] }))}
                        className="accent-[#84cc18]" />
                      <span className="text-sm text-[#1c1c1e]">{f.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className={labelCls}>التاقات (مفصولة بفاصلة)</label>
                <input type="text"
                  value={Array.isArray(form.tags) ? form.tags.join(", ") : ""}
                  onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) }))}
                  className={inputCls} placeholder="رمضان, موسمي, عاطفي" />
              </div>

              {/* Description */}
              <div>
                <label className={labelCls}>الوصف</label>
                <textarea rows={3} value={form.description ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className={`${inputCls} resize-none`} />
              </div>

              {/* Image upload */}
              <div>
                <label className={labelCls}>رفع الصور (حتى 5 صور)</label>
                <div className="border border-dashed border-[#e5e7eb] rounded-xl p-4">
                  <button type="button" onClick={() => fileRef.current?.click()}
                    className="text-xs px-3 py-1.5 rounded-lg border border-[#e5e7eb] text-[#6b7280] hover:border-[#84cc18]/40 transition-all mb-3">اختر الصور</button>
                  <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={handleImages} />
                  {imagePreviews.length > 0 && (
                    <div className="flex gap-2 flex-wrap mt-2">
                      {imagePreviews.map((src, i) => (
                        <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-[#e5e7eb]">
                          {src.startsWith("data:") || src.startsWith("http") || src.startsWith("blob:") ? (
                            <img src={src} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full" style={{ background: src }} />
                          )}
                          <button type="button" onClick={() => { setImagePreviews((p) => p.filter((_, j) => j !== i)); setImageFiles((f) => f.filter((_, j) => j !== i)); }}
                            className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/60 flex items-center justify-center text-white text-xs">×</button>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-xs mt-2" style={{ color: "#9ca3af" }}>JPG, PNG, WebP — 5MB كحد أقصى</p>
                </div>
              </div>

              {/* Video URL */}
              <div>
                <label className={labelCls}>رابط الفيديو (اختياري)</label>
                <input type="url" value={(form as Record<string, string>).video_url ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, video_url: e.target.value }))}
                  className={inputCls} placeholder="https://..." />
              </div>

              {/* Basic analysis */}
              <div>
                <label className={labelCls}>التحليل الأساسي — Basic <span style={{ color: "#9ca3af" }}>(كل سطر = نقطة)</span></label>
                <textarea rows={4}
                  value={Array.isArray(form.basic_analysis) ? form.basic_analysis.join("\n") : ""}
                  onChange={(e) => setForm((f) => ({ ...f, basic_analysis: e.target.value.split("\n").filter(Boolean) }))}
                  className={`${inputCls} resize-none`} />
              </div>

              {/* ─── PRO ANALYSIS SECTION ─── */}
              <div className="rounded-xl border border-[#8957f6]/30 p-4 space-y-4" style={{ background: "#f3eeff" }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-black" style={{ color: "#8957f6" }}>🔒 التحليل المتقدم — Pro</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold" style={{ background: "#8957f6", color: "#fff" }}>Pro</span>
                </div>

                {/* 1. الخطاف الرئيسي */}
                <div>
                  <label className={labelCls}>الخطاف الرئيسي 🎣</label>
                  <input type="text" value={pro.hook}
                    onChange={(e) => setPro({ hook: e.target.value })}
                    className={inputCls} placeholder="مثال: عرض محدود — خلال 24 ساعة فقط" />
                </div>

                {/* 2. تحليل الرسالة الإبداعية */}
                <div>
                  <label className={labelCls}>تحليل الرسالة الإبداعية 🎨</label>
                  <textarea rows={3} value={pro.creative_message}
                    onChange={(e) => setPro({ creative_message: e.target.value })}
                    className={`${inputCls} resize-none`} />
                </div>

                {/* 3. استراتيجية الاستهداف */}
                <div>
                  <label className={labelCls}>استراتيجية الاستهداف 🎯</label>
                  <textarea rows={3} value={pro.targeting_strategy}
                    onChange={(e) => setPro({ targeting_strategy: e.target.value })}
                    className={`${inputCls} resize-none`} />
                </div>

                {/* 4. نقاط القوة الإبداعية */}
                <div>
                  <label className={labelCls}>نقاط القوة الإبداعية ✨</label>
                  <DynamicList items={pro.creative_strengths}
                    onChange={(v) => setPro({ creative_strengths: v })}
                    placeholder="أضف نقطة قوة..." />
                </div>

                {/* 5. فرص التطبيق */}
                <div>
                  <label className={labelCls}>فرص التطبيق 💡</label>
                  <DynamicList items={pro.apply_opportunities}
                    onChange={(v) => setPro({ apply_opportunities: v })}
                    placeholder="أضف فرصة تطبيق..." />
                </div>

                {/* 6. صور التحليل */}
                <div>
                  <label className={labelCls}>صور التحليل (حتى 3)</label>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => analysisImgRef.current?.click()}
                      className="text-xs px-3 py-1.5 rounded-lg border border-[#e5e7eb] text-[#8957f6] hover:border-[#8957f6]/40 transition-all">رفع صورة</button>
                    <input ref={analysisImgRef} type="file" accept="image/*" multiple className="hidden" onChange={handleAnalysisImages} />
                    <div className="flex gap-2">
                      {pro.analysis_images.map((src, i) => (
                        <div key={i} className="relative w-12 h-12 rounded-lg overflow-hidden border border-[#e5e7eb]">
                          <img src={src} alt="" className="w-full h-full object-cover" />
                          <button type="button" onClick={() => setPro({ analysis_images: pro.analysis_images.filter((_, j) => j !== i) })}
                            className="absolute top-0 right-0 w-4 h-4 rounded-full bg-black/60 flex items-center justify-center text-white text-[10px]">×</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 7. فيديو شرح التحليل */}
                <div>
                  <label className={labelCls}>فيديو شرح التحليل 🎥</label>
                  <input type="url" value={pro.video_url}
                    onChange={(e) => setPro({ video_url: e.target.value })}
                    className={inputCls} placeholder="https://youtube.com/..." />
                </div>

                {/* 8. ملفات مرفقة */}
                <div>
                  <label className={labelCls}>ملفات مرفقة (PDF/DOC — حتى 2)</label>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => attachRef.current?.click()}
                      className="text-xs px-3 py-1.5 rounded-lg border border-[#e5e7eb] text-[#8957f6] hover:border-[#8957f6]/40 transition-all">رفع ملف</button>
                    <input ref={attachRef} type="file" accept=".pdf,.doc,.docx" multiple className="hidden" onChange={handleAttachments} />
                    <div className="flex gap-2">
                      {pro.attachments.map((url, i) => (
                        <span key={i} className="text-xs px-2 py-1 rounded-lg" style={{ background: "#f3f5f9", color: "#6b7280" }}>
                          📄 ملف {i + 1}
                          <button type="button" onClick={() => setPro({ attachments: pro.attachments.filter((_, j) => j !== i) })}
                            className="text-red-400 mr-1">×</button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 9. تقييم الإعلان */}
                <div>
                  <label className={labelCls}>تقييم الإعلان ⭐</label>
                  <StarRating value={pro.rating} onChange={(v) => setPro({ rating: v })} />
                </div>

                {/* 10. مؤشرات الأداء المتوقعة */}
                <div>
                  <label className={labelCls}>مؤشرات الأداء المتوقعة 📊</label>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <span className="text-[10px] font-bold text-[#9ca3af]">CTR %</span>
                      <input type="text" value={pro.metrics.ctr}
                        onChange={(e) => setPro({ metrics: { ...pro.metrics, ctr: e.target.value } })}
                        className={inputCls} placeholder="2.5%" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#9ca3af]">Conversion %</span>
                      <input type="text" value={pro.metrics.conversion}
                        onChange={(e) => setPro({ metrics: { ...pro.metrics, conversion: e.target.value } })}
                        className={inputCls} placeholder="1.2%" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#9ca3af]">Reach</span>
                      <input type="text" value={pro.metrics.reach}
                        onChange={(e) => setPro({ metrics: { ...pro.metrics, reach: e.target.value } })}
                        className={inputCls} placeholder="50,000" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Legacy Pro fields */}
              <div>
                <label className={labelCls}>خطوات التطبيق (كل سطر = خطوة)</label>
                <textarea rows={3}
                  value={Array.isArray(form.apply_idea) ? form.apply_idea.join("\n") : ""}
                  onChange={(e) => setForm((f) => ({ ...f, apply_idea: e.target.value.split("\n").filter(Boolean) }))}
                  className={`${inputCls} resize-none`} />
              </div>
              <div>
                <label className={labelCls}>الإجراء الموصى به</label>
                <input type="text" value={form.recommended_action ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, recommended_action: e.target.value }))}
                  className={inputCls} />
              </div>

              {/* is_pro_only */}
              <div className="flex items-center gap-3 py-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={!!form.is_pro_only}
                    onChange={(e) => setForm((f) => ({ ...f, is_pro_only: e.target.checked }))}
                    className="w-4 h-4 rounded accent-[#8957f6]" />
                  <span className="text-sm text-[#1c1c1e]">إعلان Pro فقط</span>
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} disabled={uploading}
                  className="flex-1 py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 disabled:opacity-60"
                  style={{ background: "#84cc18" }}>
                  {uploading ? "جارٍ الرفع..." : editId ? "حفظ التعديلات" : "إضافة الإعلان"}
                </button>
                <button onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 rounded-xl font-bold text-sm border border-[#e5e7eb]" style={{ color: "#6b7280" }}>
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
