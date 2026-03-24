import { createClient } from "./supabase/client";

type Bucket = "ads-images" | "influencer-photos" | "strategy-covers" | "user-avatars";

/**
 * Get public URL for a Supabase Storage file.
 * If the path is already a full URL (http/blob), returns it as-is.
 * If null/undefined, returns the fallback.
 */
export function getImageUrl(
  bucket: Bucket,
  path: string | null | undefined,
  fallback = ""
): string {
  if (!path) return fallback;
  if (path.startsWith("http") || path.startsWith("blob:") || path.startsWith("data:")) return path;
  // It's a relative storage path — get public URL
  const supabase = createClient();
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
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
