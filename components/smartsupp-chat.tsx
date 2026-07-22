"use client"

import { useEffect } from "react"

const KEY = "4e3b26ee6838f18cc13b4cbf40a439652cf131b5"

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
