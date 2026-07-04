// R2 File Upload API — POST /api/upload
import { NextRequest, NextResponse } from "next/server";

const CF_ACCOUNT = process.env.CLOUDFLARE_ACCOUNT_ID!;
const CF_TOKEN = process.env.CLOUDFLARE_API_TOKEN!;
const CF_BUCKET = process.env.CLOUDFLARE_R2_BUCKET!;
const CF_PUBLIC_URL = process.env.CLOUDFLARE_R2_PUBLIC_URL || `https://pub-${CF_ACCOUNT}.r2.dev`;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string || "file";

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const ext = file.name.split(".").pop() || "bin";
    const key = `${type}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
    const bytes = await file.arrayBuffer();

    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT}/r2/buckets/${CF_BUCKET}/objects/${key}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${CF_TOKEN}`,
        "Content-Type": file.type || "application/octet-stream",
      },
      body: bytes,
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: `R2 upload failed: ${err}` }, { status: 500 });
    }

    const url = `${CF_PUBLIC_URL}/${key}`;
    return NextResponse.json({ success: true, url, key });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
