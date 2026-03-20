import { supabase, isSupabaseConfigured } from "./supabase";

export type StorageBucket = "ads-images" | "influencer-photos" | "strategy-covers" | "user-avatars";

export async function uploadFile(
  bucket: StorageBucket,
  file: File,
  path?: string
): Promise<{ url: string | null; error: string | null }> {
  if (!isSupabaseConfigured()) {
    // Return object URL for local preview when Supabase not configured
    return { url: URL.createObjectURL(file), error: null };
  }
  const filePath = path ?? `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, { upsert: true });
  if (error) return { url: null, error: error.message };
  const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(data.path);
  return { url: publicData.publicUrl, error: null };
}

export async function deleteFile(bucket: StorageBucket, path: string): Promise<void> {
  if (!isSupabaseConfigured()) return;
  await supabase.storage.from(bucket).remove([path]);
}
