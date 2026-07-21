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
          }
          [data-theme=light] {
            --text-primary: #111827;
            --text-secondary: #374151;
            --text-muted: #6b7280;
            --card-bg: #ffffff;
            --card-border: #e5e7eb;
            --input-bg: #f3f4f6;
            --accent: #FF3E41;
          }
        `}} />
        {children}
      </body>
    </html>
  );
}
