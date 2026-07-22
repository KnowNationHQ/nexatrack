import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/server-db"

const supabase = createAdminClient()

export async function POST(req: Request) {
  try {
    const { title, message, user_id } = await req.json()
    if (!title || !message) return NextResponse.json({ error: "title and message required" }, { status: 400 })

    if (user_id) {
      const { error } = await supabase.from("notifications").insert({ user_id, title, body: message })
      if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}
