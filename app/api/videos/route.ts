// Videos API — GET /api/videos, POST /api/videos
import { NextRequest, NextResponse } from "next/server";
import { d1Query, genId } from "@/lib/d1";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const sort = searchParams.get("sort") || "latest";
  const limit = parseInt(searchParams.get("limit") || "24");
  const search = searchParams.get("search");
  const id = searchParams.get("id");

  // Single video
  if (id) {
    const result = await d1Query(`SELECT * FROM videos WHERE id = ?`, [id]);
    if (!result.success || result.results.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const video = result.results[0] as Record<string, unknown>;
    video.links = JSON.parse((video.links as string) || "[]");
    return NextResponse.json(video);
  }

  // List videos
  let sql = "SELECT * FROM videos";
  const params: (string | number | null)[] = [];
  const conditions: string[] = [];

  if (category && category !== "all") {
    conditions.push("category = ?");
    params.push(category);
  }

  if (search) {
    conditions.push("(title LIKE ? OR titleTa LIKE ?)");
    params.push(`%${search}%`, `%${search}%`);
  }

  if (conditions.length > 0) sql += " WHERE " + conditions.join(" AND ");
  sql += sort === "trending" ? " ORDER BY views DESC" : " ORDER BY createdAt DESC";
  sql += ` LIMIT ?`;
  params.push(limit);

  const result = await d1Query(sql, params);
  if (!result.success) return NextResponse.json({ error: result.error }, { status: 500 });

  const videos = result.results.map((v: Record<string, unknown>) => ({
    ...v,
    links: JSON.parse((v.links as string) || "[]"),
  }));

  return NextResponse.json(videos);
}

export async function POST(req: NextRequest) {
  const body = await req.json() as Record<string, unknown>;
  const id = genId();
  const links = JSON.stringify(body.links || []);

  const result = await d1Query(
    `INSERT INTO videos (id, title, titleTa, description, descriptionTa, category, videoType, videoUrl, thumbnail, duration, links)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      body.title as string,
      (body.titleTa as string) || null,
      (body.description as string) || null,
      (body.descriptionTa as string) || null,
      (body.category as string) || "mobile",
      (body.videoType as string) || "youtube",
      body.videoUrl as string,
      (body.thumbnail as string) || null,
      (body.duration as string) || null,
      links,
    ]
  );

  if (!result.success) return NextResponse.json({ error: result.error }, { status: 500 });
  return NextResponse.json({ success: true, id });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const result = await d1Query("DELETE FROM videos WHERE id = ?", [id]);
  if (!result.success) return NextResponse.json({ error: result.error }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const action = searchParams.get("action");

  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  if (action === "view") {
    await d1Query("UPDATE videos SET views = views + 1 WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const body = await req.json() as Record<string, unknown>;
  const links = JSON.stringify(body.links || []);

  const result = await d1Query(
    `UPDATE videos SET title = ?, titleTa = ?, description = ?, descriptionTa = ?, category = ?, videoType = ?, videoUrl = ?, thumbnail = ?, duration = ?, links = ? WHERE id = ?`,
    [
      body.title as string,
      (body.titleTa as string) || null,
      (body.description as string) || null,
      (body.descriptionTa as string) || null,
      (body.category as string) || "mobile",
      (body.videoType as string) || "youtube",
      body.videoUrl as string || "",
      (body.thumbnail as string) || null,
      (body.duration as string) || null,
      links,
      id,
    ]
  );

  if (!result.success) return NextResponse.json({ error: result.error }, { status: 500 });
  return NextResponse.json({ success: true });
}
