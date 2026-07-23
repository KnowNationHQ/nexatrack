import { NextResponse } from "next/server"

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
  }).then((r) => r.json() as any)
}

function getParcel(id: string) {
  return supabaseFetch(
    `/rest/v1/parcels?select=*&tracking_number=eq.${encodeURIComponent(id)}&limit=1`
  ).then(async (rows: any[]) => {
    if (rows.length) return rows[0]
    const r2 = await supabaseFetch(
      `/rest/v1/parcels?select=*&id=eq.${encodeURIComponent(id)}&limit=1`
    )
    return r2[0]
  })
}

function getDeliveryType(id: string) {
  return supabaseFetch(
    `/rest/v1/delivery_types?select=name&id=eq.${id}&limit=1`
  ).then((rows: any[]) => rows[0]?.name || null)
}

function getCategory(id: string) {
  return supabaseFetch(
    `/rest/v1/delivery_categories?select=name&id=eq.${id}&limit=1`
  ).then((rows: any[]) => rows[0]?.name || null)
}

function getEvents(shipmentId: string) {
  return supabaseFetch(
    `/rest/v1/tracking_events?select=*&shipment_id=eq.${shipmentId}&order=event_time.desc`
  ).then((rows: any[]) => rows || [])
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const parcel = await getParcel(params.id)

  if (!parcel) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const [serviceType, category, events] = await Promise.all([
    parcel.delivery_type_id ? getDeliveryType(parcel.delivery_type_id) : null,
    parcel.category_id ? getCategory(parcel.category_id) : null,
    getEvents(parcel.id),
  ])

  return NextResponse.json({ parcel, serviceType, category, events })
}
