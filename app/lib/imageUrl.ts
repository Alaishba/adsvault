import { createClient } from "./supabase/client";

type Bucket = "ads-images" | "influencer-photos" | "strategy-covers" | "user-avatars" | "blog-images";

/**
 * Get public URL for a Supabase Storage file.
 * If the path is already a full URL (http/blob), returns it as-is.
 * If null/undefined, returns the fallback.
 * Strips bucket-name prefix from path to avoid double-nesting (e.g. "ads-images/file.jpg" → "file.jpg").
 */
export function getImageUrl(
  bucket: Bucket,
  path: string | null | undefined,
  fallback = ""
): string {
  if (!path) return fallback;

  // 1. المقص الذكي: إذا كان الرابط كامل وخاطئ من قاعدة البيانات، نستخرج اسم الملف فقط
  if (path.includes(".supabase.co/storage/v1/object/")) {
    const bucketIndex = path.indexOf(bucket + "/");
    if (bucketIndex !== -1) {
      path = path.substring(bucketIndex + bucket.length + 1);
    }
  }

  // 2. إذا كان رابط خارجي سليم (مثل يوتيوب أو مواقع أخرى) نمرره كما هو
  if (path.startsWith("http") || path.startsWith("blob:") || path.startsWith("data:")) return path;

  // 3. تنظيف المسار
  let cleanPath = path.trim().replace(/^\/+/, "");
  if (!cleanPath) return fallback;

  const bucketPrefix = bucket + "/";
  if (cleanPath.startsWith(bucketPrefix)) {
    cleanPath = cleanPath.slice(bucketPrefix.length);
  }

  if (!cleanPath) return fallback;

  // 4. بناء الرابط الرسمي والمثالي (الذي يحتوي على public تلقائياً)
  const supabase = createClient();
  const { data } = supabase.storage.from(bucket).getPublicUrl(cleanPath);
  return data.publicUrl;
}

/**
 * For images that might be a color hex string (legacy) or a URL.
 */
export function resolveImage(value: string | null | undefined): { type: "url" | "color" | "none"; value: string } {
  if (!value) return { type: "none", value: "" };
  if (value.startsWith("#")) return { type: "color", value };
  return { type: "url", value };
}
