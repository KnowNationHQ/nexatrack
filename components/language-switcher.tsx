"use client"

import { useEffect, useRef, useState } from "react"

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "pt", label: "Português", flag: "🇧🇷" },
  { code: "ht", label: "Kreyòl Ayisyen", flag: "🇭🇹" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
]

const HIDE_GT_CSS = `
.goog-te-banner-frame,.goog-te-balloon-frame,.goog-te-gadget-simple,.goog-te-menu-frame{display:none!important}
.goog-te-gadget{font-size:0!important;height:0!important}
body{top:0!important}
`

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState("en")
  const ref = useRef<HTMLDivElement>(null)
  const initRef = useRef(false)

  useEffect(() => {
    if (initRef.current) return
    initRef.current = true

    const style = document.createElement("style")
    style.textContent = HIDE_GT_CSS
    document.head.appendChild(style)

    ;(window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement({
        pageLanguage: "en",
        includedLanguages: "en,es,fr,pt,ht,de",
        autoDisplay: false,
      }, "google_translate_element")
    }

    const script = document.createElement("script")
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
    script.async = true
    document.body.appendChild(script)

    const match = document.cookie.match(/googtrans=\/en\/(\w+)/)
    if (match) setCurrent(match[1])
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  function switchLanguage(code: string) {
    const sel = document.querySelector(".goog-te-combo") as HTMLSelectElement
    if (sel) { sel.value = code; sel.dispatchEvent(new Event("change")) }
    localStorage.setItem("nexatrack_lang", code)
    setCurrent(code)
    setOpen(false)
  }

  return (
    <div ref={ref} className="position-relative d-inline-block" style={{ zIndex: 1021 }}>
      <button
        onClick={() => setOpen(!open)}
        className="btn btn-sm border-0 px-2"
        style={{ fontSize: "1.1rem", lineHeight: 1 }}
        title="Language"
      >
        {LANGUAGES.find(l => l.code === current)?.flag}
      </button>
      {open && (
        <div className="position-absolute end-0 mt-1 bg-white shadow rounded border py-1" style={{ minWidth: "150px", zIndex: 1022 }}>
          {LANGUAGES.map(l => (
            <button
              key={l.code}
              onClick={() => switchLanguage(l.code)}
              className={`d-block w-100 text-start px-3 py-1.5 border-0 bg-transparent ${current === l.code ? "fw-bold" : ""}`}
              style={{ fontSize: "0.85rem", cursor: "pointer" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#f8f9fa")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              {l.flag}&ensp;{l.label}
            </button>
          ))}
        </div>
      )}
      <div id="google_translate_element" style={{ display: "none" }}></div>
    </div>
  )
}
