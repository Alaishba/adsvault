"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "../lib/supabase/admin";

type Result = { success: true } | { error: string };

// ─── Strategies ───

export async function saveAdminStrategy(
  data: { title: string; brand: string; description?: string; insights?: string[]; tags?: string[]; thumbnail?: string | null; is_pro_only?: boolean },
  editId?: string | null
): Promise<Result> {
  const supabase = createAdminClient();
  if (editId) {
    const { error } = await supabase.from("strategies").update(data).eq("id", editId);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("strategies").insert(data);
    if (error) return { error: error.message };
  }
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
  if (editId) {
    const { error } = await supabase.from("ads").update(data).eq("id", editId);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("ads").insert(data);
    if (error) return { error: error.message };
  }
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
  if (editId) {
    const { error } = await supabase.from("influencers").update(data).eq("id", editId);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("influencers").insert(data);
    if (error) return { error: error.message };
  }
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

// ─── Fetch helpers (server-side, bypasses RLS) ───

export async function fetchAdminAds() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("ads").select("*").order("created_at", { ascending: false });
  return data ?? [];
}

export async function fetchAdminStrategies() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("strategies").select("*");
  return data ?? [];
}

export async function fetchAdminInfluencers() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("influencers").select("*");
  return data ?? [];
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

export async function fetchAdminUsers() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("users").select("id,email,full_name,plan,created_at").order("created_at", { ascending: false });
  return data ?? [];
}
