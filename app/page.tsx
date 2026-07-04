"use client";
import { useState, useEffect } from "react";
import VideoCard, { VideoDoc } from "@/components/VideoCard";
import { useApp } from "@/components/ClientRoot";
import { 
  Flame, 
  Clock, 
  Newspaper, 
  Coins, 
  Briefcase, 
  Laptop, 
  Trophy, 
  Smartphone, 
  Star, 
  List, 
  Video 
} from "lucide-react";

function SkeletonCard() {
  return (
    <div className="video-card" style={{ pointerEvents: "none" }}>
      <div className="video-thumbnail skeleton skeleton-thumb" />
      <div className="video-card-body">
        <div className="skeleton skeleton-line" style={{ width: "40%", marginBottom: 8 }} />
        <div className="skeleton skeleton-line" style={{ marginBottom: 6 }} />
        <div className="skeleton skeleton-line short" />
      </div>
    </div>
  );
}

export default function HomePage() {
  const { t, lang } = useApp();
  const [videos, setVideos] = useState<VideoDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [tab, setTab] = useState<"latest" | "trending">("latest");

  useEffect(() => {
    const handler = (e: Event) => setCategory((e as CustomEvent).detail);
    window.addEventListener("ttt:category", handler);
    return () => window.removeEventListener("ttt:category", handler);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ sort: tab, limit: "24" });
    if (category !== "all") params.set("category", category);
    fetch(`/api/videos?${params}`)
      .then(r => r.json())
      .then((data: VideoDoc[]) => { setVideos(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [category, tab]);

  return (
    <>
      {/* Hero */}
      <div className="hero">
        <div className="hero-inner">
          <div className="hero-tag" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Video size={16} /> Top Tamil Tricks
          </div>
          <h1 className="hero-title">
            {lang === "ta" ? (
              <><span>தமிழில்</span> சிறந்த டெக் டிப்ஸ் &amp; வீடியோக்கள்</>
            ) : (
              <>Best Tech Tips &amp; Videos in <span>Tamil</span></>
            )}
          </h1>
          <p className="hero-desc">
            {lang === "ta"
              ? "மொபைல் டிரிக்ஸ், ஆன்லைன் வேலை, பணம் சம்பாதிக்கும் வழிகள் — தமிழில்!"
              : "Mobile tricks, online jobs, money-making ideas & app reviews — all in Tamil!"}
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="main-layout">
        <main>
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            <button className={`action-btn ${tab === "latest" ? "active" : ""}`} onClick={() => setTab("latest")} id="tab-latest">
              <Clock size={15} /> {t.home.latest}
            </button>
            <button className={`action-btn ${tab === "trending" ? "active" : ""}`} onClick={() => setTab("trending")} id="tab-trending">
              <Flame size={15} /> {t.home.trending}
            </button>
          </div>

          {loading ? (
            <div className="video-grid">{Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}</div>
          ) : videos.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                <Video size={48} />
              </div>
              <p>{t.home.noVideos}</p>
            </div>
          ) : (
            <div className="video-grid">
              {videos.map(v => <VideoCard key={v.id} video={v} />)}
            </div>
          )}
        </main>

        {/* Sidebar playlists */}
        <aside className="sidebar">
          <div className="sidebar-card">
            <div className="sidebar-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <List size={16} /> {lang === "ta" ? "பிளேலிஸ்ட்கள்" : "Playlists"}
            </div>
            {[
              { key: "news", icon: <Newspaper size={20} color="white" /> }, 
              { key: "money", icon: <Coins size={20} color="white" /> },
              { key: "parttime", icon: <Briefcase size={20} color="white" /> }, 
              { key: "online", icon: <Laptop size={20} color="white" /> },
              { key: "lifetime", icon: <Trophy size={20} color="white" /> }, 
              { key: "mobile", icon: <Smartphone size={20} color="white" /> },
              { key: "apps", icon: <Star size={20} color="white" /> },
            ].map(pl => (
              <a key={pl.key} href={`/playlist/${pl.key}`} className="playlist-item">
                <div className="playlist-thumb">{pl.icon}</div>
                <div className="playlist-info">
                  <div className="playlist-name">{t.categories[pl.key]}</div>
                  <div className="playlist-count">{lang === "ta" ? "வீடியோக்கள் பார்க்க" : "View videos"} →</div>
                </div>
              </a>
            ))}
          </div>
        </aside>
      </div>
    </>
  );
}
