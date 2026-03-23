import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/** Returns true when real Supabase env vars are set */
export function isSupabaseConfigured(): boolean {
  return (
    supabaseUrl.startsWith("https://") &&
    supabaseAnonKey.length > 20
  );
}
