import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/server-db"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const supabase = createAdminClient()
  const supabase2 = createAdminClient()

  let { data: parcel } = await supabase
    .from("parcels")
    .select("*")
    .eq("tracking_number", params.id)
    .maybeSingle()

  if (!parcel) {
    const { data: p2 } = await supabase2
      .from("parcels")
      .select("*")
      .eq("id", params.id)
      .maybeSingle()
    parcel = p2
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
