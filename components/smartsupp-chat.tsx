"use client"

import { useEffect } from "react"

const FALLBACK_KEY = "9ff0811092d59b64990cfb0e774d6d152bb61340"

function load(key: string) {
  const w = window as any
  w._smartsupp = w._smartsupp || {}
  w._smartsupp.key = key
  w._smartsupp.color = "#FF3E41"
  if (!w.smartsupp) {
    const s = document.createElement("script")
    s.type = "text/javascript"
    s.charset = "utf-8"
    s.async = true
    s.src = "//www.smartsuppchat.com/loader.js?"
    document.head.appendChild(s)
  }
}

export default function SmartsuppChat() {
  useEffect(() => {
    fetch("/api/smartsupp-config")
      .then((r) => r.json())
      .then((c) => load(c.key || FALLBACK_KEY))
      .catch(() => load(FALLBACK_KEY))
  }, [])
  return null
}
