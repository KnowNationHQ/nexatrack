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
    const body = await req.json()
    const { type, email, name, message, mobile, subject, serviceType } = body

    let subjectLine = `[Nexatrack] `
    let textBody = ""

    if (type === "newsletter") {
      subjectLine += `New Newsletter Subscription`
      textBody = `Email: ${email}`
    } else if (type === "quote") {
      subjectLine += `New Quote Request`
      textBody = `Name: ${name}\nEmail: ${email}\nMobile: ${mobile || "N/A"}\nService Type: ${serviceType || "N/A"}\nMessage: ${message || "N/A"}`
    } else {
      subjectLine += `New Contact Form Message`
      textBody = `Name: ${name}\nEmail: ${email}\nSubject: ${subject || "N/A"}\nMessage: ${message || "N/A"}`
    }

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.NOTIFICATION_EMAIL,
      subject: subjectLine,
      text: textBody,
    })

    return Response.json({ success: true })
  } catch (err) {
    console.error("Email send error:", err)
    return Response.json({ success: false, error: "Failed to send email" }, { status: 500 })
  }
}
