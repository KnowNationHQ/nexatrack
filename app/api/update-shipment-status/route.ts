import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/server-db"
import { sendEmail } from "@/lib/email"
import { trackingUpdate, deliveryConfirmed } from "@/lib/email-templates"
import { ALL_STATUSES, STATUS_LABELS } from "@/lib/statuses"

const VALID_STATUSES = ALL_STATUSES

export async function POST(req: Request) {
  const { shipment_id, status, location, description } = await req.json()

  if (!shipment_id || !status) {
    return NextResponse.json({ error: "Missing shipment_id or status" }, { status: 400 })
  }

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 })
  }

  const supabase = createAdminClient()

  let { data: parcel } = await supabase.from("parcels").select("id, merchant_id, driver_id, tracking_number, origin_city, destination_city").eq("tracking_number", shipment_id).single()
  if (!parcel) {
    const r = await supabase.from("parcels").select("id, merchant_id, driver_id, tracking_number, origin_city, destination_city").eq("id", shipment_id).single()
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
      user_id: r.id,
      title: `Shipment ${label}`,
      body: `${parcel.tracking_number} is now ${label.toLowerCase()}`,
      type: "shipment",
      link: `/${r.role}/shipments/${parcel.id}`,
    }).maybeSingle()
  }

  if (parcel.merchant_id) {
    const { data: profile } = await supabase.from("profiles").select("email, name").eq("id", parcel.merchant_id).single()
    if (profile?.email) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nexatrackcourierservices.com"
      const trackUrl = `${siteUrl}/track?number=${parcel.tracking_number}`
      const name = profile.name || "Valued Customer"
      if (status === "delivered") {
        const { data: events } = await supabase.from("tracking_events").select("event_time").eq("shipment_id", parcel.id).order("event_time", { ascending: false }).limit(1)
        const t = deliveryConfirmed({
          name,
          trackingNumber: parcel.tracking_number,
          dest: parcel.destination_city || undefined,
          deliveredAt: events?.[0]?.event_time
            ? new Date(events[0].event_time).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })
            : new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }),
        })
        sendEmail({ to: profile.email, subject: t.subject, html: t.html })
      } else {
        const t = trackingUpdate({
          name,
          trackingNumber: parcel.tracking_number,
          status,
          statusLabel: label,
          origin: parcel.origin_city || undefined,
          dest: parcel.destination_city || undefined,
          trackUrl,
        })
        sendEmail({ to: profile.email, subject: t.subject, html: t.html })
      }
    }
  }

  return NextResponse.json({ ok: true })
}