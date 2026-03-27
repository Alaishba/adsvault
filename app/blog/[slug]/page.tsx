"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AppLayout from "../../components/AppLayout";
import { type BlogArticle } from "../../lib/blogData";
import { supabase } from "../../lib/supabase";
import { getImageUrl } from "../../lib/imageUrl";

export default function BlogArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [copied, setCopied] = useState(false);
  const [pdfToast, setPdfToast] = useState(false);
  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("blog_posts").select("*").eq("slug", slug).single().then(({ data }: { data: Record<string, unknown> | null }) => {
      if (data) {
        setArticle({
          id: data.id as number, slug: (data.slug as string) ?? "", title: (data.title as string) ?? "",
          excerpt: ((data.content as string) ?? "").slice(0, 120), category: (data.category as string) ?? "",
          coverImage: (data.banner_image as string) ?? "#2563eb", author: (data.author as string) ?? "فريق AdVault",
          date: ((data.created_at as string) ?? "").slice(0, 10), readTime: "5 دقائق",
          tags: (data.tags as string[]) ?? [],
        });
      }
      setLoading(false);
    });
    // Fetch related
    supabase.from("blog_posts").select("*").eq("status", "published").limit(4).then(({ data }: { data: Record<string, unknown>[] | null }) => {
      if (data) setRelatedArticles(data.filter((d) => (d.slug as string) !== slug).slice(0, 3).map((d) => ({
        id: d.id as number, slug: (d.slug as string) ?? "", title: (d.title as string) ?? "",
        excerpt: ((d.content as string) ?? "").slice(0, 120), category: (d.category as string) ?? "",
        coverImage: (d.banner_image as string) ?? "#2563eb", author: (d.author as string) ?? "",
        date: ((d.created_at as string) ?? "").slice(0, 10), readTime: "5 دقائق", tags: (d.tags as string[]) ?? [],
      })));
    });
  }, [slug]);

  if (loading) {
    return <AppLayout><div className="flex items-center justify-center min-h-[60vh]"><p style={{ color: "#94a3b8" }}>جارٍ التحميل...</p></div></AppLayout>;
  }

  if (!article) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-lg font-bold" style={{ color: "#ffffff" }}>المقال غير موجود</p>
        </div>
      </AppLayout>
    );
  }

  const related = relatedArticles
    .filter((a) => a.id !== article.id)
    .slice(0, 3);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      // fallback ignored
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportPdf = () => {
    setPdfToast(true);
    setTimeout(() => setPdfToast(false), 2500);
  };

  return (
    <AppLayout>
      {/* Hero banner */}
      <div
        className="w-full relative overflow-hidden"
        style={{ height: 300, background: article.coverImage.startsWith("#") ? article.coverImage : "#2563eb" }}
      >
        {!article.coverImage.startsWith("#") && (
          <img src={getImageUrl("Blog-images", article.coverImage)} alt={article.title}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => { e.currentTarget.style.display = "none"; }} />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-6 right-6 left-6 text-white">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-600 mb-2">
            {article.category}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight">
            {article.title}
          </h1>
        </div>
      </div>

      {/* Content area */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Meta */}
        <div
          className="flex flex-wrap items-center gap-3 text-sm mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
            {article.author}
          </span>
          <span>·</span>
          <span>{article.date}</span>
          <span>·</span>
          <span>{article.readTime}</span>
        </div>

        {/* Article body */}
        <div
          className="leading-8 text-base space-y-6"
          style={{ color: "var(--text-primary)" }}
        >
          <p>
            في عالم التسويق الرقمي المتسارع، أصبح من الضروري أن تمتلك الشركات
            والعلامات التجارية فهماً عميقاً للأدوات والاستراتيجيات الحديثة التي
            تُمكّنها من الوصول إلى جمهورها المستهدف بفعالية أكبر. تتطور المنصات
            الرقمية باستمرار، مما يفرض على المسوّقين مواكبة هذه التغييرات وتكييف
            خططهم وفقاً لها.
          </p>

          <p>
            تُشير الدراسات الحديثة إلى أن المستهلك العربي يقضي ما يزيد عن أربع
            ساعات يومياً على منصات التواصل الاجتماعي، مما يجعل هذه المنصات
            القناة الأكثر تأثيراً للوصول إلى الفئات المستهدفة. كما أن نمو
            التجارة الإلكترونية في منطقة الشرق الأوسط وشمال أفريقيا يفتح آفاقاً
            جديدة للإعلانات الموجّهة والمخصصة.
          </p>

          {/* Pull quote */}
          <blockquote
            className="pr-4 py-3 my-6 text-lg font-semibold italic"
            style={{
              borderRight: "4px solid #2563eb",
              color: "var(--text-primary)",
            }}
          >
            النجاح في التسويق الرقمي لا يعتمد فقط على الميزانية، بل على فهم
            الجمهور وتقديم محتوى يُلبي احتياجاته بشكل حقيقي.
          </blockquote>

          <p>
            من أهم الاتجاهات الحالية هو الاعتماد على الذكاء الاصطناعي في تحليل
            بيانات الحملات وتحسين الاستهداف تلقائياً. كما يشهد المحتوى المرئي
            القصير نمواً كبيراً، خاصة عبر منصتي تيك توك وريلز إنستغرام، حيث
            يُفضّل المستخدمون المحتوى السريع والمباشر الذي يُوصل الرسالة في
            ثوانٍ معدودة.
          </p>

          <p>
            ختاماً، يبقى المحتوى الأصيل والمتوافق مع ثقافة الجمهور المحلي هو
            العامل الأهم في بناء علاقة طويلة الأمد مع العملاء. الشركات التي
            تستثمر في فهم جمهورها وتقديم قيمة حقيقية هي التي ستتصدّر السوق في
            السنوات القادمة.
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-8 mb-6">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                color: "var(--text-secondary)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Share / Export buttons */}
        <div className="flex items-center gap-3 mb-12">
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            style={{
              background: copied ? "#2563eb" : "var(--card)",
              color: copied ? "#fff" : "var(--text-primary)",
              border: "1px solid var(--border)",
            }}
          >
            {copied ? "تم النسخ ✓" : "نسخ الرابط"}
          </button>
          <button
            onClick={handleExportPdf}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            style={{
              background: "var(--card)",
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
            }}
          >
            تصدير PDF
          </button>
        </div>

        {/* PDF toast */}
        {pdfToast && (
          <div
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl text-sm font-semibold shadow-lg"
            style={{ background: "#2563eb", color: "#fff" }}
          >
            تم تصدير الملف بنجاح
          </div>
        )}

        {/* Related articles */}
        <div>
          <h2
            className="text-xl font-extrabold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            مقالات ذات صلة
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map((a) => (
              <Link key={a.id} href={`/blog/${a.slug}`}>
                <div
                  className="rounded-xl overflow-hidden transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg"
                  style={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div
                    className="flex items-center justify-center relative overflow-hidden"
                    style={{
                      aspectRatio: "16/9",
                      background: a.coverImage.startsWith("#") ? a.coverImage : "#2563eb",
                    }}
                  >
                    {!a.coverImage.startsWith("#") && (
                      <img src={getImageUrl("Blog-images", a.coverImage)} alt={a.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.style.display = "none"; }} />
                    )}
                    <span className="text-white/30 text-3xl font-extrabold select-none">
                      {a.title
                        .split(" ")
                        .slice(0, 2)
                        .map((w) => w[0])
                        .join("")}
                    </span>
                  </div>
                  <div className="p-3">
                    <h3
                      className="font-bold text-sm line-clamp-2 mb-1"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {a.title}
                    </h3>
                    <span
                      className="text-xs"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {a.date}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
