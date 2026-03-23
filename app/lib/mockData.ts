export type Platform = "Meta" | "TikTok" | "Snap" | "YouTube" | "Instagram";
export type FunnelStage = "awareness" | "interest" | "conversion";

export interface Ad {
  id: string;
  brand: string;
  brandInitial: string;
  brandColor: string;
  title: string;
  description: string;
  platform: Platform;
  sector: string;
  country: string;
  date: string;
  tags: string[];
  views: string;
  saved: number;
  images?: string[];
  source_url?: string;
  basic_analysis?: string[];
  apply_idea?: string[];
  recommended_action?: string;
  ad_goal?: string;
  funnel_stage?: FunnelStage;
  season?: string;
}

export interface Influencer {
  id: string;
  name: string;
  initial: string;
  color: string;
  platforms: Platform[];
  followers: string;
  engagement: string;
  category: string;
  country: string;
  bio: string;
  strengths: string[];
  weaknesses: string[];
  audienceAge: { label: string; pct: number }[];
  audienceCountry?: { label: string; pct: number }[];
}

export interface Strategy {
  id: string;
  brand: string;
  brandInitial: string;
  brandColor: string;
  title: string;
  preview: string;
  insights: string[];
  sector: string;
  tags: string[];
  date: string;
  thumbnail?: string;
  is_pro_only?: boolean;
}

/* Empty arrays — all data comes from Supabase now */
export const mockAds: Ad[] = [];
export const mockStrategies: Strategy[] = [];
export const mockInfluencers: Influencer[] = [];
