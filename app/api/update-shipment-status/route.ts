import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase-admin"
import { sendEmail } from "@/lib/email"

const VALID_STATUSES = [
  "pending", "pickup_assign", "picked_up", "received_warehouse",
  "delivery_man_assign", "in_transit", "out_for_delivery",
  "partial_delivered", "delivered", "return_assign_to_merchant",
  "return_received_by_merchant", "cancelled",
]

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending", pickup_assign: "Pickup Assigned", picked_up: "Picked Up",
  received_warehouse: "At Warehouse", delivery_man_assign: "Driver Assigned",
  in_transit: "In Transit", out_for_delivery: "Out for Delivery",
  partial_delivered: "Partially Delivered", delivered: "Delivered",
  cancelled: "Cancelled",
}

export async function POST(req: Request) {
  const { shipment_id, status, location, description } = await req.json()

  if (!shipment_id || !status) {
    return NextResponse.json({ error: "Missing shipment_id or status" }, { status: 400 })
  }

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 })
  }

  const supabase = createAdminClient()

  let { data: parcel } = await supabase.from("parcels").select("id, merchant_id, driver_id, tracking_number").eq("tracking_number", shipment_id).single()
  if (!parcel) {
    const r = await supabase.from("parcels").select("id, merchant_id, driver_id, tracking_number").eq("id", shipment_id).single()
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

  const label = STATUS_LABELS[status] || status
  const recipients: { id: string; role: string }[] = []
  if (parcel.merchant_id) recipients.push({ id: parcel.merchant_id, role: "merchant" })
  if (parcel.driver_id) recipients.push({ id: parcel.driver_id, role: "driver" })
  for (const r of recipients) {
    await supabase.from("notifications").insert({
      recipient_id: r.id,
      title: `Shipment ${label}`,
      message: `${parcel.tracking_number} is now ${label.toLowerCase()}`,
      link: `/${r.role}/shipments/${parcel.id}`,
    }).maybeSingle()
  }

  if (parcel.merchant_id) {
    const { data: profile } = await supabase.from("profiles").select("email").eq("id", parcel.merchant_id).single()
    if (profile?.email) {
      sendEmail({
        to: profile.email,
        subject: `Shipment ${parcel.tracking_number} is now ${label}`,
        html: `<div style="font-family:sans-serif;padding:24px;max-width:480px;margin:0 auto">
          <h2 style="color:#FF3E41">Nexatrack Courier</h2>
          <p>Your shipment <strong>${parcel.tracking_number}</strong> is now <strong>${label}</strong>.</p>
          <a href="https://nexatrack.vercel.app/track?number=${parcel.tracking_number}" style="display:inline-block;padding:10px 20px;background:#FF3E41;color:white;text-decoration:none;border-radius:6px;margin-top:12px">Track Shipment</a>
        </div>`,
      })
    }
  }

  return NextResponse.json({ ok: true })
}
