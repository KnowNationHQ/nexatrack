import nodemailer from "nodemailer"
import { visitorContact, visitorQuote, adminContact, adminQuote, newsletterNotification } from "@/lib/email-templates"

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
    const body = await req.json()
    const { type, email, name, message, mobile, subject, serviceType } = body
    const adminTo = "Info@nexatrackcourierservices.com"

    if (type === "newsletter") {
      const t = newsletterNotification(email)
      await transporter.sendMail({ from: process.env.SMTP_FROM, to: adminTo, subject: t.subject, html: t.html })
    } else if (type === "quote") {
      const [visitor, admin] = await Promise.all([
        transporter.sendMail({ from: process.env.SMTP_FROM, to: email, subject: visitorQuote(name).subject, html: visitorQuote(name).html }),
        transporter.sendMail({ from: process.env.SMTP_FROM, to: adminTo, subject: adminQuote(name, email, mobile, serviceType, message).subject, html: adminQuote(name, email, mobile, serviceType, message).html }),
      ])
    } else {
      const [visitor, admin] = await Promise.all([
        transporter.sendMail({ from: process.env.SMTP_FROM, to: email, subject: visitorContact(name, subject).subject, html: visitorContact(name, subject).html }),
        transporter.sendMail({ from: process.env.SMTP_FROM, to: adminTo, subject: adminContact(name, email, subject, message).subject, html: adminContact(name, email, subject, message).html }),
      ])
    }

    return Response.json({ success: true })
  } catch (err) {
    console.error("Email send error:", err)
    return Response.json({ success: false, error: "Failed to send email" }, { status: 500 })
  }
}