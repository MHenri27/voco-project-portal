import { upload } from "@vercel/blob/client";

// A tidy, url-safe pathname; the random suffix (added server-side) keeps it unique.
function cleanPath(name: string): string {
  const dot = name.lastIndexOf(".");
  const ext = dot > -1 ? name.slice(dot).toLowerCase().replace(/[^a-z0-9.]/g, "") : "";
  return `projects/upload${ext || ".img"}`;
}

// Uploads a single image straight to blob storage and returns its public URL.
// The server route (/api/upload) authorises and scopes the token first.
export async function uploadImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Lubatud on ainult pildifailid.");
  }
  try {
    const blob = await upload(cleanPath(file.name), file, {
      access: "public",
      handleUploadUrl: "/api/upload",
      contentType: file.type || undefined,
    });
    return blob.url;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : "Üleslaadimine ebaõnnestus.");
  }
}
