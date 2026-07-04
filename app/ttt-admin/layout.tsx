"use client";
import { useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Video, MessageSquare, Bell, ListVideo, LogOut, Loader2 } from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (pathname === "/ttt-admin/login") { setChecking(false); return; }
    fetch("/api/auth")
      .then(r => r.json())
      .then((data: { authenticated: boolean }) => {
        if (!data.authenticated) router.replace("/ttt-admin/login");
        else setChecking(false);
      })
      .catch(() => router.replace("/ttt-admin/login"));
  }, [pathname, router]);

  const logout = async () => {
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    router.replace("/ttt-admin/login");
  };

  if (pathname === "/ttt-admin/login") return <>{children}</>;
  if (checking) return (
    <div style={{ minHeight: "100vh", background: "#0d0d0d", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#e94560", fontSize: 24, display: "flex", alignItems: "center", gap: 10 }}>
        <Loader2 className="animate-spin" size={24} style={{ animation: "spin 1s linear infinite" }} />
        <span>Checking auth...</span>
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  const nav = [
    { href: "/ttt-admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/ttt-admin/videos/new", label: "New Video", icon: Video },
    { href: "/ttt-admin/videos/manage", label: "Manage Videos", icon: ListVideo },
    { href: "/ttt-admin/comments", label: "Comments", icon: MessageSquare },
    { href: "/ttt-admin/notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0d0d0d" }}>
      <aside style={{ width: 220, background: "#111", borderRight: "1px solid #2a2a2a", padding: "24px 0", display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ padding: "0 20px 24px", borderBottom: "1px solid #2a2a2a", marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 20, fontWeight: 800, color: "#e94560" }}>
            <Video size={20} /> TTT
          </div>
          <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>Admin Panel</div>
        </div>
        {nav.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "10px 20px",
            color: pathname === href ? "#e94560" : "#aaa",
            background: pathname === href ? "rgba(233,69,96,0.1)" : "transparent",
            textDecoration: "none", fontSize: 14, borderLeft: pathname === href ? "3px solid #e94560" : "3px solid transparent",
            transition: "all 0.2s"
          }}>
            <Icon size={16} />{label}
          </Link>
        ))}
        <div style={{ marginTop: "auto", padding: "0 12px" }}>
          <button onClick={logout} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
            background: "none", border: "1px solid #2a2a2a", borderRadius: 8,
            color: "#666", fontSize: 14, cursor: "pointer", transition: "all 0.2s"
          }}>
            <LogOut size={16} />Logout
          </button>
        </div>
      </aside>
      <main style={{ flex: 1, padding: 32, overflowY: "auto" }}>{children}</main>
    </div>
  );
}
