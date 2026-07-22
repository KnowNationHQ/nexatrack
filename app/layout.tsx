import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, getLocale } from "next-intl/server"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Nexatrack — Courier Services",
  description: "Florida's Fastest Courier — Same-Day Delivery Across the Sunshine State",
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("nexatrack_theme");if(!t){var d=window.matchMedia("(prefers-color-scheme:dark)").matches;t=d?"dark":"light"}document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`,
          }}
        />
      </head>
      <body className={inter.className}>
        <style dangerouslySetInnerHTML={{ __html: `
          :root,[data-theme=dark] {\n            --text-primary: #ffffff;\n            --text-secondary: #d1d5db;\n            --text-muted: #9ca3af;\n            --card-bg: #0a0715;\n            --card-border: #1a1725;\n            --input-bg: #1a1725;\n            --accent: #FF3E41;\n            --badge-success-bg: rgba(34,197,94,0.15);\n            --badge-success-text: #4ade80;\n            --badge-warning-bg: rgba(234,179,8,0.15);\n            --badge-warning-text: #facc15;\n            --badge-error-bg: rgba(239,68,68,0.15);\n            --badge-error-text: #f87171;\n            --badge-info-bg: rgba(59,130,246,0.15);\n            --badge-info-text: #60a5fa;\n            --badge-neutral-bg: rgba(156,163,175,0.15);\n            --badge-neutral-text: #9ca3af;\n            --badge-purple-bg: rgba(168,85,247,0.15);\n            --badge-purple-text: #c084fc;\n            --badge-orange-bg: rgba(249,115,22,0.15);\n            --badge-orange-text: #fb923c;\n            --badge-indigo-bg: rgba(99,102,241,0.15);\n            --badge-indigo-text: #a5b4fc;\n            --badge-cyan-bg: rgba(6,182,212,0.15);\n            --badge-cyan-text: #22d3ee;\n          }\n          [data-theme=light] {\n            --text-primary: #111827;\n            --text-secondary: #374151;\n            --text-muted: #6b7280;\n            --card-bg: #ffffff;\n            --card-border: #e5e7eb;\n            --input-bg: #f3f4f6;\n            --accent: #FF3E41;\n            --badge-success-bg: rgba(34,197,94,0.12);\n            --badge-success-text: #15803d;\n            --badge-warning-bg: rgba(234,179,8,0.12);\n            --badge-warning-text: #a16207;\n            --badge-error-bg: rgba(239,68,68,0.12);\n            --badge-error-text: #b91c1c;\n            --badge-info-bg: rgba(59,130,246,0.12);\n            --badge-info-text: #1d4ed8;\n            --badge-neutral-bg: rgba(156,163,175,0.12);\n            --badge-neutral-text: #4b5563;\n            --badge-purple-bg: rgba(168,85,247,0.12);\n            --badge-purple-text: #7c3aed;\n            --badge-orange-bg: rgba(249,115,22,0.12);\n            --badge-orange-text: #c2410c;\n            --badge-indigo-bg: rgba(99,102,241,0.12);\n            --badge-indigo-text: #4338ca;\n            --badge-cyan-bg: rgba(6,182,212,0.12);\n            --badge-cyan-text: #0e7490;\n          }` }}
        />
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
