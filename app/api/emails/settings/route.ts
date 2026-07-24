import { getEmailSettings, getEnvEmailSettings, type EmailSettings } from "@/lib/email-settings"
import { createAdminClient } from "@/lib/server-db"

export async function GET() {
  const db = await getEmailSettings()
  const env = getEnvEmailSettings()
  return Response.json({ db, env })
}

export async function POST(req: Request) {
  try {
    const body: Partial<EmailSettings> = await req.json()
    const supabase = createAdminClient()

    const entries: Record<string, string | number> = {
      imap_host: body.imapHost ?? "",
      imap_port: body.imapPort ?? 993,
      imap_user: body.imapUser ?? "",
      imap_pass: body.imapPass ?? "",
    }

    for (const [name, value] of Object.entries(entries)) {
      const existing = await supabase
        .from("settings")
        .select("id")
        .eq("category", "email")
        .eq("name", name)
        .maybeSingle()

      if (existing.data) {
        await supabase
          .from("settings")
          .update({ value: { value: String(value) } })
          .eq("id", existing.data.id)
      } else {
        await supabase
          .from("settings")
          .insert({ category: "email", name, value: { value: String(value) }, is_active: true })
      }
    }

    return Response.json({ success: true })
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}
