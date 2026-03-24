import { createSignedUploadUrl } from "../actions/adminActions";

/**
 * Upload a file directly from the browser to Supabase Storage using a signed URL.
 * The file never passes through Vercel's serverless function — bypasses body size limits.
 *
 * Flow:
 * 1. Server action creates a signed upload URL (tiny request — just bucket + path)
 * 2. Browser uploads file directly to Supabase Storage via the signed URL
 * 3. Returns the public URL for the uploaded file
 */
export async function uploadViaSignedUrl(
  bucket: string,
  file: File,
  pathPrefix?: string
): Promise<{ url: string | null; error: string | null }> {
  try {
    // Build a unique file path
    const ext = file.name.includes(".") ? file.name.substring(file.name.lastIndexOf(".")) : "";
    const safeName = pathPrefix ?? `upload-${Date.now()}`;
    const filePath = safeName.includes(".") ? safeName : `${safeName}-${Math.random().toString(36).slice(2, 6)}${ext}`;

    console.log(`[UploadSigned] Requesting signed URL: bucket="${bucket}" path="${filePath}" size=${file.size}`);

    // Step 1: Get signed upload URL from server (tiny payload, no file data)
    const { signedUrl, token, fullPath, error } = await createSignedUploadUrl(bucket, filePath);
    if (error || !signedUrl || !token) {
      console.error("[UploadSigned] Failed to get signed URL:", error);
      return { url: null, error: error ?? "Failed to create signed URL" };
    }

    // Step 2: Upload file directly to Supabase from browser
    const response = await fetch(signedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type || "application/octet-stream",
      },
      body: file,
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.error(`[UploadSigned] Upload failed: ${response.status} ${text}`);
      return { url: null, error: `Upload failed: ${response.status}` };
    }

    console.log(`[UploadSigned] OK url="${fullPath}"`);
    return { url: fullPath, error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Upload failed unexpectedly";
    console.error("[UploadSigned] Uncaught error:", msg);
    return { url: null, error: msg };
  }
}
