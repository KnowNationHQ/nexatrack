import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const shipment_id = searchParams.get("shipment_id")
  if (!shipment_id) {
    return NextResponse.json({ error: "Missing shipment_id" }, { status: 400 })
  }
  const { createAdminClient } = await import("@/lib/server-db")
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("driver_locations")
    .select("lat, lng, updated_at")
    .eq("shipment_id", shipment_id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  if (!data) return NextResponse.json(null)
  return NextResponse.json({ latitude: data.lat, longitude: data.lng, recorded_at: data.updated_at })
}
