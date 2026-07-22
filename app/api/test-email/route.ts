import { NextResponse } from "next/server"
import { sendEmail } from "@/lib/email"

export async function POST(req: Request) {
  try {
    const { to } = await req.json()
    if (!to) return NextResponse.json({ error: "email required" }, { status: 400 })
    const result = await sendEmail({ to, subject: "Nexatrack Email Test", html: "<h1>Test</h1><p>If you see this, email is working.</p>" })
    if (!result.success) return NextResponse.json({ error: result.error }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}
