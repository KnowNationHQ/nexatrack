import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase-admin"

export async function POST(req: Request) {
  const { userId, email, name, role = "merchant" } = await req.json()

  if (!userId || !email || !name) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { error: profileError } = await supabase.from("profiles").insert({
    id: userId,
    email,
    name,
    role,
  })

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 })
  }

  const { error: walletError } = await supabase.from("wallets").insert({
    merchant_id: userId,
    balance: 0,
  })

  if (walletError) {
    return NextResponse.json({ error: walletError.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
