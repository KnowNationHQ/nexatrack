import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase-admin"

export async function POST(req: Request) {
  const { userId } = await req.json()
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", userId).single()

  if (profile?.role === "merchant") {
    await supabase.from("wallets").delete().eq("merchant_id", userId)
  }

  await supabase.from("parcels").update({ merchant_id: null }).eq("merchant_id", userId)
  await supabase.from("parcels").update({ driver_id: null }).eq("driver_id", userId)
  await supabase.from("profiles").delete().eq("id", userId)

  const { error } = await supabase.auth.admin.deleteUser(userId)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json({ ok: true })
}
