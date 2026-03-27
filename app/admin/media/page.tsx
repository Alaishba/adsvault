"use client";

import { useState, useEffect, useRef } from "react";
import { uploadAdminFile, savePromoBanner, fetchPromoBanners } from "../../actions/adminActions";

const sections = [
  { key: "ads", label: "بانر الإعلانات" },
  { key: "strategies", label: "بانر الاستراتيجيات" },
  { key: "influencers", label: "بانر المؤثرين" },
  { key: "blog", label: "بانر المدونة" },
];

export default function AdminMediaPage() {
  const [banners, setBanners] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    fetchPromoBanners().then(setBanners);
  }, []);

  const handleUpload = async (sectionKey: string, file: File) => {
    setUploading(sectionKey);
    setMessage(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", "ads-images");
      formData.append("path", `promo/${sectionKey}-${Date.now()}`);
      const result = await uploadAdminFile(formData);
      if (result.error || !result.url) {
        setMessage(`خطأ: ${result.error ?? "فشل الرفع"}`);
      } else {
        const saveResult = await savePromoBanner(sectionKey, result.url);
        if ("error" in saveResult) {
          setMessage(`خطأ في الحفظ: ${saveResult.error}`);
        } else {
          setBanners((prev) => ({ ...prev, [sectionKey]: result.url! }));
          setMessage("تم الرفع بنجاح");
        }
      }
    } catch {
      setMessage("حدث خطأ غير متوقع");
    }
    setUploading(null);
  };

  return (
    <div className="px-6 lg:px-10 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">إدارة الوسائط</h1>
        <p className="text-sm mt-1 text-gray-600">ارفع صور البانر الإعلاني لكل قسم</p>
      </div>

      {message && (
        <div className="mb-4 px-4 py-2 rounded-xl text-sm font-semibold bg-blue-50 border border-blue-100 text-blue-700">
          {message}
        </div>
      )}

      {/* Banner upload sections */}
      <div className="space-y-4 mb-8">
        <h2 className="text-lg font-bold text-gray-900">صور البانر الإعلاني</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sections.map((s) => (
            <div key={s.key} className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <p className="text-sm font-bold text-gray-900 mb-3">{s.label}</p>
              {banners[s.key] ? (
                <img src={banners[s.key]} alt={s.label} className="w-full h-32 object-cover rounded-lg mb-3" />
              ) : (
                <div className="w-full h-32 bg-blue-100/50 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-xs text-gray-500">لا توجد صورة</span>
                </div>
              )}
              <input type="file" accept="image/*" ref={(el) => { fileRefs.current[s.key] = el; }} className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(s.key, f); }} />
              <button onClick={() => fileRefs.current[s.key]?.click()}
                disabled={uploading === s.key}
                className="w-full py-2 rounded-xl text-sm font-bold text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-60 transition-all">
                {uploading === s.key ? "جارٍ الرفع..." : "رفع صورة"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Hero images section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900">صور الهيرو</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Hero laptop image */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-sm font-bold text-gray-900 mb-3">صورة اللابتوب في الهيرو</p>
            {banners["hero_laptop"] ? (
              <img src={banners["hero_laptop"]} alt="Hero laptop" className="w-full h-32 object-cover rounded-lg mb-3" />
            ) : (
              <div className="w-full h-32 bg-blue-100/50 rounded-lg flex items-center justify-center mb-3">
                <span className="text-xs text-gray-500">لا توجد صورة</span>
              </div>
            )}
            <input type="file" accept="image/*" ref={(el) => { fileRefs.current["hero_laptop"] = el; }} className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload("hero_laptop", f); }} />
            <button onClick={() => fileRefs.current["hero_laptop"]?.click()}
              disabled={uploading === "hero_laptop"}
              className="w-full py-2 rounded-xl text-sm font-bold text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-60 transition-all">
              {uploading === "hero_laptop" ? "جارٍ الرفع..." : "رفع صورة"}
            </button>
          </div>
          {/* Hero banner bg */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-sm font-bold text-gray-900 mb-3">صورة البانر الرئيسي</p>
            {banners["hero_banner"] ? (
              <img src={banners["hero_banner"]} alt="Hero banner" className="w-full h-32 object-cover rounded-lg mb-3" />
            ) : (
              <div className="w-full h-32 bg-blue-100/50 rounded-lg flex items-center justify-center mb-3">
                <span className="text-xs text-gray-500">لا توجد صورة</span>
              </div>
            )}
            <input type="file" accept="image/*" ref={(el) => { fileRefs.current["hero_banner"] = el; }} className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload("hero_banner", f); }} />
            <button onClick={() => fileRefs.current["hero_banner"]?.click()}
              disabled={uploading === "hero_banner"}
              className="w-full py-2 rounded-xl text-sm font-bold text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-60 transition-all">
              {uploading === "hero_banner" ? "جارٍ الرفع..." : "رفع صورة"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
