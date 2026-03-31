"use client";

import { useState, useRef, useEffect, type ChangeEvent } from "react";
import { saveAdminBlogPost, deleteAdminBlogPost, fetchAdminBlogPosts } from "../../actions/adminActions";
import { uploadViaSignedUrl } from "../../lib/uploadViaSignedUrl";

interface AdminArticle {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  coverImage: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
  content: string;
  status: "published" | "draft";
}

const initialArticles: AdminArticle[] = [];

const categoryOptions = ["تسويق", "إعلانات", "استراتيجية", "تقنية"];

const emptyForm = {
  title: "",
  category: "تسويق",
  coverImage: "",
  content: "",
  tags: "",
  status: "published" as "published" | "draft",
  featured: false,
};

export default function AdminBlogPage() {
  const [articles, setArticles] = useState<AdminArticle[]>(initialArticles);

  const mapPosts = (data: Record<string, unknown>[]) =>
    data.map((d) => ({
      id: d.id as number, slug: (d.slug as string) ?? "", title: (d.title as string) ?? "",
      excerpt: ((d.content as string) ?? "").slice(0, 120),
      category: (d.category as string) ?? "", coverImage: (d.banner_image as string) ?? "#3b82f6",
      author: (d.author as string) ?? "مدير المحتوى",
      date: ((d.created_at as string) ?? "").slice(0, 10),
      readTime: "5 دقائق", tags: (d.tags as string[]) ?? [],
      content: (d.content as string) ?? "", status: (d.status as "published" | "draft") ?? "draft",
    }));

  useEffect(() => {
    fetchAdminBlogPosts().then((d) => { if (d.length > 0) setArticles(mapPosts(d as Record<string, unknown>[])); });
  }, []);
  const reloadBlog = () => {
    fetchAdminBlogPosts().then((d) => { if (d.length > 0) setArticles(mapPosts(d as Record<string, unknown>[])); });
  };

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const generateSlug = (title: string) =>
    title.trim().replace(/\s+/g, "-").toLowerCase();

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setImagePreview(null);
    setShowModal(true);
  };

  const openEdit = (a: AdminArticle) => {
    setEditingId(a.id);
    setForm({
      title: a.title,
      category: a.category,
      coverImage: a.coverImage,
      content: a.content,
      tags: a.tags.join(", "),
      status: a.status,
      featured: (a as unknown as Record<string, boolean>).featured ?? false,
    });
    setImagePreview(a.coverImage.startsWith("#") ? null : a.coverImage);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    const result = await deleteAdminBlogPost(id);
    if ("error" in result) { window.alert("خطأ في الحذف: " + result.error); return; }
    setArticles((prev) => prev.filter((a) => a.id !== id));
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const result = await uploadViaSignedUrl("Blog-images", file, `blog-${Date.now()}`);
    if (result.error) {
      console.error("[AdminBlog] Image upload failed:", result.error);
    } else if (result.url) {
      console.log("[AdminBlog] Image uploaded:", result.url);
      setForm((f) => ({ ...f, coverImage: result.url! }));
      setImagePreview(result.url);
    }
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.title.trim()) return;

    const slug = generateSlug(form.title);
    const tagsArr = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
    const postData = {
      title: form.title, slug,
      category: form.category,
      banner_image: form.coverImage || null,
      content: form.content,
      tags: tagsArr,
      status: form.status,
      author: "مدير المحتوى",
      featured: form.featured ?? false,
    };

    try {
      const result = await saveAdminBlogPost(postData, editingId);
      if ("error" in result) { console.error("Blog save error:", result.error); }
      reloadBlog();
    } catch (err) { console.error("Blog save error:", err); }
    setShowModal(false);
  };

  /* ── Inline styles (admin light mode) ── */
  const bg = "#eff6ff";
  const card = "#ffffff";
  const surface = "#eff6ff";
  const border = "#dbeafe";
  const textPrimary = "#1c1c1e";
  const textSecondary = "#6b7280";

  const inputStyle: React.CSSProperties = {
    background: "#ffffff",
    border: `1px solid ${border}`,
    color: textPrimary,
    borderRadius: 8,
    padding: "8px 12px",
    width: "100%",
    outline: "none",
    fontSize: 14,
  };

  return (
    <div style={{ background: bg, color: textPrimary, minHeight: "100vh" }}>
      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold">إدارة المدونة</h1>
          <button
            onClick={openAdd}
            className="px-4 py-2 rounded-lg text-sm font-bold text-white"
            style={{ background: "#3b82f6" }}
          >
            + إضافة مقال
          </button>
        </div>

        {/* Table */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: card, border: `1px solid ${border}` }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: surface }}>
                  {["العنوان", "الفئة", "الحالة", "التاريخ", "الإجراءات"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-right font-semibold"
                        style={{ color: textSecondary }}
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {articles.map((a) => (
                  <tr
                    key={a.id}
                    style={{ borderTop: `1px solid ${border}` }}
                  >
                    <td className="px-4 py-3 font-medium max-w-xs truncate">
                      {a.title}
                    </td>
                    <td className="px-4 py-3" style={{ color: textSecondary }}>
                      {a.category}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-bold"
                        style={
                          a.status === "published"
                            ? { background: "#f7fee7", color: "#3b82f6" }
                            : { background: "#fef3c7", color: "#f59e0b" }
                        }
                      >
                        {a.status === "published" ? "منشور" : "مسودة"}
                      </span>
                    </td>
                    <td
                      className="px-4 py-3"
                      style={{ color: textSecondary }}
                    >
                      {a.date}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(a)}
                          className="px-3 py-1 rounded text-xs font-semibold"
                          style={{
                            background: "#ffffff",
                            color: "#3b82f6",
                            border: `1px solid ${border}`,
                          }}
                        >
                          تعديل
                        </button>
                        <button
                          onClick={() => handleDelete(a.id)}
                          className="px-3 py-1 rounded text-xs font-semibold"
                          style={{
                            background: "#ffffff",
                            color: "#ef4444",
                            border: `1px solid ${border}`,
                          }}
                        >
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {articles.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-10"
                      style={{ color: textSecondary }}
                    >
                      لا توجد مقالات.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.3)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
        >
          <div
            className="w-full max-w-lg rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
            style={{ background: card, border: `1px solid ${border}` }}
          >
            <h2 className="text-lg font-extrabold mb-5">
              {editingId !== null ? "تعديل مقال" : "إضافة مقال جديد"}
            </h2>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label
                  className="block text-xs font-semibold mb-1"
                  style={{ color: textSecondary }}
                >
                  عنوان المقال
                </label>
                <input
                  style={inputStyle}
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  placeholder="أدخل عنوان المقال"
                />
              </div>

              {/* Slug (auto) */}
              <div>
                <label
                  className="block text-xs font-semibold mb-1"
                  style={{ color: textSecondary }}
                >
                  Slug
                </label>
                <input
                  style={{ ...inputStyle, opacity: 0.6 }}
                  value={generateSlug(form.title)}
                  readOnly
                />
              </div>

              {/* Category */}
              <div>
                <label
                  className="block text-xs font-semibold mb-1"
                  style={{ color: textSecondary }}
                >
                  الفئة
                </label>
                <select
                  style={inputStyle}
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category: e.target.value }))
                  }
                >
                  {categoryOptions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cover image upload */}
              <div>
                <label
                  className="block text-xs font-semibold mb-1"
                  style={{ color: textSecondary }}
                >
                  صورة البانر
                </label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="px-4 py-2 rounded-lg text-sm font-semibold"
                  style={{ background: "#ffffff", border: `1px solid ${border}`, color: textPrimary }}
                >
                  {uploading ? "جارٍ الرفع..." : "اختر صورة"}
                </button>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="mt-2 rounded-lg max-h-32 object-cover"
                  />
                )}
              </div>

              {/* Content */}
              <div>
                <label
                  className="block text-xs font-semibold mb-1"
                  style={{ color: textSecondary }}
                >
                  محتوى المقال
                </label>
                <textarea
                  rows={10}
                  style={inputStyle}
                  value={form.content}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, content: e.target.value }))
                  }
                  placeholder="اكتب محتوى المقال هنا..."
                />
              </div>

              {/* Tags */}
              <div>
                <label
                  className="block text-xs font-semibold mb-1"
                  style={{ color: textSecondary }}
                >
                  التاقات (مفصولة بفاصلة)
                </label>
                <input
                  style={inputStyle}
                  value={form.tags}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, tags: e.target.value }))
                  }
                  placeholder="تسويق, إعلانات, استراتيجية"
                />
              </div>

              {/* Status toggle */}
              <div>
                <label
                  className="block text-xs font-semibold mb-2"
                  style={{ color: textSecondary }}
                >
                  الحالة
                </label>
                <div className="flex gap-2">
                  {(["published", "draft"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setForm((f) => ({ ...f, status: s }))}
                      className="px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors"
                      style={
                        form.status === s
                          ? { background: "#3b82f6", color: "#fff" }
                          : {
                              background: "#ffffff",
                              color: textSecondary,
                              border: `1px solid ${border}`,
                            }
                      }
                    >
                      {s === "published" ? "منشور" : "مسودة"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({...form, featured: e.target.checked})}
                className="w-4 h-4 accent-blue-500 rounded" />
              <label className="text-sm font-semibold text-gray-700">تمييز في الصفحة الرئيسية</label>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={handleSave}
                className="px-5 py-2 rounded-lg text-sm font-bold text-white"
                style={{ background: "#3b82f6" }}
              >
                حفظ
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 rounded-lg text-sm font-semibold"
                style={{
                  background: "#ffffff",
                  color: textSecondary,
                  border: `1px solid ${border}`,
                }}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
