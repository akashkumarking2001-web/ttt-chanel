// Stats API — GET /api/stats
import { NextResponse } from "next/server";
import { d1Query } from "@/lib/d1";

export async function GET() {
  const [videos, comments, subscribers, views] = await Promise.all([
    d1Query<{ count: number }>("SELECT COUNT(*) as count FROM videos"),
    d1Query<{ count: number }>("SELECT COUNT(*) as count FROM comments"),
    d1Query<{ count: number }>("SELECT COUNT(*) as count FROM subscribers"),
    d1Query<{ total: number }>("SELECT SUM(views) as total FROM videos"),
  ]);

  return NextResponse.json({
    videos: videos.results[0]?.count ?? 0,
    comments: comments.results[0]?.count ?? 0,
    subscribers: subscribers.results[0]?.count ?? 0,
    views: views.results[0]?.total ?? 0,
  });
}
