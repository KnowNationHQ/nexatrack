import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/server-db"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const number = searchParams.get("number")

  if (!number) {
    return NextResponse.json({ error: "Missing tracking number" }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { data: parcel, error: parcelError } = await supabase
    .from("parcels")
    .select("*")
    .ilike("tracking_number", number.trim())
    .single()

  if (parcelError || !parcel) {
    return NextResponse.json({ error: "No shipment found" }, { status: 404 })
  }

  const { data: events } = await supabase
    .from("tracking_events")
    .select("*")
    .eq("shipment_id", parcel.id)
    .order("event_time", { ascending: false })

  return NextResponse.json({ parcel, events: events || [] })
}
