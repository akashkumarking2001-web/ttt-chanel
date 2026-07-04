// Votes API — GET /api/votes, POST /api/votes
import { NextRequest, NextResponse } from "next/server";
import { d1Query, genId } from "@/lib/d1";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const videoId = searchParams.get("videoId");
  const visitorId = searchParams.get("visitorId");
  if (!videoId) return NextResponse.json({ error: "videoId required" }, { status: 400 });

  const statsResult = await d1Query<{ likes: number; dislikes: number }>(
    "SELECT likes, dislikes FROM videos WHERE id = ?",
    [videoId]
  );

  let userVote = null;
  if (visitorId) {
    const voteResult = await d1Query<{ vote: string }>(
      "SELECT vote FROM votes WHERE videoId = ? AND visitorId = ?",
      [videoId, visitorId]
    );
    if (voteResult.results.length > 0) userVote = voteResult.results[0].vote;
  }

  return NextResponse.json({
    likes: statsResult.results[0]?.likes ?? 0,
    dislikes: statsResult.results[0]?.dislikes ?? 0,
    userVote,
  });
}

export async function POST(req: NextRequest) {
  const { videoId, visitorId, vote } = await req.json() as {
    videoId: string;
    visitorId: string;
    vote: "like" | "dislike" | "none";
  };

  // Get existing vote
  const existing = await d1Query<{ vote: string }>(
    "SELECT vote FROM votes WHERE videoId = ? AND visitorId = ?",
    [videoId, visitorId]
  );
  const prevVote = existing.results[0]?.vote || null;

  // Undo previous vote
  if (prevVote === "like") await d1Query("UPDATE videos SET likes = MAX(0, likes - 1) WHERE id = ?", [videoId]);
  if (prevVote === "dislike") await d1Query("UPDATE videos SET dislikes = MAX(0, dislikes - 1) WHERE id = ?", [videoId]);

  if (vote === "none") {
    await d1Query("DELETE FROM votes WHERE videoId = ? AND visitorId = ?", [videoId, visitorId]);
  } else {
    // Apply new vote
    if (vote === "like") await d1Query("UPDATE videos SET likes = likes + 1 WHERE id = ?", [videoId]);
    if (vote === "dislike") await d1Query("UPDATE videos SET dislikes = dislikes + 1 WHERE id = ?", [videoId]);

    const id = genId();
    await d1Query(
      "INSERT OR REPLACE INTO votes (id, videoId, visitorId, vote) VALUES (?, ?, ?, ?)",
      [id, videoId, visitorId, vote]
    );
  }

  return NextResponse.json({ success: true });
}
