"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

interface MapMarker {
  lat: number
  lng: number
  label?: string
}

interface MapViewProps {
  center?: [number, number]
  zoom?: number
  markers?: MapMarker[]
  className?: string
}

export default function MapView({ center, zoom = 13, markers = [], className }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const instanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current || instanceRef.current) return
    const map = L.map(mapRef.current).setView(center || [27.9942, -81.7603], zoom)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map)
    instanceRef.current = map
  }, [])

  useEffect(() => {
    const map = instanceRef.current
    if (!map) return
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) map.removeLayer(layer)
    })
    markers.forEach((m) => {
      L.marker([m.lat, m.lng]).addTo(map).bindPopup(m.label || "")
    })
  }, [markers])

  useEffect(() => {
    const map = instanceRef.current
    if (!map) return
    if (center) map.setView(center)
  }, [center])

  return <div ref={mapRef} className={`h-[300px] w-full rounded-lg ${className || ""}`} />
}
