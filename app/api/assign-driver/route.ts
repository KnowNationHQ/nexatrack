import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase-admin"

export async function POST(req: Request) {
  const { shipment_id, driver_id } = await req.json()
  if (!shipment_id || !driver_id) {
    return NextResponse.json({ error: "Missing shipment_id or driver_id" }, { status: 400 })
  }
  const supabase = createAdminClient()

  const { error: updateError } = await supabase
    .from("parcels")
    .update({ driver_id, status: "delivery_man_assign" })
    .eq("id", shipment_id)
  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 400 })

  const { error: eventError } = await supabase.from("tracking_events").insert({
    shipment_id,
    title: "Driver Assigned",
    description: "Driver has been assigned to this shipment",
  })
  if (eventError) return NextResponse.json({ error: eventError.message }, { status: 400 })

  return NextResponse.json({ success: true })
}
