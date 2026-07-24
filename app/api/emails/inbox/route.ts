import { fetchInbox } from "@/lib/imap"

export async function GET() {
  try {
    const emails = await fetchInbox(50)
    return Response.json({ emails })
  } catch (e: any) {
    console.error("IMAP fetch error:", e.message)
    return Response.json({ error: e.message }, { status: 500 })
  }
}
