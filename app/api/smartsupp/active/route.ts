import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/server-db"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from("settings")
      .select("value")
      .eq("category", "smartsupp")
      .eq("name", "config")
      .limit(1)
      .maybeSingle()

    const config = data?.value as { key?: string; enabled?: boolean } | null
    if (!config?.key || !config?.enabled) {
      return NextResponse.json({ active: false, count: 0 })
    }

    const res = await fetch("https://api.smartsupp.com/chat/conversations?status=active", {
      headers: { Authorization: `Bearer ${config.key}`, "Content-Type": "application/json" },
    })

    if (!res.ok) {
      return NextResponse.json({ active: false, count: 0 })
    }

    const conversations = await res.json()
    const count = Array.isArray(conversations) ? conversations.length : 0
    return NextResponse.json({ active: count > 0, count })
  } catch {
    return NextResponse.json({ active: false, count: 0 })
  }
}
