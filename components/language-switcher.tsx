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
.lang-wrap{position:relative;display:inline-block;z-index:1021}
.lang-btn{display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border:1px solid #e5e7eb;border-radius:8px;background:#fff;cursor:pointer;font-size:.9rem;color:#333;transition:all .15s ease}.lang-btn:hover{border-color:#FF3E41;box-shadow:0 0 0 2px rgba(255,62,65,.1)}
.lang-dd{position:absolute;right:0;min-width:180px;z-index:1022;margin-top:8px;background:#fff;border:1px solid #e5e7eb;border-radius:10px;box-shadow:0 8px 30px rgba(0,0,0,.1);padding:6px;overflow:hidden}
.lang-dd button{display:flex;align-items:center;gap:8px;width:100%;padding:8px 10px;border:0;background:transparent;font-size:.88rem;color:#333;cursor:pointer;border-radius:6px;transition:background .1s}.lang-dd button:hover{background:#f3f4f6}.lang-dd button.active{background:#fee2e2;color:#dc2626;font-weight:600}
@media(max-width:991.98px){.lang-btn{border:none!important;background:transparent!important;padding:4px 8px!important;border-radius:0!important}.lang-btn:hover{box-shadow:none!important;border-color:transparent!important}.lang-wrap{display:block}.lang-dd{display:flex!important;flex-wrap:wrap;gap:4px;position:static!important;width:100%;margin:0!important;border:none!important;background:transparent!important;box-shadow:none!important;padding:0!important}.lang-dd button{display:inline-flex!important;width:auto!important;font-size:.85rem!important;padding:6px 10px!important;border-radius:6px!important;color:#333!important;background:#f9fafb!important;border:1px solid #e5e7eb!important;margin:0!important}.lang-dd button.active{background:#fee2e2!important;border-color:#fecaca!important;color:#dc2626!important}}
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

  const lang = LANGUAGES.find(l => l.code === current) || LANGUAGES[0]

  return (
    <div ref={ref} className="lang-wrap">
      <button
        onClick={() => setOpen(!open)}
        className="lang-btn"
        title={lang.label}
      >
        <span style={{ fontSize: "1.1rem", lineHeight: 1 }}>{lang.flag}</span>
        <span className="d-none d-lg-inline">{lang.label}</span>
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ marginLeft: "2px", opacity: .6, transition: "transform .2s", transform: open ? "rotate(180deg)" : "rotate(0)" }}>
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <div className="lang-dd">
          {LANGUAGES.map(l => (
            <button
              key={l.code}
              onClick={() => switchLanguage(l.code)}
              className={current === l.code ? "active" : ""}
            >
              <span style={{ fontSize: "1.1rem", lineHeight: 1 }}>{l.flag}</span>
              <span style={{ flex: 1 }}>{l.label}</span>
              {current === l.code && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
      <div id="google_translate_element" style={{ display: "none" }}></div>
    </div>
  )
}
