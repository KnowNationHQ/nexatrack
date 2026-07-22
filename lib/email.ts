import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: "support@nexatrackcourierservices.com",
    pass: "Nexatrack123!",
  },
})

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  try {
    await transporter.sendMail({ from: `"Nexatrack" <support@nexatrackcourierservices.com>`, to, subject, html })
    return { success: true }
  } catch (e: any) {
    console.error("Email error:", e.message)
    return { success: false, error: e.message }
  }
}
