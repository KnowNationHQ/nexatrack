import { ImapFlow } from "imapflow"
import { getEmailSettings } from "./email-settings"

type Email = {
  id: string
  subject: string
  from: { name: string; address: string }
  date: string
  text: string
  html: string
  seen: boolean
  flags: string[]
  messageId: string
}

function stripHtml(src: string): string {
  return src.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()
}

function extractHtml(src: string): string {
  const m = src.match(/<html[\s\S]*?<\/html>/i)
  return m ? m[0] : ""
}

export async function fetchInbox(limit = 50): Promise<Email[]> {
  const s = await getEmailSettings()

  const client = new ImapFlow({
    host: s.imapHost,
    port: s.imapPort,
    secure: true,
    auth: { user: s.imapUser, pass: s.imapPass },
    logger: false,
  })

  try {
    await client.connect()
    const mailbox = await client.mailboxOpen("INBOX")
    const total = mailbox.exists
    const start = Math.max(1, total - limit + 1)
    const seq = `${start}:${total}`

    const emails: Email[] = []
    for await (const msg of client.fetch(seq, {
      uid: true, envelope: true, source: true, flags: true, internalDate: true,
    })) {
      const envelope = msg.envelope!
      const src = msg.source!.toString("utf-8")
      emails.push({
        id: String(msg.uid),
        subject: envelope.subject || "(no subject)",
        from: { name: envelope.from?.[0]?.name || envelope.from?.[0]?.address || "Unknown", address: envelope.from?.[0]?.address || "" },
        date: msg.internalDate ? new Date(msg.internalDate).toISOString() : new Date().toISOString(),
        text: stripHtml(src).substring(0, 5000),
        html: extractHtml(src),
        seen: msg.flags ? !msg.flags.has("\\Seen") : true,
        flags: msg.flags ? Array.from(msg.flags) : [],
        messageId: envelope.messageId || "",
      })
    }

    return emails.reverse()
  } finally {
    await client.logout()
  }
}
