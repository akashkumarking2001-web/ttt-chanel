"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import VideoCard, { VideoDoc } from "@/components/VideoCard";
import { useApp } from "@/components/ClientRoot";
import { 
  Newspaper, 
  Coins, 
  Briefcase, 
  Laptop, 
  Trophy, 
  Smartphone, 
  Star, 
  Video 
} from "lucide-react";

const CATEGORIES: Record<string, { label: string; labelTa: string; icon: React.ReactNode }> = {
  news: { label: "Latest News", labelTa: "சமீபத்திய செய்திகள்", icon: <Newspaper size={40} color="var(--primary)" /> },
  money: { label: "Earn Money", labelTa: "பணம் சம்பாதி", icon: <Coins size={40} color="var(--primary)" /> },
  parttime: { label: "Part Time Jobs", labelTa: "பார்ட் டைம் வேலை", icon: <Briefcase size={40} color="var(--primary)" /> },
  online: { label: "Online Jobs", labelTa: "ஆன்லைன் வேலை", icon: <Laptop size={40} color="var(--primary)" /> },
  lifetime: { label: "Lifetime Business", labelTa: "லைஃப்டைம் பிசினஸ்", icon: <Trophy size={40} color="var(--primary)" /> },
  mobile: { label: "Mobile Tricks", labelTa: "மொபைல் டிரிக்ஸ்", icon: <Smartphone size={40} color="var(--primary)" /> },
  apps: { label: "Best Apps", labelTa: "சிறந்த ஆப்கள்", icon: <Star size={40} color="var(--primary)" /> },
};

export default function PlaylistPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const { lang, t } = useApp();
  const [videos, setVideos] = useState<VideoDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const cat = CATEGORIES[slug] || { label: slug, labelTa: slug, icon: <Video size={40} color="var(--primary)" /> };

  useEffect(() => {
    fetch(`/api/videos?category=${slug}&limit=48`)
      .then(r => r.json())
      .then((data: VideoDoc[]) => { setVideos(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 20px" }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ marginBottom: 12 }}>{cat.icon}</div>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text)" }}>
          {lang === "ta" ? cat.labelTa : cat.label}
        </h1>
        <p style={{ color: "var(--text-muted)", marginTop: 6 }}>
          {loading ? "..." : `${videos.length} ${lang === "ta" ? "வீடியோக்கள்" : "videos"}`}
        </p>
      </div>

      {loading ? (
        <p style={{ color: "var(--text-muted)" }}>Loading...</p>
      ) : videos.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
            <Video size={48} />
          </div>
          <p style={{ marginTop: 12 }}>{t.home.noVideos}</p>
        </div>
      ) : (
        <div className="video-grid">
          {videos.map(v => <VideoCard key={v.id} video={v} />)}
        </div>
      )}
    </div>
  );
}
