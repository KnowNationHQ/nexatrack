import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/server-db"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("settings")
    .select("value")
    .eq("category", "smartsupp")
    .eq("name", "config")
    .limit(1)
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const config = data?.value as { key?: string; enabled?: boolean } | null
  return NextResponse.json({
    key: config?.key || "",
    enabled: config?.enabled ?? false,
  })
}

export async function POST(req: Request) {
  const supabase = createAdminClient()
  const body = await req.json()
  const { key, enabled } = body

  const { data: existing } = await supabase
    .from("settings")
    .select("id")
    .eq("category", "smartsupp")
    .eq("name", "config")
    .limit(1)
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
