"use client"

import { useEffect } from "react"

export default function SmartsuppChat() {
  useEffect(() => {
    fetch("/api/smartsupp-config")
      .then((r) => r.json())
      .then((config) => {
        if (!config.enabled || !config.key) return

        const w = window as any
        w._smartsupp = w._smartsupp || {}
        w._smartsupp.key = config.key
        w._smartsupp.color = "#FF3E41"

        if (!w.smartsupp) {
          const d = document
          const s = d.createElement("script")
          s.type = "text/javascript"
          s.charset = "utf-8"
          s.async = true
          s.src = "//www.smartsuppchat.com/loader.js?"
          d.getElementsByTagName("head")[0].appendChild(s)
        }
      })
  }, [])

  return null
}
