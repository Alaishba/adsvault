import { supabase } from "./supabase";
import type { Ad, Influencer, Strategy, Platform } from "./mockData";

/* ─── DB → TS mappers ─── */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDbAd(row: any): Ad {
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
    basic_analysis: row.basic_analysis ?? [],
    apply_idea: row.apply_idea ?? [],
    recommended_action: row.recommended_action ?? "",
    ad_goal: row.ad_goal ?? "",
    funnel_stage: row.funnel_stage ?? undefined,
    season: row.season ?? "",
    pro_analysis: row.pro_analysis ?? null,
    is_pro_only: row.is_pro_only ?? false,
    video_url: row.video_url ?? "",
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDbInfluencer(row: any): Influencer & { profile_image?: string } {
  const platformStr: string = row.platform ?? "";
  const platforms: Platform[] = platformStr
    ? (platformStr.split(",").map((p: string) => p.trim()).filter(Boolean) as Platform[])
    : [];
  return {
    id: row.id,
    name: row.name ?? "",
    initial: (row.name ?? "?")[0],
    color: "#8957f6",
    platforms,
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
    niche: row.niche ?? null,
    target_audience: row.target_audience ?? null,
    interests: row.interests ?? [],
    historical_performance: row.historical_performance ?? null,
    demographics: row.demographics ?? null,
    featured: row.featured ?? false,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDbStrategy(row: any): Strategy {
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
    thumbnail: row.thumbnail ?? undefined,
    is_pro_only: row.is_pro_only ?? false,
  };
}

/* ─── Ads ─── */

export async function fetchAds(): Promise<Ad[]> {
  const { data, error } = await supabase
    .from("ads")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) { console.error("fetchAds error:", error.message); return []; }
  return (data ?? []).map(mapDbAd);
}

export async function fetchAdById(id: string): Promise<Ad | null> {
  const { data, error } = await supabase.from("ads").select("*").eq("id", id).single();
  if (error) return null;
  return mapDbAd(data);
}

export async function createAd(ad: Omit<Ad, "id">): Promise<{ error: string | null }> {
  const { error } = await supabase.from("ads").insert(ad);
  return { error: error?.message ?? null };
}

export async function updateAd(id: string, ad: Partial<Ad>): Promise<{ error: string | null }> {
  const { error } = await supabase.from("ads").update(ad).eq("id", id);
  return { error: error?.message ?? null };
}

export async function deleteAd(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from("ads").delete().eq("id", id);
  return { error: error?.message ?? null };
}

/* ─── Influencers ─── */

export async function fetchInfluencers(): Promise<(Influencer & { profile_image?: string })[]> {
  const { data, error } = await supabase.from("influencers").select("*");
  if (error) { console.error("fetchInfluencers error:", error.message); return []; }
  return (data ?? []).map(mapDbInfluencer);
}

export async function createInfluencer(inf: Omit<Influencer, "id">): Promise<{ error: string | null }> {
  const { error } = await supabase.from("influencers").insert(inf);
  return { error: error?.message ?? null };
}

export async function updateInfluencer(id: string, inf: Partial<Influencer>): Promise<{ error: string | null }> {
  const { error } = await supabase.from("influencers").update(inf).eq("id", id);
  return { error: error?.message ?? null };
}

export async function deleteInfluencer(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from("influencers").delete().eq("id", id);
  return { error: error?.message ?? null };
}

/* ─── Strategies ─── */

export async function fetchStrategies(): Promise<Strategy[]> {
  const { data, error } = await supabase.from("strategies").select("*");
  if (error) { console.error("fetchStrategies error:", error.message); return []; }
  return (data ?? []).map(mapDbStrategy);
}

export async function createStrategy(s: Omit<Strategy, "id">): Promise<{ error: string | null }> {
  const { error } = await supabase.from("strategies").insert(s);
  return { error: error?.message ?? null };
}

export async function updateStrategy(id: string, s: Partial<Strategy>): Promise<{ error: string | null }> {
  const { error } = await supabase.from("strategies").update(s).eq("id", id);
  return { error: error?.message ?? null };
}

export async function deleteStrategy(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from("strategies").delete().eq("id", id);
  return { error: error?.message ?? null };
}

/* ─── Saved Ads ─── */

export async function fetchSavedAdIds(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("saved_ads")
    .select("ad_id")
    .eq("user_id", userId);
  if (error || !data) return [];
  return data.map((r: { ad_id: string }) => r.ad_id);
}

export async function saveAd(userId: string, adId: string): Promise<void> {
  await supabase.from("saved_ads").upsert({ user_id: userId, ad_id: adId });
}

export async function unsaveAd(userId: string, adId: string): Promise<void> {
  await supabase.from("saved_ads").delete().eq("user_id", userId).eq("ad_id", adId);
}

/* ─── Users ─── */

export async function fetchUsers(): Promise<
  { id: string; email: string; full_name: string; plan: string; created_at: string }[]
> {
  const { data, error } = await supabase.from("users").select("id,email,full_name,plan,created_at");
  if (error) { console.error("fetchUsers error:", error.message); return []; }
  return data ?? [];
}

export async function updateUserPlan(userId: string, plan: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from("users").update({ plan }).eq("id", userId);
  return { error: error?.message ?? null };
}
