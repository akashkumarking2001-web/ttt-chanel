"use client";
import { useState, useEffect } from "react";
import { getVisitorId } from "@/lib/visitor";
import { ThumbsUp, ThumbsDown, Share2, Copy } from "lucide-react";
import { useApp } from "./ClientRoot";
import toast from "react-hot-toast";

export default function LikeDislikeShare({ videoId, initialLikes = 0, initialDislikes = 0 }: {
  videoId: string; initialLikes?: number; initialDislikes?: number;
}) {
  const { t, lang } = useApp();
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [myVote, setMyVote] = useState<"like" | "dislike" | null>(null);
  const [showShare, setShowShare] = useState(false);
  const visitorId = getVisitorId();

  const fetchVoteData = async () => {
    try {
      const res = await fetch(`/api/votes?videoId=${videoId}&visitorId=${visitorId}`);
      if (res.ok) {
        const data = await res.json() as { likes: number; dislikes: number; userVote: "like" | "dislike" | null };
        setLikes(data.likes);
        setDislikes(data.dislikes);
        setMyVote(data.userVote);
      }
    } catch (err) {
      console.error("Error fetching vote data:", err);
    }
  };

  useEffect(() => {
    fetchVoteData();
  }, [videoId, visitorId]);

  const vote = async (type: "like" | "dislike") => {
    const nextVote = myVote === type ? "none" : type;
    try {
      const res = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId, visitorId, vote: nextVote }),
      });
      if (res.ok) {
        fetchVoteData();
      }
    } catch (err) {
      console.error("Error casting vote:", err);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/video/${videoId}`);
    toast.success(t.video.copied);
    setShowShare(false);
  };

  return (
    <div className="video-actions">
      <button className={`action-btn ${myVote === "like" ? "active" : ""}`} onClick={() => vote("like")} id="like-btn">
        <ThumbsUp size={16} /> {likes} {t.video.likes}
      </button>
      <button className={`action-btn ${myVote === "dislike" ? "active" : ""}`} onClick={() => vote("dislike")} id="dislike-btn">
        <ThumbsDown size={16} /> {dislikes} {t.video.dislikes}
      </button>

      <div style={{ position: "relative", marginLeft: "auto" }}>
        <button className="action-btn" onClick={() => setShowShare(s => !s)} id="share-btn">
          <Share2 size={16} /> {t.video.share}
        </button>
        {showShare && (
          <div style={{ position: "absolute", right: 0, top: "100%", marginTop: 8, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: 12, width: 220, zIndex: 100, boxShadow: "var(--card-hover)" }}>
            <button className="action-btn" style={{ width: "100%", justifyContent: "flex-start", marginBottom: 8 }} onClick={copyLink}>
              <Copy size={14} /> {t.video.copyLink}
            </button>
            <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener" className="action-btn" style={{ display: "flex", width: "100%", justifyContent: "flex-start", alignItems: "center", gap: 8 }}>
              <Share2 size={14} /> {lang === "ta" ? "வாட்ஸ்அப்" : "WhatsApp"}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
