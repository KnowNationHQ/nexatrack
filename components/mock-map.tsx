"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { MapPin, Navigation } from "lucide-react"

interface Coord { lat: number; lng: number }

interface MockMapProps {
  origin?: Coord | null
  destination?: Coord | null
  driverLoc?: Coord | null
  originLabel?: string
  destLabel?: string
  driverLabel?: string
  className?: string
}

function haversineMi(a: Coord, b: Coord) {
  const R = 3959
  const dLat = (b.lat - a.lat) * Math.PI / 180
  const dLng = (b.lng - a.lng) * Math.PI / 180
  const aa = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa))
}

function toPercent(val: number, min: number, max: number) {
  if (max === min) return 50
  return ((val - min) / (max - min)) * 100
}

export default function MockMap({ origin, destination, driverLoc, originLabel, destLabel, driverLabel, className }: MockMapProps) {
  const [view, setView] = useState<"street" | "satellite">("street")

  const bounds = useMemo(() => {
    const pts = [origin, destination, driverLoc].filter(Boolean) as Coord[]
    if (pts.length === 0) return null
    const lats = pts.map(p => p.lat)
    const lngs = pts.map(p => p.lng)
    const pad = 0.1
    return {
      minLat: Math.min(...lats) - pad,
      maxLat: Math.max(...lats) + pad,
      minLng: Math.min(...lngs) - pad,
      maxLng: Math.max(...lngs) + pad,
    }
  }, [origin, destination, driverLoc])

  const driverDist = useMemo(() => {
    if (!driverLoc || !destination) return null
    return haversineMi(driverLoc, destination)
  }, [driverLoc, destination])

  const originDist = useMemo(() => {
    if (!origin || !destination) return null
    return haversineMi(origin, destination)
  }, [origin, destination])

  const eta = useMemo(() => {
    if (!driverDist) return null
    const mins = Math.round((driverDist / 30) * 60)
    if (mins < 1) return "< 1 min"
    if (mins < 60) return `~${mins} min`
    const h = Math.floor(mins / 60)
    const m = mins % 60
    return m > 0 ? `~${h}h ${m}m` : `~${h}h`
  }, [driverDist])

  const px = (lat: number, lng: number) => {
    if (!bounds) return { left: "50%", top: "50%" }
    return {
      left: `${toPercent(lng, bounds.minLng, bounds.maxLng)}%`,
      top: `${100 - toPercent(lat, bounds.minLat, bounds.maxLat)}%`,
    }
  }

  const routePath = useMemo(() => {
    const pts = [origin, driverLoc, destination].filter(Boolean) as Coord[]
    if (pts.length < 2) return ""
    if (pts.length === 2) return `M ${px(pts[0].lat, pts[0].lng).left} ${px(pts[0].lat, pts[0].lng).top} L ${px(pts[1].lat, pts[1].lng).left} ${px(pts[1].lat, pts[1].lng).top}`
    return pts.map((p, i) => `${i === 0 ? "M" : "L"} ${px(p.lat, p.lng).left} ${px(p.lat, p.lng).top}`).join(" ")
  }, [origin, driverLoc, destination, bounds])

  const hasCoords = origin && destination
  const showDriver = driverLoc && destination

  return (
    <div className={`relative overflow-hidden rounded-lg border ${className || ""}`}
      style={{
        height: 300,
        borderColor: "var(--card-border)",
        background: view === "satellite"
          ? "linear-gradient(135deg, #1a2a1a 0%, #0d1f0d 30%, #2a3a2a 60%, #1a2a1a 100%)"
          : "#e8e4d8",
      }}
    >
      <svg className="absolute inset-0 h-full w-full" style={{ opacity: view === "satellite" ? 0.15 : 0.3 }}>
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke={view === "satellite" ? "#fff" : "#bbb"} strokeWidth="0.5" />
          </pattern>
          <pattern id="grid-heavy" width="160" height="160" patternUnits="userSpaceOnUse">
            <path d="M 160 0 L 0 0 0 160" fill="none" stroke={view === "satellite" ? "#fff" : "#999"} strokeWidth="1.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <rect width="100%" height="100%" fill="url(#grid-heavy)" />
      </svg>

      {view === "street" && (
        <>
          <div className="absolute left-[15%] top-[20%] h-12 w-20 rounded-full bg-green-200/40 blur-xl" />
          <div className="absolute right-[25%] bottom-[30%] h-16 w-24 rounded-full bg-green-200/30 blur-xl" />
          <div className="absolute left-[30%] top-[60%] h-20 w-16 rounded-full bg-green-200/35 blur-xl" />
          <div className="absolute right-[10%] top-[15%] h-10 w-14 rounded-full bg-blue-200/30 blur-xl" />
        </>
      )}

      {hasCoords && (
        <svg className="absolute inset-0 h-full w-full" style={{ zIndex: 5 }}>
          <path d={routePath} fill="none" stroke="#FF3E41" strokeWidth="3" strokeDasharray="8 4" opacity={0.8} />
        </svg>
      )}

      {origin && (
        <div className="absolute z-10 -translate-x-1/2 -translate-y-full cursor-pointer" style={px(origin.lat, origin.lng)}>
          <div className="flex flex-col items-center">
            <span className="mb-0.5 whitespace-nowrap rounded bg-green-600 px-1.5 py-0.5 text-[10px] font-medium text-white">{originLabel || "Origin"}</span>
            <MapPin size={22} className="text-green-500 drop-shadow-md" fill="#22c55e" />
          </div>
        </div>
      )}

      {showDriver && (
        <div className="absolute z-20 -translate-x-1/2 -translate-y-full" style={px(driverLoc!.lat, driverLoc!.lng)}>
          <div className="flex flex-col items-center">
            <span className="mb-0.5 whitespace-nowrap rounded bg-blue-600 px-1.5 py-0.5 text-[10px] font-medium text-white">{driverLabel || "Driver"}</span>
            <Navigation size={20} className="animate-pulse text-blue-400 drop-shadow-md" fill="#60a5fa" />
          </div>
        </div>
      )}

      {destination && (
        <div className="absolute z-10 -translate-x-1/2 -translate-y-full" style={px(destination.lat, destination.lng)}>
          <div className="flex flex-col items-center">
            <span className="mb-0.5 whitespace-nowrap rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-medium text-white">{destLabel || "Destination"}</span>
            <MapPin size={22} className="text-red-500 drop-shadow-md" fill="#ef4444" />
          </div>
        </div>
      )}

      <div className="absolute left-2 top-2 z-30 flex flex-col gap-1">
        <button
          type="button"
          className="flex h-7 w-7 items-center justify-center rounded border bg-white/80 text-sm font-bold text-gray-700 hover:bg-white"
          style={{ borderColor: "var(--card-border)" }}
        >+</button>
        <button
          type="button"
          className="flex h-7 w-7 items-center justify-center rounded border bg-white/80 text-sm font-bold text-gray-700 hover:bg-white"
          style={{ borderColor: "var(--card-border)" }}
        >−</button>
      </div>

      <div className="absolute right-2 top-2 z-30 flex gap-1">
        <button
          type="button"
          onClick={() => setView("street")}
          className={`rounded px-2 py-0.5 text-[10px] font-medium ${view === "street" ? "bg-[#FF3E41] text-white" : "bg-white/80 text-gray-600"}`}
        >Street</button>
        <button
          type="button"
          onClick={() => setView("satellite")}
          className={`rounded px-2 py-0.5 text-[10px] font-medium ${view === "satellite" ? "bg-[#FF3E41] text-white" : "bg-white/80 text-gray-600"}`}
        >Satellite</button>
      </div>

      {showDriver && driverDist !== null && (
        <div className="absolute bottom-12 left-2 z-30 rounded-lg border bg-white/90 px-3 py-2 shadow-lg backdrop-blur-sm" style={{ borderColor: "var(--card-border)" }}>
          <p className="flex items-center gap-1.5 text-xs font-medium text-gray-800">
            <Navigation size={12} className="text-blue-500" />
            Driver {driverDist < 0.1 ? "Approaching" : `${driverDist.toFixed(1)} mi away`}
            {eta && <span className="text-gray-500">· ETA {eta}</span>}
          </p>
        </div>
      )}

      {hasCoords && originDist !== null && !showDriver && (
        <div className="absolute bottom-12 left-2 z-30 rounded-lg border bg-white/90 px-3 py-2 shadow-lg backdrop-blur-sm" style={{ borderColor: "var(--card-border)" }}>
          <p className="flex items-center gap-1.5 text-xs font-medium text-gray-800">
            <MapPin size={12} className="text-[#FF3E41]" />
            Distance: {originDist.toFixed(1)} mi
            {eta && <span className="text-gray-500">· Est. delivery {eta}</span>}
          </p>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 z-30 border-t bg-white/70 px-3 py-1 text-[10px] text-gray-500 backdrop-blur-sm" style={{ borderColor: "var(--card-border)" }}>
        Map data &copy; OpenStreetMap
        <span className="ml-2">Zoom: {bounds ? "12" : "—"}</span>
      </div>
    </div>
  )
}
