import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase-admin"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const shipment_id = searchParams.get("shipment_id")
  if (!shipment_id) {
    return NextResponse.json({ error: "Missing shipment_id" }, { status: 400 })
  }
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("tracking_events")
    .select("lat, lng, event_time")
    .eq("shipment_id", shipment_id)
    .not("lat", "is", null)
    .order("event_time", { ascending: false })
    .limit(1)
    .single()
  if (error && error.code !== "PGRST116") {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  if (!data) return NextResponse.json(null)
  return NextResponse.json({ latitude: data.lat, longitude: data.lng, recorded_at: data.event_time })
}
