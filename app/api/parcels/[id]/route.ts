import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase-admin"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const supabase = createAdminClient()

  let { data: parcel } = await supabase
    .from("parcels")
    .select("*")
    .eq("tracking_number", params.id)
    .single()

  if (!parcel) {
    const r = await supabase.from("parcels").select("*").eq("id", params.id).single()
    parcel = r.data
  }

  if (!parcel) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const [typeRes, catRes, eventsRes] = await Promise.all([
    parcel.delivery_type_id ? supabase.from("delivery_types").select("name").eq("id", parcel.delivery_type_id).single() : Promise.resolve({ data: null }),
    parcel.category_id ? supabase.from("delivery_categories").select("name").eq("id", parcel.category_id).single() : Promise.resolve({ data: null }),
    supabase.from("tracking_events").select("*").eq("shipment_id", parcel.id).order("event_time", { ascending: false }),
  ])

  return NextResponse.json({
    parcel,
    serviceType: typeRes.data?.name || null,
    category: catRes.data?.name || null,
    events: eventsRes.data || [],
  })
}
