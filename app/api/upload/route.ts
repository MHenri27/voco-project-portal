import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { requireAdmin } from "@/lib/session";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

// Sniff the first bytes instead of trusting file.type, which the client sets.
function looksLikeImage(bytes: Uint8Array): boolean {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return true; // jpeg
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return true; // png
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) return true; // gif
  // riff + webp
  if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46) {
    if (bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) return true;
  }
  // ftyp box covers avif / heic
  if (bytes[4] === 0x66 && bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70) return true;
  return false;
}

// Keep the extension but strip the rest; addRandomSuffix handles uniqueness.
function safeName(name: string): string {
  const ext = name.includes(".") ? name.slice(name.lastIndexOf(".")).toLowerCase() : "";
  const clean = ext.replace(/[^a-z0-9.]/g, "");
  return `upload${clean || ".img"}`;
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Pole autoriseeritud." }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Pildi üleslaadimine pole seadistatud. Lisa BLOB_READ_WRITE_TOKEN või kleebi selle asemel pildi URL." },
      { status: 503 },
    );
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Faili ei saadetud." }, { status: 400 });
  }
  if (file.size === 0) {
    return NextResponse.json({ error: "Fail on tühi." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Fail on liiga suur. Lubatud on kuni 8 MB." }, { status: 413 });
  }

  const head = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  if (!looksLikeImage(head)) {
    return NextResponse.json({ error: "Lubatud on ainult pildifailid." }, { status: 400 });
  }

  const blob = await put(`projects/${Date.now()}-${safeName(file.name)}`, file, {
    access: "public",
    addRandomSuffix: true,
  });
  return NextResponse.json({ url: blob.url });
}
