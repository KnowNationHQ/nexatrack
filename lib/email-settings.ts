import { createAdminClient } from "./server-db"

export type EmailSettings = {
  imapHost: string
  imapPort: number
  imapUser: string
  imapPass: string
}

const DEFAULTS: EmailSettings = {
  imapHost: "imap.hostinger.com",
  imapPort: 993,
  imapUser: "",
  imapPass: "",
}

export async function getEmailSettings(): Promise<EmailSettings> {
  const supabase = createAdminClient()
  const { data } = await supabase.from("settings").select("name, value").eq("category", "email").eq("is_active", true)
  const map: Record<string, string> = {}
  if (data) {
    for (const row of data) {
      const v = row.value as any
      map[row.name] = typeof v === "object" && v !== null ? v.value ?? "" : String(v ?? "")
    }
  }

  return {
    imapHost: map.imap_host || process.env.IMAP_HOST || DEFAULTS.imapHost,
    imapPort: Number(map.imap_port || process.env.IMAP_PORT || DEFAULTS.imapPort),
    imapUser: map.imap_user || process.env.IMAP_USER || DEFAULTS.imapUser,
    imapPass: map.imap_pass || process.env.IMAP_PASS || DEFAULTS.imapPass,
  }
}

export function getEnvEmailSettings(): EmailSettings {
  return {
    imapHost: process.env.IMAP_HOST || DEFAULTS.imapHost,
    imapPort: Number(process.env.IMAP_PORT || DEFAULTS.imapPort),
    imapUser: process.env.IMAP_USER || "",
    imapPass: process.env.IMAP_PASS || "",
  }
}
