// Comments API — GET /api/comments, POST /api/comments, DELETE /api/comments
import { NextRequest, NextResponse } from "next/server";
import { d1Query, genId } from "@/lib/d1";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const videoId = searchParams.get("videoId");
  const all = searchParams.get("all");

  if (all) {
    const result = await d1Query(
      "SELECT * FROM comments ORDER BY createdAt DESC LIMIT 200"
    );
    return NextResponse.json(result.results);
  }

  if (!videoId) return NextResponse.json({ error: "videoId required" }, { status: 400 });
  const result = await d1Query(
    "SELECT * FROM comments WHERE videoId = ? ORDER BY createdAt DESC LIMIT 100",
    [videoId]
  );
  return NextResponse.json(result.results);
}

export async function POST(req: NextRequest) {
  const body = await req.json() as { videoId: string; name: string; text: string; visitorId?: string };
  const id = genId();

  const result = await d1Query(
    "INSERT INTO comments (id, videoId, name, text, visitorId) VALUES (?, ?, ?, ?, ?)",
    [id, body.videoId, body.name, body.text, body.visitorId || null]
  );

  if (!result.success) return NextResponse.json({ error: result.error }, { status: 500 });
  return NextResponse.json({ success: true, id });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const result = await d1Query("DELETE FROM comments WHERE id = ?", [id]);
  if (!result.success) return NextResponse.json({ error: result.error }, { status: 500 });
  return NextResponse.json({ success: true });
}
