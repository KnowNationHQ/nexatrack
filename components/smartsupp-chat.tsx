"use client"

import { useEffect } from "react"

const KEY = "f72df62c27445bc0eb38023e27b0d2c44f1c9054"

export default function SmartsuppChat() {
  useEffect(() => {
    const w = window as any
    w._smartsupp = w._smartsupp || {}
    w._smartsupp.key = KEY

    if (!w.smartsupp) {
      const d = document
      const s = d.createElement("script")
      s.type = "text/javascript"
      s.charset = "utf-8"
      s.async = true
      s.src = "//www.smartsuppchat.com/loader.js?"
      d.getElementsByTagName("head")[0].appendChild(s)
    }
  }, [])

  return null
}
