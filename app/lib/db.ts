import { supabase, isSupabaseConfigured } from "./supabase";
import { mockAds, mockInfluencers, mockStrategies } from "./mockData";
import type { Ad, Influencer, Strategy } from "./mockData";

/* ─── Ads ─── */

export async function fetchAds(): Promise<Ad[]> {
  if (!isSupabaseConfigured()) return mockAds;
  const { data, error } = await supabase
    .from("ads")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data || data.length === 0) return mockAds;
  return data as Ad[];
}

export async function fetchAdById(id: string): Promise<Ad | null> {
  if (!isSupabaseConfigured()) return mockAds.find((a) => a.id === id) ?? null;
  const { data, error } = await supabase.from("ads").select("*").eq("id", id).single();
  if (error || !data) return mockAds.find((a) => a.id === id) ?? null;
  return data as Ad;
}

export async function createAd(ad: Omit<Ad, "id">): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured()) return { error: "Supabase not configured" };
  const { error } = await supabase.from("ads").insert(ad);
  return { error: error?.message ?? null };
}

export async function updateAd(id: string, ad: Partial<Ad>): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured()) return { error: "Supabase not configured" };
  const { error } = await supabase.from("ads").update(ad).eq("id", id);
  return { error: error?.message ?? null };
}

export async function deleteAd(id: string): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured()) return { error: "Supabase not configured" };
  const { error } = await supabase.from("ads").delete().eq("id", id);
  return { error: error?.message ?? null };
}

/* ─── Influencers ─── */

export async function fetchInfluencers(): Promise<Influencer[]> {
  if (!isSupabaseConfigured()) return mockInfluencers;
  const { data, error } = await supabase.from("influencers").select("*");
  if (error || !data || data.length === 0) return mockInfluencers;
  return data as Influencer[];
}

export async function createInfluencer(inf: Omit<Influencer, "id">): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured()) return { error: "Supabase not configured" };
  const { error } = await supabase.from("influencers").insert(inf);
  return { error: error?.message ?? null };
}

export async function updateInfluencer(id: string, inf: Partial<Influencer>): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured()) return { error: "Supabase not configured" };
  const { error } = await supabase.from("influencers").update(inf).eq("id", id);
  return { error: error?.message ?? null };
}

export async function deleteInfluencer(id: string): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured()) return { error: "Supabase not configured" };
  const { error } = await supabase.from("influencers").delete().eq("id", id);
  return { error: error?.message ?? null };
}

/* ─── Strategies ─── */

export async function fetchStrategies(): Promise<Strategy[]> {
  if (!isSupabaseConfigured()) return mockStrategies;
  const { data, error } = await supabase.from("strategies").select("*");
  if (error || !data || data.length === 0) return mockStrategies;
  return data as Strategy[];
}

export async function createStrategy(s: Omit<Strategy, "id">): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured()) return { error: "Supabase not configured" };
  const { error } = await supabase.from("strategies").insert(s);
  return { error: error?.message ?? null };
}

export async function updateStrategy(id: string, s: Partial<Strategy>): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured()) return { error: "Supabase not configured" };
  const { error } = await supabase.from("strategies").update(s).eq("id", id);
  return { error: error?.message ?? null };
}

export async function deleteStrategy(id: string): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured()) return { error: "Supabase not configured" };
  const { error } = await supabase.from("strategies").delete().eq("id", id);
  return { error: error?.message ?? null };
}

/* ─── Saved Ads ─── */

export async function fetchSavedAdIds(userId: string): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    try { return JSON.parse(localStorage.getItem("savedAds") ?? "[]"); } catch { return []; }
  }
  const { data, error } = await supabase
    .from("saved_ads")
    .select("ad_id")
    .eq("user_id", userId);
  if (error || !data) return [];
  return data.map((r: { ad_id: string }) => r.ad_id);
}

export async function saveAd(userId: string, adId: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    try {
      const ids: string[] = JSON.parse(localStorage.getItem("savedAds") ?? "[]");
      if (!ids.includes(adId)) localStorage.setItem("savedAds", JSON.stringify([...ids, adId]));
    } catch { /* */ }
    return;
  }
  await supabase.from("saved_ads").upsert({ user_id: userId, ad_id: adId });
}

export async function unsaveAd(userId: string, adId: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    try {
      const ids: string[] = JSON.parse(localStorage.getItem("savedAds") ?? "[]");
      localStorage.setItem("savedAds", JSON.stringify(ids.filter((id) => id !== adId)));
    } catch { /* */ }
    return;
  }
  await supabase.from("saved_ads").delete().eq("user_id", userId).eq("ad_id", adId);
}

/* ─── Users ─── */

export async function fetchUsers(): Promise<
  { id: string; email: string; full_name: string; plan: string; created_at: string }[]
> {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await supabase.from("users").select("id,email,full_name,plan,created_at");
  if (error || !data) return [];
  return data;
}

export async function updateUserPlan(userId: string, plan: string): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured()) return { error: "Supabase not configured" };
  const { error } = await supabase.from("users").update({ plan }).eq("id", userId);
  return { error: error?.message ?? null };
}
