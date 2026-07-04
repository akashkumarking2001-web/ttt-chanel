"use client";
import { useState, useEffect } from "react";
import VideoCard, { VideoDoc } from "@/components/VideoCard";
import { useApp } from "@/components/ClientRoot";
import { Search, Frown } from "lucide-react";

export default function SearchPage() {
  const { lang } = useApp();
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState<VideoDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const doSearch = async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/videos?search=${encodeURIComponent(q)}&limit=24`);
      const data = await res.json() as VideoDoc[];
      setVideos(Array.isArray(data) ? data : []);
    } catch { setVideos([]); }
    setLoading(false);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("q");
      if (q) {
        setQuery(q);
        doSearch(q);
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); doSearch(query); };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 20px" }}>
      <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--text)", marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
        <Search size={28} /> {lang === "ta" ? "தேடு" : "Search Videos"}
      </h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 12, marginBottom: 32 }}>
        <input
          id="search-input"
          className="form-input"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={lang === "ta" ? "வீடியோ தேடு..." : "Search for videos..."}
          style={{ flex: 1, fontSize: 16 }}
          autoFocus
        />
        <button type="submit" className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Search size={16} /> {lang === "ta" ? "தேடு" : "Search"}
        </button>
      </form>

      {loading ? (
        <p style={{ color: "var(--text-muted)" }}>Searching...</p>
      ) : searched && videos.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
            <Frown size={48} />
          </div>
          <p style={{ marginTop: 12 }}>{lang === "ta" ? "எதுவும் கிடைக்கவில்லை" : "No results found"}</p>
        </div>
      ) : (
        <div className="video-grid">
          {videos.map(v => <VideoCard key={v.id} video={v} />)}
        </div>
      )}
    </div>
  );
}
