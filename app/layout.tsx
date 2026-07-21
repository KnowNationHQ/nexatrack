import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nexatrack — Courier Services",
  description: "Florida's Fastest Courier — Same-Day Delivery Across the Sunshine State",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `(function(){try{var t=localStorage.getItem("nexatrack_theme");if(!t){var d=window.matchMedia("(prefers-color-scheme:dark)").matches;t=d?"dark":"light"}document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`
        }} />
      </head>
      <body className={inter.className}>
        <style dangerouslySetInnerHTML={{__html:`
          :root,[data-theme=dark] {
            --text-primary: #ffffff;
            --text-secondary: #d1d5db;
            --text-muted: #9ca3af;
            --card-bg: #0a0715;
            --card-border: #1a1725;
            --input-bg: #1a1725;
            --accent: #FF3E41;
            --badge-success-bg: rgba(34,197,94,0.15);
            --badge-success-text: #4ade80;
            --badge-warning-bg: rgba(234,179,8,0.15);
            --badge-warning-text: #facc15;
            --badge-error-bg: rgba(239,68,68,0.15);
            --badge-error-text: #f87171;
            --badge-info-bg: rgba(59,130,246,0.15);
            --badge-info-text: #60a5fa;
            --badge-neutral-bg: rgba(156,163,175,0.15);
            --badge-neutral-text: #9ca3af;
            --badge-purple-bg: rgba(168,85,247,0.15);
            --badge-purple-text: #c084fc;
            --badge-orange-bg: rgba(249,115,22,0.15);
            --badge-orange-text: #fb923c;
            --badge-indigo-bg: rgba(99,102,241,0.15);
            --badge-indigo-text: #a5b4fc;
            --badge-cyan-bg: rgba(6,182,212,0.15);
            --badge-cyan-text: #22d3ee;
          }
          [data-theme=light] {
            --text-primary: #111827;
            --text-secondary: #374151;
            --text-muted: #6b7280;
            --card-bg: #ffffff;
            --card-border: #e5e7eb;
            --input-bg: #f3f4f6;
            --accent: #FF3E41;
            --badge-success-bg: rgba(34,197,94,0.12);
            --badge-success-text: #15803d;
            --badge-warning-bg: rgba(234,179,8,0.12);
            --badge-warning-text: #a16207;
            --badge-error-bg: rgba(239,68,68,0.12);
            --badge-error-text: #b91c1c;
            --badge-info-bg: rgba(59,130,246,0.12);
            --badge-info-text: #1d4ed8;
            --badge-neutral-bg: rgba(156,163,175,0.12);
            --badge-neutral-text: #4b5563;
            --badge-purple-bg: rgba(168,85,247,0.12);
            --badge-purple-text: #7c3aed;
            --badge-orange-bg: rgba(249,115,22,0.12);
            --badge-orange-text: #c2410c;
            --badge-indigo-bg: rgba(99,102,241,0.12);
            --badge-indigo-text: #4338ca;
            --badge-cyan-bg: rgba(6,182,212,0.12);
            --badge-cyan-text: #0e7490;
          }
        `}} />
        {children}
      </body>
    </html>
  );
}
