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

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || `"Nexatrack" <Info@nexatrackcourierservices.com>`,
      to,
      subject,
      html,
    })
    return { success: true }
  } catch (e: any) {
    console.error("Email error:", e.message)
    return { success: false, error: e.message }
  }
}
