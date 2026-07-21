import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase-admin"

const VALID_STATUSES = [
  "pending", "pickup_assign", "picked_up", "received_warehouse",
  "delivery_man_assign", "in_transit", "out_for_delivery",
  "partial_delivered", "delivered", "return_assign_to_merchant",
  "return_received_by_merchant", "cancelled",
]

export async function POST(req: Request) {
  const { shipment_id, status, location, description } = await req.json()

  if (!shipment_id || !status) {
    return NextResponse.json({ error: "Missing shipment_id or status" }, { status: 400 })
  }

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 })
  }

  const supabase = createAdminClient()

  let { data: parcel } = await supabase.from("parcels").select("id").eq("tracking_number", shipment_id).single()
  if (!parcel) {
    const r = await supabase.from("parcels").select("id").eq("id", shipment_id).single()
    parcel = r.data
  }
  if (!parcel) {
    return NextResponse.json({ error: "Shipment not found" }, { status: 404 })
  }

  const { error: updateError } = await supabase
    .from("parcels")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", parcel.id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 400 })
  }

  const { error: eventError } = await supabase.from("tracking_events").insert({
    shipment_id: parcel.id,
    title: status.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
    description: description || `Status updated to ${status.replace(/_/g, " ")}`,
    location: location || null,
    event_time: new Date().toISOString(),
  })

  if (eventError) {
    return NextResponse.json({ error: eventError.message }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}
