"use client"

import { useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase-browser"

export default function DriverLocationSender({ shipmentId }: { shipmentId: string }) {
  const watchRef = useRef<number | null>(null)

  useEffect(() => {
    if (!navigator.geolocation) return
    const supabase = createClient()

    watchRef.current = navigator.geolocation.watchPosition(
      async (pos) => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        try {
          await fetch("/api/update-location", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              driver_id: user.id,
              shipment_id: shipmentId,
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            }),
          })
        } catch { /* silently retries next interval */ }
      },
      () => { /* permission denied or error */ },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    )

    return () => {
      if (watchRef.current !== null) navigator.geolocation.clearWatch(watchRef.current)
    }
  }, [shipmentId])

  return <div className="flex items-center gap-2 text-xs text-gray-500"><span className="h-2 w-2 animate-pulse rounded-full bg-green-500" /> GPS active</div>
}
