"use client"

import { useState, useEffect } from "react"

const STORAGE_KEY = "nexatrack_cookie_consent"

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consented = localStorage.getItem(STORAGE_KEY)
    if (!consented) setVisible(true)
  }, [])

  function accept() {
    localStorage.setItem(STORAGE_KEY, "accepted")
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#1a1725] bg-[#07050f] p-4 shadow-lg">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p className="text-center text-sm text-[#9ca3af] sm:text-left">
          We use cookies to improve your experience and for analytics. By using Nexatrack, you agree to our use of cookies.
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={accept}
            className="cursor-pointer rounded bg-[#FF3E41] px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
