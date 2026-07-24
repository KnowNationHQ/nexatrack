import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function POST(req: Request) {
  try {
    const { to, subject, text } = await req.json()
    if (!to || !subject || !text) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }
    await transporter.sendMail({
      from: `"Nexatrack" <${process.env.IMAP_USER || process.env.SMTP_USER}>`,
      to,
      subject,
      html: text.replace(/\n/g, "<br>"),
    })
    return Response.json({ success: true })
  } catch (e: any) {
    console.error("Send email error:", e.message)
    return Response.json({ error: e.message }, { status: 500 })
  }
}
