import { supabase } from "./supabase";

export type StorageBucket = "ads-images" | "influencer-photos" | "strategy-covers" | "user-avatars" | "blog-images";

export async function uploadFile(
  bucket: StorageBucket,
  file: File,
  path?: string
): Promise<{ url: string | null; error: string | null }> {
  const ext = file.name.includes(".") ? file.name.substring(file.name.lastIndexOf(".")) : "";
  const filePath = path ? (path.includes(".") ? path : `${path}${ext}`) : `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  console.log(`[Storage] Uploading to bucket="${bucket}" path="${filePath}" size=${file.size}`);
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, { upsert: true });
  if (error) {
    console.error(`[Storage] Upload FAILED bucket="${bucket}" path="${filePath}":`, error.message);
    return { url: null, error: error.message };
  }
  const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(data.path);
  console.log(`[Storage] Upload OK bucket="${bucket}" url="${publicData.publicUrl}"`);
  return { url: publicData.publicUrl, error: null };
}

export async function deleteFile(bucket: StorageBucket, path: string): Promise<void> {
  await supabase.storage.from(bucket).remove([path]);
}
