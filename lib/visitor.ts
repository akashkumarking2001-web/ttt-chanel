// Visitor tracking utility — no login needed
// Generates a unique ID per browser and remembers user name after first comment

export function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("ttt_visitor_id");
  if (!id) {
    id = "visitor_" + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    localStorage.setItem("ttt_visitor_id", id);
  }
  return id;
}

export function getVisitorName(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("ttt_display_name");
}

export function setVisitorName(name: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("ttt_display_name", name);
}

export function getNotifToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("ttt_fcm_token");
}

export function setNotifToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("ttt_fcm_token", token);
}

export function getTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return (localStorage.getItem("ttt_theme") as "light" | "dark") || "light";
}

export function setThemePref(theme: "light" | "dark"): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("ttt_theme", theme);
}

export function getLanguage(): "en" | "ta" {
  if (typeof window === "undefined") return "en";
  return (localStorage.getItem("ttt_lang") as "en" | "ta") || "en";
}

export function setLanguagePref(lang: "en" | "ta"): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("ttt_lang", lang);
}
