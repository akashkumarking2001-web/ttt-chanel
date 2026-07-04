"use client";
import Link from "next/link";
import Image from "next/image";
import { Eye, ThumbsUp } from "lucide-react";
import { useApp } from "./ClientRoot";

export interface VideoDoc {
  id: string;
  title: string;
  titleTa?: string;
  thumbnail: string;
  category: string;
  duration?: string;
  views?: number;
  likes?: number;
  createdAt?: { seconds: number };
  videoType: "youtube" | "cloudflare" | "blogger";
}

function timeAgo(seconds: number): string {
  const d = Math.floor((Date.now() / 1000 - seconds) / 86400);
  if (d === 0) return "Today";
  if (d === 1) return "1 day ago";
  if (d < 30) return `${d} days ago`;
  const m = Math.floor(d / 30);
  return m === 1 ? "1 month ago" : `${m} months ago`;
}

const CATEGORY_LABELS: Record<string, { en: string; ta: string }> = {
  news: { en: "Latest News", ta: "செய்திகள்" },
  money: { en: "Make Money", ta: "பணம் சம்பாதி" },
  parttime: { en: "Part-Time Jobs", ta: "பார்ட் டைம்" },
  online: { en: "Online Jobs", ta: "ஆன்லைன் வேலை" },
  lifetime: { en: "Lifetime Jobs", ta: "நிரந்தர வேலை" },
  mobile: { en: "Mobile Tricks", ta: "மொபைல் டிரிக்ஸ்" },
  apps: { en: "App Reviews", ta: "ஆப் ரிவியூ" },
};

export default function VideoCard({ video }: { video: VideoDoc }) {
  const { lang } = useApp();
  const title = lang === "ta" && video.titleTa ? video.titleTa : video.title;
  const catLabel = CATEGORY_LABELS[video.category];
  const cat = catLabel ? (lang === "ta" ? catLabel.ta : catLabel.en) : video.category;

  return (
    <Link href={`/video/${video.id}`} className="video-card" id={`video-card-${video.id}`}>
      <div className="video-thumbnail">
        {video.thumbnail ? (
          <Image src={video.thumbnail} alt={title} fill sizes="(max-width:768px) 100vw, 33vw" style={{ objectFit: "cover" }} />
        ) : (
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,#1a0010,#0d0d0d)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}>🎬</div>
        )}
        {video.duration && <span className="thumb-duration">{video.duration}</span>}
        <div className="thumb-play">
          <div className="thumb-play-icon">▶</div>
        </div>
      </div>
      <div className="video-card-body">
        <div className="video-category-tag">{cat}</div>
        <div className="video-title">{title}</div>
        <div className="video-meta">
          {video.views != null && <span><Eye size={12} /> {video.views.toLocaleString()}</span>}
          {video.likes != null && <span><ThumbsUp size={12} /> {video.likes}</span>}
          {video.createdAt && <span>{timeAgo(video.createdAt.seconds)}</span>}
        </div>
      </div>
    </Link>
  );
}
