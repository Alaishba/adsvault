import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/** Returns true when env vars look like real values (not placeholders) */
export function isSupabaseConfigured(): boolean {
  return (
    supabaseUrl.startsWith("https://") &&
    !supabaseUrl.includes("your-project") &&
    supabaseAnonKey.length > 20 &&
    !supabaseAnonKey.includes("your-anon-key")
  );
}
