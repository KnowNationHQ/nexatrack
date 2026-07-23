const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

function supabaseFetch(path: string) {
  const url = new URL(path, SUPABASE_URL)
  url.searchParams.set("_", String(Date.now()))
  return fetch(url, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      Accept: "application/json",
    },
    cache: "no-store",
  }).then((r) => r.json())
}

import { NextResponse } from "next/server"

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const rows: any[] = await supabaseFetch(
    `/rest/v1/parcels?select=*&or=(tracking_number.eq.${params.id},id.eq.${params.id})&limit=1`
  )
  const parcel = rows[0]

  if (!parcel) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const [typeRes, catRes, eventsRes] = await Promise.all([
    parcel.delivery_type_id
      ? supabaseFetch(`/rest/v1/delivery_types?select=name&id=eq.${parcel.delivery_type_id}&limit=1`)
      : Promise.resolve([null]),
    parcel.category_id
      ? supabaseFetch(`/rest/v1/delivery_categories?select=name&id=eq.${parcel.category_id}&limit=1`)
      : Promise.resolve([null]),
    supabaseFetch(
      `/rest/v1/tracking_events?select=*&shipment_id=eq.${parcel.id}&order=event_time.desc`
    ),
  ])

  return NextResponse.json({
    parcel,
    serviceType: typeRes[0]?.name || null,
    category: catRes[0]?.name || null,
    events: eventsRes || [],
  })
}
