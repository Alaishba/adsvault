"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AppLayout from "../components/AppLayout";
import { type BlogArticle } from "../lib/blogData";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { getImageUrl } from "../lib/imageUrl";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _removed = [
  {
    id: 1,
    slug: "استراتيجيات-التسويق-الرقمي-2026",
    title: "أبرز استراتيجيات التسويق الرقمي في 2026",
    excerpt:
      "تعرّف على أحدث الاتجاهات التي تُعيد تشكيل مشهد التسويق الرقمي في منطقة الشرق الأوسط وشمال أفريقيا وكيف يمكنك الاستفادة منها.",
    category: "تسويق",
    coverImage: "#2563eb",
    author: "أحمد الفارسي",
    date: "2026-03-15",
    readTime: "7 دقائق",
    tags: ["تسويق رقمي", "MENA", "اتجاهات"],
  },
  {
    id: 2,
    slug: "اعلانات-السوشيال-ميديا-الفعالة",
    title: "كيف تصنع إعلان سوشيال ميديا يحقق نتائج",
    excerpt:
      "دليل شامل لإنشاء إعلانات مؤثرة على منصات التواصل الاجتماعي مع أمثلة حقيقية من السوق العربي.",
    category: "إعلانات",
    coverImage: "#7c3aed",
    author: "سارة المنصوري",
    date: "2026-03-10",
    readTime: "5 دقائق",
    tags: ["إعلانات", "سوشيال ميديا", "تصميم"],
  },
  {
    id: 3,
    slug: "بناء-خطة-تسويقية-متكاملة",
    title: "خطوات بناء خطة تسويقية متكاملة لعلامتك التجارية",
    excerpt:
      "من تحليل السوق إلى التنفيذ: كل ما تحتاج معرفته لوضع خطة تسويقية ناجحة في المنطقة العربية.",
    category: "استراتيجية",
    coverImage: "#059669",
    author: "خالد العتيبي",
    date: "2026-03-05",
    readTime: "10 دقائق",
    tags: ["استراتيجية", "تخطيط", "علامة تجارية"],
  },
  {
    id: 4,
    slug: "الذكاء-الاصطناعي-في-الاعلانات",
    title: "كيف يُغيّر الذكاء الاصطناعي صناعة الإعلانات",
    excerpt:
      "استكشف تأثير تقنيات الذكاء الاصطناعي على إنتاج المحتوى الإعلاني واستهداف الجمهور وتحسين الأداء.",
    category: "تقنية",
    coverImage: "#dc2626",
    author: "نورة الحربي",
    date: "2026-02-28",
    readTime: "8 دقائق",
    tags: ["ذكاء اصطناعي", "تقنية", "إعلانات"],
  },
  {
    id: 5,
    slug: "تحليل-اداء-الحملات-الاعلانية",
    title: "أدوات وتقنيات تحليل أداء الحملات الإعلانية",
    excerpt:
      "تعلّم كيف تقيس نجاح حملاتك الإعلانية باستخدام أحدث أدوات التحليل ومؤشرات الأداء الرئيسية.",
    category: "إعلانات",
    coverImage: "#ea580c",
    author: "فهد الدوسري",
    date: "2026-02-20",
    readTime: "6 دقائق",
    tags: ["تحليل", "KPI", "حملات"],
  },
  {
    id: 6,
    slug: "التسويق-بالمحتوى-للشركات",
    title: "التسويق بالمحتوى: سلاحك السري لنمو الشركات",
    excerpt:
      "اكتشف كيف يمكن للتسويق بالمحتوى أن يبني الثقة مع جمهورك ويُحوّل الزوار إلى عملاء دائمين.",
    category: "تسويق",
    coverImage: "#0891b2",
    author: "ريم القحطاني",
    date: "2026-02-15",
    readTime: "9 دقائق",
    tags: ["تسويق بالمحتوى", "نمو", "B2B"],
  },
];

const categories = ["الكل", "تسويق", "إعلانات", "استراتيجية", "تقنية"];

