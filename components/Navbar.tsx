"use client";
import Link from "next/link";
import { useState } from "react";
import { useApp } from "./ClientRoot";
import { Search, Moon, Sun, Bell, BellOff, Video } from "lucide-react";
import { getNotifToken } from "@/lib/visitor";

const CATEGORIES = [
  { key: "all", en: "All", ta: "அனைத்தும்" },
  { key: "news", en: "Latest News", ta: "செய்திகள்" },
  { key: "money", en: "Make Money", ta: "பணம் சம்பாதி" },
  { key: "parttime", en: "Part-Time Jobs", ta: "பார்ட் டைம்" },
  { key: "online", en: "Online Jobs", ta: "ஆன்லைன் வேலை" },
  { key: "lifetime", en: "Lifetime Jobs", ta: "நிரந்தர வேலை" },
  { key: "mobile", en: "Mobile Tricks", ta: "மொபைல் டிரிக்ஸ்" },
  { key: "apps", en: "App Reviews", ta: "ஆப் ரிவியூ" },
];

export default function Navbar() {
  const { lang, setLang, theme, setTheme, t } = useApp();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const isSubscribed = typeof window !== "undefined" && !!getNotifToken();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) window.location.href = `/search?q=${encodeURIComponent(query)}`;
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <Link href="/" className="logo">
            <img src="/logo.png" alt="TTT Family Logo" className="logo-img" style={{ height: "30px", width: "auto", marginRight: "8px" }} />
            <span className="logo-text">Top Tamil Tricks</span>
          </Link>

          <form className="search-bar" onSubmit={handleSearch}>
            <input
              type="text" value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={lang === "ta" ? "வீடியோ தேடு..." : "Search videos..."}
              id="main-search"
            />
            <button type="submit" aria-label="Search">
              <Search size={16} />
            </button>
          </form>

          <div className="nav-controls">
            <button className="btn-icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} title="Toggle theme" aria-label="Toggle theme">
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <button className="lang-toggle" onClick={() => setLang(lang === "en" ? "ta" : "en")} aria-label="Toggle language">
              {lang === "en" ? "தமிழ்" : "EN"}
            </button>

            <button className={`btn-subscribe ${isSubscribed ? "active" : ""}`} id="subscribe-btn"
              onClick={() => {
                const e = new CustomEvent("ttt:open-notif");
                window.dispatchEvent(e);
              }}
            >
              {isSubscribed ? <><BellOff size={14} /> {t.nav.subscribed}</> : <><Bell size={14} /> {t.nav.subscribe}</>}
            </button>
          </div>
        </div>
      </nav>

      {/* Category bar */}
      <div className="category-bar">
        <div className="category-bar-inner">
          {CATEGORIES.map(c => (
            <button key={c.key} className={`cat-pill ${activeCategory === c.key ? "active" : ""}`}
              onClick={() => {
                setActiveCategory(c.key);
                const ev = new CustomEvent("ttt:category", { detail: c.key });
                window.dispatchEvent(ev);
              }}
            >
              {lang === "ta" ? c.ta : c.en}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
