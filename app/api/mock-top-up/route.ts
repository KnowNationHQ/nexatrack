import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase-admin"

export async function POST(req: Request) {
  const { amount } = await req.json()
  if (!amount || amount < 1) return NextResponse.json({ error: "Invalid amount" }, { status: 400 })

  const authHeader = req.headers.get("Authorization")
  if (!authHeader?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const token = authHeader.slice(7)

  const supabase = createAdminClient()
  const { data: { user } } = await supabase.auth.getUser(token)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  let { data: wallet } = await supabase.from("wallets").select("id, balance").eq("merchant_id", user.id).single()
  if (!wallet) {
    const { data: w, error: we } = await supabase.from("wallets").insert({ merchant_id: user.id, balance: 0 }).select("id, balance").single()
    if (we) return NextResponse.json({ error: we.message }, { status: 400 })
    wallet = w
  }

  const newBalance = Number(wallet.balance) + amount

  const { error: ue } = await supabase.from("wallets").update({ balance: newBalance }).eq("id", wallet.id)
  if (ue) return NextResponse.json({ error: ue.message }, { status: 400 })

  await supabase.from("transactions").insert({
    wallet_id: wallet.id, type: "credit", amount, status: "confirm",
    payment_method: "mock_stripe", reference: `mock_${Date.now()}`, description: "Wallet top-up",
  })

  return NextResponse.json({ ok: true, balance: newBalance })
}
