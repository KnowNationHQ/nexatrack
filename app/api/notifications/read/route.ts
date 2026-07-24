import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/server-db"

const supabase = createAdminClient()

export async function POST(req: Request) {
  const { id, user_id } = await req.json()
  if (id) {
    await supabase.from("notifications").update({ read: true }).eq("id", id)
  } else if (user_id) {
    await supabase.from("notifications").update({ read: true }).eq("recipient_id", user_id)
  }
  return NextResponse.json({ success: true })
}
