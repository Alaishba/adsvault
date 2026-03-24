"use client";

import { useState, useRef, useEffect } from "react";
import { type Influencer, type Platform } from "../../lib/mockData";
import { uploadFile } from "../../lib/storage";
import { getImageUrl } from "../../lib/imageUrl";
import { saveAdminInfluencer, deleteAdminInfluencer, fetchAdminInfluencers } from "../../actions/adminActions";

const emptyForm = {
  name: "", bio: "", category: "", country: "",
  followers: "", engagement: "",
  platforms: [] as Platform[],
  strengths: [] as string[],
  weaknesses: [] as string[],
  contactEmail: "",
  profileImage: "",
  initial: "", color: "#8957f6",
};

const allPlatforms: Platform[] = ["Meta", "TikTok", "Snap", "YouTube", "Instagram"];

export default function AdminInfluencersPage() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = (influencers ?? []).filter(
    (i) => (i.name ?? "").includes(search) || (i.category ?? "").includes(search) || (i.country ?? "").includes(search)
  );

  const openAdd = () => {
    setForm(emptyForm);
    setEditId(null);
    setImagePreview(null);
    setShowForm(true);
  };

  const openEdit = (inf: Influencer) => {
    setForm({
      name: inf.name ?? "", bio: inf.bio ?? "",
      category: inf.category ?? "", country: inf.country ?? "",
      followers: inf.followers ?? "", engagement: inf.engagement ?? "",
      platforms: inf.platforms ?? [],
      strengths: inf.strengths ?? [],
      weaknesses: inf.weaknesses ?? [],
      contactEmail: (inf as unknown as Record<string, string>).contactEmail ?? "",
      profileImage: (inf as unknown as Record<string, string>).profileImage ?? "",
      initial: inf.initial ?? (inf.name ?? "?")[0], color: inf.color ?? "#8957f6",
    });
    setImagePreview((inf as unknown as Record<string, string>).profileImage ?? null);
    setEditId(inf.id);
    setShowForm(true);
  };

  // Load from Supabase on mount
  useEffect(() => { fetchAdminInfluencers().then((d) => setInfluencers(d as Influencer[])); }, []);
  const reload = () => fetchAdminInfluencers().then((d) => setInfluencers(d as Influencer[]));

  const handleDelete = async (id: string) => {
    const result = await deleteAdminInfluencer(id);
    if ("error" in result) { window.alert("خطأ في الحذف: " + result.error); return; }
    setInfluencers((prev) => prev.filter((i) => i.id !== id));
  };

  const togglePlatform = (p: Platform) => {
    setForm((f) => ({
      ...f,
      platforms: f.platforms.includes(p)
        ? f.platforms.filter((x) => x !== p)
        : [...f.platforms, p],
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { url } = await uploadFile("influencer-photos", file, `influencer-${Date.now()}`);
    if (url) {
      setImagePreview(url);
      setForm((f) => ({ ...f, profileImage: url }));
    }
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.name) return;
    const infData = {
      name: form.name, bio: form.bio,
      platform: form.platforms.join(","),
      follower_count: form.followers,
      engagement_rate: form.engagement,
      strengths: form.strengths,
      weaknesses: form.weaknesses,
      profile_image: form.profileImage || null,
      contact_email: form.contactEmail || null,
    };

    try {
      const result = await saveAdminInfluencer(infData, editId);
      if ("error" in result) { console.error("Save error:", result.error); }
      await reload();
    } catch (err) { console.error("Save error:", err); }
    setShowForm(false);
    setEditId(null);
  };

  return (
    <div className="px-6 lg:px-10 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1c1c1e]">المؤثرون</h1>
          <p className="text-sm mt-0.5" style={{ color: "#6b7280" }}>{filtered.length} مؤثر</p>
        </div>
        <button onClick={openAdd}
          className="px-4 py-2 rounded-xl text-sm font-bold transition-all hover:opacity-90"
          style={{ background: "#84cc18", color: "#fff" }}>
          + إضافة مؤثر
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border mb-5"
        style={{ background: "#ffffff", borderColor: "#e5e7eb" }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث عن مؤثر..."
          className="bg-transparent outline-none w-full text-sm text-[#1c1c1e] placeholder:text-[#9ca3af]" dir="rtl" />
      </div>

      {/* Table */}
      <div className="rounded-2xl border overflow-hidden" style={{ background: "#ffffff", borderColor: "#e5e7eb" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "#f3f5f9" }}>
                {["المؤثر", "التصنيف", "المنصات", "المتابعون", "التفاعل", "البلد", "الإجراءات"].map((h) => (
                  <th key={h} className="text-right px-5 py-3 text-xs font-bold uppercase tracking-wider"
                    style={{ color: "#6b7280" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "#e5e7eb" }}>
              {filtered.map((inf) => (
                <tr key={inf.id} className="hover:bg-[#f3f5f9] transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      {((inf as unknown as Record<string, string>).profile_image || (inf as unknown as Record<string, string>).profileImage) ? (
                        <img src={getImageUrl("influencer-photos", (inf as unknown as Record<string, string>).profile_image || (inf as unknown as Record<string, string>).profileImage)}
                          alt={inf.name ?? ""}
                          className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                          style={{ background: inf.color ?? "#8957f6" }}>{inf.initial ?? (inf.name ?? "?")[0]}</div>
                      )}
                      <span className="font-semibold text-[#1c1c1e]">{inf.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3" style={{ color: "#6b7280" }}>{inf.category ?? "—"}</td>
                  <td className="px-5 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {(inf.platforms ?? []).map((p) => (
                        <span key={p} className="px-1.5 py-0.5 rounded text-xs font-medium"
                          style={{ background: "#f3f5f9", color: "#6b7280" }}>{p}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3 font-bold text-[#1c1c1e]">{inf.followers}</td>
                  <td className="px-5 py-3" style={{ color: "#84cc18" }}>{inf.engagement}</td>
                  <td className="px-5 py-3" style={{ color: "#6b7280" }}>{inf.country ?? "—"}</td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(inf)}
                        className="text-xs px-2.5 py-1 rounded-lg font-medium border border-[#e5e7eb] hover:border-[#8957f6]/40 transition-all"
                        style={{ color: "#6b7280" }}>تعديل</button>
                      <button onClick={() => handleDelete(inf.id)}
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
                {editId ? "تعديل المؤثر" : "إضافة مؤثر جديد"}
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

              {/* Profile image upload */}
              <div className="col-span-2">
                <label className="block text-xs font-bold mb-2" style={{ color: "#6b7280" }}>صورة الملف الشخصي</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0"
                    style={{ background: "#f3f5f9", border: "2px dashed #e5e7eb" }}>
                    {imagePreview ? (
                      <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
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
                      className="hidden" onChange={handleImageChange} />
                  </div>
                </div>
              </div>

              {[
                { key: "name", label: "اسم المؤثر" },
                { key: "initial", label: "الحرف الأول" },
                { key: "category", label: "التصنيف" },
                { key: "country", label: "البلد" },
                { key: "followers", label: "المتابعون" },
                { key: "engagement", label: "معدل التفاعل (%)" },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-xs font-bold mb-1" style={{ color: "#6b7280" }}>{label}</label>
                  <input type="text"
                    value={(form as Record<string, unknown>)[key] as string ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border outline-none text-sm text-[#1c1c1e] placeholder:text-[#9ca3af]"
                    style={{ background: "#ffffff", borderColor: "#e5e7eb" }} />
                </div>
              ))}

              {/* Contact Email */}
              <div className="col-span-2">
                <label className="block text-xs font-bold mb-1" style={{ color: "#6b7280" }}>بريد التواصل</label>
                <input type="email" value={form.contactEmail}
                  onChange={(e) => setForm((f) => ({ ...f, contactEmail: e.target.value }))}
                  placeholder="influencer@example.com"
                  className="w-full px-3 py-2 rounded-xl border outline-none text-sm text-[#1c1c1e] placeholder:text-[#9ca3af]"
                  style={{ background: "#ffffff", borderColor: "#e5e7eb" }} dir="ltr" />
              </div>

              {/* Platforms */}
              <div className="col-span-2">
                <label className="block text-xs font-bold mb-2" style={{ color: "#6b7280" }}>المنصات</label>
                <div className="flex gap-2 flex-wrap">
                  {allPlatforms.map((p) => (
                    <button key={p} type="button" onClick={() => togglePlatform(p)}
                      className="px-3 py-1 rounded-lg text-xs font-medium border transition-all"
                      style={{
                        background: form.platforms.includes(p) ? "#8957f6" : "#ffffff",
                        color: form.platforms.includes(p) ? "#fff" : "#6b7280",
                        borderColor: form.platforms.includes(p) ? "#8957f6" : "#e5e7eb",
                      }}>{p}</button>
                  ))}
                </div>
              </div>

              {/* Bio */}
              <div className="col-span-2">
                <label className="block text-xs font-bold mb-1" style={{ color: "#6b7280" }}>النبذة</label>
                <textarea rows={3} value={form.bio}
                  onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border outline-none text-sm resize-none text-[#1c1c1e]"
                  style={{ background: "#ffffff", borderColor: "#e5e7eb" }} />
              </div>

              {/* Strengths */}
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: "#6b7280" }}>نقاط القوة (فاصلة)</label>
                <input type="text"
                  value={form.strengths.join(", ")}
                  onChange={(e) => setForm((f) => ({ ...f, strengths: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) }))}
                  className="w-full px-3 py-2 rounded-xl border outline-none text-sm text-[#1c1c1e] placeholder:text-[#9ca3af]"
                  style={{ background: "#ffffff", borderColor: "#e5e7eb" }} />
              </div>

              {/* Weaknesses */}
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: "#6b7280" }}>نقاط الضعف (فاصلة)</label>
                <input type="text"
                  value={form.weaknesses.join(", ")}
                  onChange={(e) => setForm((f) => ({ ...f, weaknesses: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) }))}
                  className="w-full px-3 py-2 rounded-xl border outline-none text-sm text-[#1c1c1e] placeholder:text-[#9ca3af]"
                  style={{ background: "#ffffff", borderColor: "#e5e7eb" }} />
              </div>

              <div className="col-span-2 flex gap-3 pt-2">
                <button onClick={handleSave}
                  className="flex-1 py-2.5 rounded-xl font-bold text-sm transition-all hover:opacity-90"
                  style={{ background: "#84cc18", color: "#fff" }}>
                  {editId ? "حفظ التعديلات" : "إضافة المؤثر"}
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
