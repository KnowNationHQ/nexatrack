import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase-admin"

export async function POST(req: Request) {
  const { driver_id, shipment_id, lat, lng } = await req.json()
  if (!driver_id || !lat || !lng) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }
  const supabase = createAdminClient()
  const { error } = await supabase.from("tracking_events").insert({
    shipment_id,
    lat,
    lng,
    title: "Driver Location Update",
    description: `Driver ${driver_id} location update at ${new Date().toISOString()}`,
    event_time: new Date().toISOString(),
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}
