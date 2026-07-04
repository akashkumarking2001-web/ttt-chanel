"use client";
import { useState, useEffect } from "react";
import { useApp } from "./ClientRoot";
import { requestNotificationPermission } from "@/lib/fcm";
import { setNotifToken, getNotifToken } from "@/lib/visitor";
import toast from "react-hot-toast";

export default function NotificationBanner() {
  const { t } = useApp();
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Show banner after 3s if not already subscribed
    const already = getNotifToken();
    if (!already) {
      const timer = setTimeout(() => setShow(true), 3000);
      return () => clearTimeout(timer);
    }
    // Listen for manual trigger from subscribe button
    const handler = () => setShow(true);
    window.addEventListener("ttt:open-notif", handler);
    return () => window.removeEventListener("ttt:open-notif", handler);
  }, []);

  // Also listen for manual trigger even when already subscribed
  useEffect(() => {
    const handler = () => setShow(true);
    window.addEventListener("ttt:open-notif", handler);
    return () => window.removeEventListener("ttt:open-notif", handler);
  }, []);

  const handleAllow = async () => {
    setShow(false);
    const token = await requestNotificationPermission();
    if (token) {
      setNotifToken(token);
      toast.success(lang === "ta" ? "நோட்டிபிகேஷன் சந்தா ஆனது! ✅" : "Subscribed to notifications! ✅");
    } else {
      toast.error(lang === "ta" ? "அனுமதி மறுக்கப்பட்டது" : "Permission denied");
    }
  };

  const { lang } = useApp();
  if (!show) return null;

  return (
    <div className="notif-banner" role="dialog" aria-label="Notification permission">
      <div className="notif-icon">🔔</div>
      <div className="notif-title">{t.notifications.title}</div>
      <div className="notif-desc">{t.notifications.desc}</div>
      <div className="notif-actions">
        <button className="notif-allow" onClick={handleAllow} id="notif-allow-btn">{t.notifications.allow}</button>
        <button className="notif-later" onClick={() => setShow(false)} id="notif-later-btn">{t.notifications.later}</button>
      </div>
    </div>
  );
}
