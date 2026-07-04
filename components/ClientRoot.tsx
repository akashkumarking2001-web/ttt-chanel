"use client";
import { useState, useEffect, createContext, useContext } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import NotificationBanner from "./NotificationBanner";
import { Toaster } from "react-hot-toast";
import { getTheme, getLanguage } from "@/lib/visitor";
import en from "@/messages/en.json";
import ta from "@/messages/ta.json";

type Lang = "en" | "ta";
type Theme = "light" | "dark";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Messages = Record<string, any>;

interface AppCtx { lang: Lang; setLang: (l: Lang) => void; theme: Theme; setTheme: (t: Theme) => void; t: Messages; }
const AppContext = createContext<AppCtx>({} as AppCtx);
export const useApp = () => useContext(AppContext);

const messages: Record<Lang, Messages> = { en, ta };

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [lang, setLangState] = useState<Lang>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setThemeState(getTheme());
    setLangState(getLanguage());
    setMounted(true);
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    document.documentElement.setAttribute("data-theme", t);
    localStorage.setItem("ttt_theme", t);
  };

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("ttt_lang", l);
  };

  if (!mounted) return null;

  const t = messages[lang];
  const isAdmin = typeof window !== "undefined" && window.location.pathname.startsWith("/ttt-admin");

  return (
    <AppContext.Provider value={{ lang, setLang, theme, setTheme, t }}>
      <Toaster position="bottom-center" toastOptions={{ style: { background: theme === "dark" ? "#1e1e1e" : "#fff", color: theme === "dark" ? "#f1f1f1" : "#0f0f0f", border: "1px solid #e94560" } }} />
      {!isAdmin && <Navbar />}
      {!isAdmin && <NotificationBanner />}
      {children}
      {!isAdmin && <Footer />}
    </AppContext.Provider>
  );
}
