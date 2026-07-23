import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/server-db"

export async function POST(req: Request) {
  const { driver_id, shipment_id, lat, lng } = await req.json()
  if (!driver_id || !lat || !lng) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }
  const supabase = createAdminClient()
  const { error } = await supabase.from("driver_locations").upsert({
    driver_id,
    shipment_id,
    lat,
    lng,
  }, { onConflict: "driver_id" })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}
