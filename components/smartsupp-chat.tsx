"use client"

import { useEffect } from "react"

const SMARSUPP_KEY = "9ff0811092d59b64990cfb0e774d6d152bb61340"

export default function SmartsuppChat() {
  useEffect(() => {
    const w = window as any
    w._smartsupp = w._smartsupp || {}
    w._smartsupp.key = SMARSUPP_KEY
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
  }, [])

  return null
}
