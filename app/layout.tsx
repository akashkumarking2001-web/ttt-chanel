import type { Metadata } from "next";
import "./globals.css";
import ClientRoot from "@/components/ClientRoot";

export const metadata: Metadata = {
  title: "Top Tamil Tricks - Tamil Tech, Jobs & Money Tips",
  description: "Top Tamil Tricks - Latest tech tips, online jobs, money-making ideas, mobile tricks, and app reviews in Tamil. Subscribe for daily updates!",
  keywords: "tamil tricks, tamil tech, online jobs tamil, make money online tamil, mobile tricks tamil, app reviews tamil",
  authors: [{ name: "Top Tamil Tricks" }],
  openGraph: {
    title: "Top Tamil Tricks",
    description: "Latest tech tips, jobs, and money-making ideas in Tamil",
    type: "website",
    locale: "ta_IN",
    siteName: "Top Tamil Tricks",
  },
  twitter: { card: "summary_large_image", title: "Top Tamil Tricks" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#e94560" />
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var t = localStorage.getItem('ttt_theme') || 'light';
                document.documentElement.setAttribute('data-theme', t);
              } catch(e) {}
            })();
          `
        }} />
      </head>
      <body>
        <ClientRoot>{children}</ClientRoot>
      </body>
    </html>
  );
}
