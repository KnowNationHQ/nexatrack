import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { global: { fetch: (url, opts) => fetch(url, { ...opts, cache: "no-store" }) } }
  )

  const { data: parcel } = await supabase
    .from("parcels")
    .select("*")
    .or(`tracking_number.eq.${params.id},id.eq.${params.id}`)
    .single()

  if (!parcel) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const [typeRes, catRes, eventsRes] = await Promise.all([
    parcel.delivery_type_id
      ? supabase.from("delivery_types").select("name").eq("id", parcel.delivery_type_id).single()
      : Promise.resolve({ data: null }),
    parcel.category_id
      ? supabase.from("delivery_categories").select("name").eq("id", parcel.category_id).single()
      : Promise.resolve({ data: null }),
    supabase.from("tracking_events").select("*").eq("shipment_id", parcel.id).order("event_time", { ascending: false }),
  ])

  return NextResponse.json({
    parcel,
    serviceType: typeRes.data?.name || null,
    category: catRes.data?.name || null,
    events: eventsRes.data || [],
  })
}
