import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/server-db"

const supabase = createAdminClient()

export async function GET() {
  const { data, error } = await supabase
    .from("settings")
    .select("value")
    .eq("category", "smartsupp")
    .eq("name", "config")
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const config = data?.value as { key?: string; enabled?: boolean } | null
  return NextResponse.json({
    key: config?.key || "",
    enabled: config?.enabled ?? false,
  })
}

export async function POST(req: Request) {
  const body = await req.json()
  const { key, enabled } = body

  const { data: existing } = await supabase
    .from("settings")
    .select("id")
    .eq("category", "smartsupp")
    .eq("name", "config")
    .maybeSingle()

  const payload = {
    category: "smartsupp",
    name: "config",
    value: { key: key || "", enabled: enabled ?? false },
  }

  let error
  if (existing) {
    ({ error } = await supabase.from("settings").update(payload).eq("id", existing.id))
  } else {
    ({ error } = await supabase.from("settings").insert(payload))
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
