import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase-admin"

export async function POST(req: Request) {
  const formData = await req.formData()
  const shipmentId = formData.get("shipment_id") as string
  const file = formData.get("file") as File
  const type = formData.get("type") as string

  if (!shipmentId || !file || !type) {
    return NextResponse.json({ error: "Missing shipment_id, file, or type" }, { status: 400 })
  }

  if (!["photo", "signature"].includes(type)) {
    return NextResponse.json({ error: "type must be 'photo' or 'signature'" }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { data: bucket } = await supabase.storage.getBucket("delivery-photos")
  if (!bucket) {
    await supabase.storage.createBucket("delivery-photos", { public: true })
  }

  const ext = file.name.split(".").pop() || "png"
  const timestamp = Date.now()
  const filePath = `${shipmentId}/${type}-${timestamp}.${ext}`

  const bytes = await file.arrayBuffer()
  const { error: uploadError } = await supabase.storage
    .from("delivery-photos")
    .upload(filePath, new Uint8Array(bytes), {
      contentType: file.type,
      upsert: true,
    })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const { data: publicUrlData } = supabase.storage
    .from("delivery-photos")
    .getPublicUrl(filePath)

  const url = publicUrlData.publicUrl

  const column = type === "photo" ? "pod_photo_url" : "pod_signature_url"
  await supabase.from("parcels").update({ [column]: url }).eq("id", shipmentId)

  return NextResponse.json({ url })
}