function getInitials(title: string) {
  return title
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
}

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [blogArticles, setBlogArticles] = useState<BlogArticle[]>([]);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    supabase.from("blog_posts").select("*").eq("status", "published").order("created_at", { ascending: false })
      .then(({ data }: { data: Record<string, unknown>[] | null }) => {
        if (data && data.length > 0) {
          setBlogArticles(data.map((d: Record<string, unknown>) => ({
            id: d.id as number, slug: (d.slug as string) ?? "",
            title: (d.title as string) ?? "", excerpt: ((d.content as string) ?? "").slice(0, 120),
            category: (d.category as string) ?? "تسويق",
            coverImage: (d.banner_image as string) ?? "#8957f6",
            author: (d.author as string) ?? "فريق AdVault",
            date: ((d.created_at as string) ?? "").slice(0, 10),
            readTime: "5 دقائق", tags: (d.tags as string[]) ?? [],
          })));
        }
      });
  }, []);

  const featured = blogArticles.length > 0 ? blogArticles[0] : null;
  const filtered = blogArticles.length > 0
    ? (activeCategory === "الكل"
      ? blogArticles.slice(1)
      : blogArticles.filter((a) => a.id !== featured?.id && a.category === activeCategory))
    : [];

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Hero – Featured Article */}
        {featured ? (
          <Link href={`/blog/${featured.slug}`}>
            <div className="relative w-full rounded-2xl overflow-hidden mb-8"
              style={{ minHeight: 360, background: featured.coverImage.startsWith("#") ? featured.coverImage : "#8957f6" }}>
              {!featured.coverImage.startsWith("#") && (
                <img src={getImageUrl("Blog-images", featured.coverImage)} alt={featured.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = "none"; }} />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 right-0 left-0 p-6 sm:p-10 text-white">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#84cc18] text-white mb-3">{featured.category}</span>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-2 leading-tight">{featured.title}</h1>
                <p className="text-sm sm:text-base text-white/80 max-w-2xl mb-3">{featured.excerpt}</p>
                <span className="text-xs text-white/60">{featured.date}</span>
              </div>
            </div>
          </Link>
        ) : (
          <div className="text-center py-16 rounded-2xl mb-8" style={{ background: "#ffffff", border: "1px solid #e5e7eb" }}>
            <p className="text-3xl mb-2">📝</p>
            <p className="font-bold" style={{ color: "#1c1c1e" }}>لا يوجد مقالات منشورة بعد</p>
            <p className="text-sm mt-1" style={{ color: "#6b7280" }}>أضف مقالات من لوحة التحكم</p>
          </div>
        )}

        {/* Category filter pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-1.5 rounded-full text-sm font-semibold transition-colors"
              style={
                activeCategory === cat
                  ? { background: "#84cc18", color: "#fff" }
                  : {
                      background: "var(--card)",
                      color: "var(--text-secondary)",
                      border: "1px solid var(--border)",
                    }
              }
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((article) => (
            <Link key={article.id} href={`/blog/${article.slug}`}>
              <div
                className="rounded-xl overflow-hidden transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                }}
              >
                {/* Cover */}
                <div
                  className="flex items-center justify-center relative overflow-hidden"
                  style={{
                    aspectRatio: "16/9",
                    background: article.coverImage.startsWith("#") ? article.coverImage : "#8957f6",
                  }}
                >
                  {!article.coverImage.startsWith("#") && (
                    <img src={getImageUrl("Blog-images", article.coverImage)} alt={article.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.style.display = "none"; }} />
                  )}
                  <span className="text-white/30 text-4xl font-extrabold select-none">
                    {getInitials(article.title)}
                  </span>
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#84cc18] text-white">
                    {article.category}
                  </span>
                </div>

                {/* Body */}
                <div className="p-4">
                  <h3
                    className="font-bold text-base leading-snug mb-1 line-clamp-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {article.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed line-clamp-2 mb-3"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {article.excerpt}
                  </p>

                  {/* Footer */}
                  <div
                    className="flex items-center justify-between text-xs"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <span>{article.author}</span>
                    <span>
                      {article.date} · {article.readTime}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {filtered.length === 0 && (
            <p
              className="col-span-full text-center py-16 text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              لا توجد مقالات في هذا التصنيف حالياً.
            </p>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
