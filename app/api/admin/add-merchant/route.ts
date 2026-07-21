import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase-admin"

export async function POST(req: Request) {
  const { name, email, phone, password, address } = await req.json()
  if (!name || !email || !password) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { data: user, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: name },
  })
  if (createError) return NextResponse.json({ error: createError.message }, { status: 400 })

  const { error: profileError } = await supabase.from("profiles").insert({
    id: user.user.id,
    name,
    email,
    phone: phone || null,
    address: address || null,
    role: "merchant",
    status: "active",
  })
  if (profileError) {
    await supabase.auth.admin.deleteUser(user.user.id)
    return NextResponse.json({ error: profileError.message }, { status: 400 })
  }

  const { error: walletError } = await supabase.from("wallets").insert({
    merchant_id: user.user.id,
    balance: 0,
  })
  if (walletError) return NextResponse.json({ error: walletError.message }, { status: 400 })

  await supabase.auth.admin.updateUserById(user.user.id, { app_metadata: { role: "merchant" } })

  return NextResponse.json({ ok: true })
}
