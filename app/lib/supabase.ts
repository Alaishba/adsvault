// Backward-compatible re-export using @supabase/ssr browser client.
import { createClient } from "./supabase/client";

export const supabase = createClient();

/** @deprecated Always returns true in production. */
export function isSupabaseConfigured(): boolean {
  return true;
}
