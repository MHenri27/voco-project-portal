import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { requireAdmin } from "@/lib/session";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/avif"];

// The browser uploads straight to blob storage, which sidesteps the ~4.5 MB
// serverless body limit that used to blow up bigger photos. This route only
// hands out a short-lived, scoped upload token after checking the admin cookie.
export async function POST(req: Request): Promise<NextResponse> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Pildi üleslaadimine pole seadistatud. Lisa BLOB_READ_WRITE_TOKEN või kleebi selle asemel pildi URL." },
      { status: 503 },
    );
  }

  const body = (await req.json()) as HandleUploadBody;

  try {
    const result = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async () => {
        // Only a logged-in admin may ever get an upload token.
        if (!(await requireAdmin())) {
          throw new Error("Pole autoriseeritud.");
        }
        return {
          allowedContentTypes: ALLOWED,
          maximumSizeInBytes: MAX_BYTES,
          addRandomSuffix: true,
        };
      },
      // Fires from blob infra after the upload lands. Nothing to persist here.
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Üleslaadimine ebaõnnestus.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
