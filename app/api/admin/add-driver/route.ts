import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/server-db"

export async function POST(req: Request) {
  const { name, email, phone, password, nid, address } = await req.json()
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
    nid: nid || null,
    address: address || null,
    role: "driver",
    status: "active",
  })
  if (profileError) return NextResponse.json({ error: profileError.message }, { status: 400 })

  await supabase.auth.admin.updateUserById(user.user.id, { app_metadata: { role: "driver" } })

  return NextResponse.json({ ok: true })
}
