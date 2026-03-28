"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "../lib/supabase/admin";

type Result = { success: true } | { error: string };

// ─── Signed Upload URL (browser uploads directly to Supabase, bypasses Vercel body limit) ───

export async function createSignedUploadUrl(
  bucket: string,
  filePath: string
): Promise<{ signedUrl: string | null; token: string | null; fullPath: string | null; error: string | null }> {
  try {
    if (!bucket || !filePath) {
      return { signedUrl: null, token: null, fullPath: null, error: "Missing bucket or path" };
    }
    const supabase = createAdminClient();
    const { data, error } = await supabase.storage.from(bucket).createSignedUploadUrl(filePath);
    if (error) {
      console.error(`[SignedUpload] Failed bucket="${bucket}" path="${filePath}":`, error.message);
      return { signedUrl: null, token: null, fullPath: null, error: error.message };
    }
    console.log(`[SignedUpload] OK bucket="${bucket}" path="${filePath}"`);
    // Build the public URL for after upload completes
    const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(data.path);
    return { signedUrl: data.signedUrl, token: data.token, fullPath: publicData.publicUrl, error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to create signed URL";
    console.error("[SignedUpload] Uncaught error:", msg);
    return { signedUrl: null, token: null, fullPath: null, error: msg };
  }
}

// ─── Admin File Upload (bypasses RLS via service role key) ───

export async function uploadAdminFile(
  formData: FormData
): Promise<{ url: string | null; path: string | null; error: string | null }> {
  try {
    const file = formData.get("file") as File | null;
    const bucket = formData.get("bucket") as string;
    const filePath = formData.get("path") as string | null;

    if (!file || !bucket) {
      console.error("[AdminUpload] Missing file or bucket");
      return { url: null, path: null, error: "Missing file or bucket" };
    }

    const ext = file.name.includes(".") ? file.name.substring(file.name.lastIndexOf(".")) : "";
    const finalPath = filePath
      ? (filePath.includes(".") ? filePath : `${filePath}${ext}`)
      : `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

    console.log(`[AdminUpload] bucket="${bucket}" path="${finalPath}" size=${file.size} type=${file.type}`);

    const supabase = createAdminClient();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(finalPath, buffer, {
        upsert: true,
        contentType: file.type || "application/octet-stream",
      });

    if (error) {
      console.error(`[AdminUpload] FAILED bucket="${bucket}" path="${finalPath}":`, error.message);
      return { url: null, path: null, error: error.message };
    }

    const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(data.path);
    console.log(`[AdminUpload] OK url="${publicData.publicUrl}"`);
    return { url: publicData.publicUrl, path: data.path, error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Upload failed unexpectedly";
    console.error("[AdminUpload] Uncaught error:", msg);
    return { url: null, path: null, error: msg };
  }
}

// ─── Promo Banners ───

export async function savePromoBanner(section: string, image_url: string): Promise<Result> {
  try {
    const supabase = createAdminClient();

    const { data: existing } = await supabase
      .from("promo_banners")
      .select("id")
      .eq("section", section)
      .single();

    if (existing?.id) {
      const { error } = await supabase
        .from("promo_banners")
        .update({ image_url })
        .eq("id", existing.id);
      if (error) return { error: error.message };
    } else {
      const { error } = await supabase
        .from("promo_banners")
        .insert({ section, image_url });
      if (error) return { error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/media");
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to save banner" };
  }
}

export async function fetchPromoBanners(): Promise<Record<string, string>> {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase.from("promo_banners").select("section,image_url");
    const map: Record<string, string> = {};
    if (data) data.forEach((r: { section: string; image_url: string }) => { map[r.section] = r.image_url; });
    return map;
  } catch {
    return {};
  }
}

// ─── Strategies ───

export async function saveAdminStrategy(
  data: { title: string; brand: string; description?: string; insights?: string[]; tags?: string[]; thumbnail?: string | null; is_pro_only?: boolean },
  editId?: string | null
): Promise<Result> {
  const supabase = createAdminClient();
  console.log(`[saveAdminStrategy] ${editId ? "UPDATE" : "INSERT"} thumbnail=${data.thumbnail ? "(set)" : "(null)"}`);
  if (editId) {
    const { error } = await supabase.from("strategies").update(data).eq("id", editId);
    if (error) { console.error("[saveAdminStrategy] UPDATE error:", error.message); return { error: error.message }; }
  } else {
    const { error } = await supabase.from("strategies").insert(data);
    if (error) { console.error("[saveAdminStrategy] INSERT error:", error.message); return { error: error.message }; }
  }
  console.log("[saveAdminStrategy] Success");
  revalidatePath("/admin/strategies");
  revalidatePath("/analysis");
  return { success: true };
}

export async function deleteAdminStrategy(id: string): Promise<Result> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("strategies").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/strategies");
  revalidatePath("/analysis");
  return { success: true };
}

// ─── Ads ───

export async function saveAdminAd(
  data: Record<string, unknown>,
  editId?: string | null
): Promise<Result> {
  const supabase = createAdminClient();
  const images = data.images as string[] | undefined;
  console.log(`[saveAdminAd] ${editId ? "UPDATE" : "INSERT"} images=${JSON.stringify(images?.length ?? 0)} keys=${Object.keys(data).join(",")}`);
  if (editId) {
    const { error } = await supabase.from("ads").update(data).eq("id", editId);
    if (error) { console.error("[saveAdminAd] UPDATE error:", error.message); return { error: error.message }; }
  } else {
    const { error } = await supabase.from("ads").insert(data);
    if (error) { console.error("[saveAdminAd] INSERT error:", error.message); return { error: error.message }; }
  }
  console.log("[saveAdminAd] Success");
  revalidatePath("/admin/ads");
  revalidatePath("/");
  revalidatePath("/library");
  return { success: true };
}

export async function deleteAdminAd(id: string): Promise<Result> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("ads").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/ads");
  revalidatePath("/");
  revalidatePath("/library");
  return { success: true };
}

// ─── Influencers ───

export async function saveAdminInfluencer(
  data: Record<string, unknown>,
  editId?: string | null
): Promise<Result> {
  const supabase = createAdminClient();
  console.log(`[saveAdminInfluencer] ${editId ? "UPDATE" : "INSERT"} profile_image=${data.profile_image ? "(set)" : "(null)"}`);
  if (editId) {
    const { error } = await supabase.from("influencers").update(data).eq("id", editId);
    if (error) { console.error("[saveAdminInfluencer] UPDATE error:", error.message); return { error: error.message }; }
  } else {
    const { error } = await supabase.from("influencers").insert(data);
    if (error) { console.error("[saveAdminInfluencer] INSERT error:", error.message); return { error: error.message }; }
  }
  console.log("[saveAdminInfluencer] Success");
  revalidatePath("/admin/influencers");
  revalidatePath("/influencers");
  return { success: true };
}

export async function deleteAdminInfluencer(id: string): Promise<Result> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("influencers").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/influencers");
  revalidatePath("/influencers");
  return { success: true };
}

// ─── Blog ───

export async function saveAdminBlogPost(
  data: Record<string, unknown>,
  editId?: string | number | null
): Promise<Result> {
  const supabase = createAdminClient();
  if (editId) {
    const { error } = await supabase.from("blog_posts").update(data).eq("id", editId);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("blog_posts").insert(data);
    if (error) return { error: error.message };
  }
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return { success: true };
}

export async function deleteAdminBlogPost(id: string | number): Promise<Result> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return { success: true };
}

// ─── Site Settings ───

export async function saveSiteSetting(key: string, value: string): Promise<Result> {
  try {
    const supabase = createAdminClient();
    const { data: existing } = await supabase
      .from("site_settings")
      .select("id")
      .eq("key", key)
      .single();

    if (existing?.id) {
      const { error } = await supabase
        .from("site_settings")
        .update({ value })
        .eq("id", existing.id);
      if (error) return { error: error.message };
    } else {
      const { error } = await supabase
        .from("site_settings")
        .insert({ key, value });
      if (error) return { error: error.message };
    }

    revalidatePath("/");
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to save setting" };
  }
}

export async function fetchSiteSetting(key: string): Promise<string | null> {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", key)
      .single();
    return data?.value ?? null;
  } catch {
    return null;
  }
}

// ─── Fetch helpers (server-side, bypasses RLS) ───
// Map DB snake_case → TS camelCase for admin pages

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapAdRow(row: any) {
  return {
    id: row.id,
    brand: row.brand ?? "",
    brandInitial: row.brand_initial ?? (row.brand ?? "?")[0],
    brandColor: row.brand_color ?? "#84cc18",
    title: row.title ?? "",
    description: row.description ?? "",
    platform: row.platform ?? "Meta",
    sector: row.sector ?? "",
    country: row.country ?? "",
    date: (row.created_at ?? "").slice(0, 10),
    tags: row.tags ?? [],
    views: String(row.views ?? "0"),
    saved: Number(row.saved ?? 0),
    images: row.images ?? [],
    source_url: row.source_url ?? "",
    video_url: row.video_url ?? "",
    basic_analysis: row.basic_analysis ?? [],
    apply_idea: row.apply_idea ?? [],
    recommended_action: row.recommended_action ?? "",
    ad_goal: row.ad_goal ?? "",
    funnel_stage: row.funnel_stage ?? "awareness",
    season: row.season ?? "",
    is_pro_only: row.is_pro_only ?? false,
    pro_analysis: row.pro_analysis ?? null,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapInfluencerRow(row: any) {
  const platformStr: string = row.platform ?? "";
  return {
    id: row.id,
    name: row.name ?? "",
    initial: (row.name ?? "?")[0],
    color: "#8957f6",
    platforms: platformStr ? platformStr.split(",").map((p: string) => p.trim()).filter(Boolean) : [],
    followers: row.follower_count ?? "0",
    engagement: row.engagement_rate ?? "0%",
    category: row.category ?? "",
    country: row.country ?? "",
    bio: row.bio ?? "",
    strengths: row.strengths ?? [],
    weaknesses: row.weaknesses ?? [],
    audienceAge: row.audience_age ?? [],
    audienceCountry: row.audience_country ?? [],
    profile_image: row.profile_image ?? null,
    profileImage: row.profile_image ?? null,
    contactEmail: row.contact_email ?? "",
    niche: row.niche ?? null,
    target_audience: row.target_audience ?? null,
    interests: row.interests ?? [],
    historical_performance: row.historical_performance ?? null,
    demographics: row.demographics ?? null,
    featured: row.featured ?? false,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapStrategyRow(row: any) {
  return {
    id: row.id,
    brand: row.brand ?? "",
    brandInitial: (row.brand ?? "?")[0],
    brandColor: "#8957f6",
    title: row.title ?? "",
    preview: row.description ?? "",
    insights: row.insights ?? [],
    sector: row.sector ?? "",
    tags: row.tags ?? [],
    date: (row.created_at ?? "").slice(0, 10),
    thumbnail: row.thumbnail ?? null,
    is_pro_only: row.is_pro_only ?? false,
  };
}

export async function fetchAdminAds() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("ads").select("*").order("created_at", { ascending: false });
  return (data ?? []).map(mapAdRow);
}

export async function fetchAdminStrategies() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("strategies").select("*");
  return (data ?? []).map(mapStrategyRow);
}

export async function fetchAdminInfluencers() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("influencers").select("*");
  return (data ?? []).map(mapInfluencerRow);
}

export async function fetchAdminBlogPosts() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
  return data ?? [];
}

// ─── Dashboard Counts ───

export async function fetchAdminDashboardCounts(): Promise<{
  totalUsers: number; proUsers: number; totalAds: number;
  totalStrategies: number; totalInfluencers: number; totalBlogPosts: number;
}> {
  const supabase = createAdminClient();
  const [usersRes, proRes, adsRes, stratRes, infRes, blogRes] = await Promise.all([
    supabase.from("users").select("id", { count: "exact", head: true }),
    supabase.from("users").select("id", { count: "exact", head: true }).eq("plan", "pro"),
    supabase.from("ads").select("id", { count: "exact", head: true }),
    supabase.from("strategies").select("id", { count: "exact", head: true }),
    supabase.from("influencers").select("id", { count: "exact", head: true }),
    supabase.from("blog_posts").select("id", { count: "exact", head: true }),
  ]);
  return {
    totalUsers: usersRes.count ?? 0, proUsers: proRes.count ?? 0,
    totalAds: adsRes.count ?? 0, totalStrategies: stratRes.count ?? 0,
    totalInfluencers: infRes.count ?? 0, totalBlogPosts: blogRes.count ?? 0,
  };
}

export async function fetchAdminRecentAds() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("ads").select("title,brand,created_at").order("created_at", { ascending: false }).limit(5);
  return (data ?? []).map((d: Record<string, string>) => ({ title: d.title ?? "", brand: d.brand ?? "", date: (d.created_at ?? "").slice(0, 10) }));
}

export async function fetchAdminContactRequests() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("contact_requests").select("name,email,message,created_at").order("created_at", { ascending: false }).limit(5);
  return (data ?? []).map((d: Record<string, string>) => ({ name: d.name ?? "", email: d.email ?? "", message: d.message ?? "", date: (d.created_at ?? "").slice(0, 10) }));
}

// ─── Confirm User Email (admin/testing bypass) ───

export async function confirmUserEmail(userId: string): Promise<Result> {
  const supabase = createAdminClient();
  const { error } = await supabase.auth.admin.updateUserById(userId, {
    email_confirm: true,
  });
  if (error) return { error: error.message };
  return { success: true };
}

export async function fetchAdminUsers() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("users").select("id,email,full_name,plan,created_at").order("created_at", { ascending: false });
  return data ?? [];
}
