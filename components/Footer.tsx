"use client";
import Link from "next/link";
import { useApp } from "./ClientRoot";

export default function Footer() {
  const { t, lang } = useApp();
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="logo" style={{ marginBottom: 10 }}>
            <div className="logo-icon">🎬</div>
            <span>Top Tamil Tricks</span>
          </div>
          <p>{lang === "ta" ? "தமிழில் டெக் டிப்ஸ், ஆன்லைன் வேலை, மொபைல் டிரிக்ஸ் மற்றும் ஆப் ரிவியூ." : "Tamil tech tips, online jobs, mobile tricks & app reviews — all in Tamil."}</p>
        </div>
        <div className="footer-col">
          <h4>{lang === "ta" ? "தொகுப்புகள்" : "Playlists"}</h4>
          {["news","money","parttime","online","lifetime","mobile","apps"].map(k => (
            <Link key={k} href={`/playlist/${k}`}>{t.categories[k]}</Link>
          ))}
        </div>
        <div className="footer-col">
          <h4>{lang === "ta" ? "இணைப்புகள்" : "Links"}</h4>
          <Link href="/about">{t.legal.about}</Link>
          <Link href="/contact">{t.legal.contact}</Link>
          <Link href="/privacy-policy">{t.legal.privacy}</Link>
          <Link href="/terms-of-service">{t.legal.terms}</Link>
          <Link href="/dmca">{t.legal.dmca}</Link>
        </div>
        <div className="footer-col">
          <h4>{lang === "ta" ? "சமூக ஊடகங்கள்" : "Follow Us"}</h4>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">▶ YouTube</a>
          <a href="https://t.me" target="_blank" rel="noopener noreferrer">✈ Telegram</a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">📷 Instagram</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Top Tamil Tricks. {lang === "ta" ? "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை." : "All rights reserved."}</p>
      </div>
    </footer>
  );
}
