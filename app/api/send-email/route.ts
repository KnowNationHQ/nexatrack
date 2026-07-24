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

const BRAND = { name: "Nexatrack Courier Services", color: "#FF3E41", url: "https://nexatrackcourierservices.com" }

function htmlWrap(body: string) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f6;padding:24px 0">
    <tr><td align="center">
      <table role="presentation" width="540" cellpadding="0" cellspacing="0" style="max-width:540px;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.06)">
        <tr><td style="background:${BRAND.color};padding:28px 32px;text-align:center">
          <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;letter-spacing:-.3px">${BRAND.name}</h1>
        </td></tr>
        <tr><td style="padding:32px">
          ${body}
        </td></tr>
        <tr><td style="background:#fafafa;padding:20px 32px;text-align:center;border-top:1px solid #eee">
          <p style="margin:0 0 4px;font-size:13px;color:#888">${BRAND.name} &bull; Citrus Park, FL 11950 Sheldon Road. Tampa 33626</p>
          <p style="margin:0;font-size:13px;color:#888">+1 (506) 501-4402 &bull; <a href="${BRAND.url}" style="color:${BRAND.color};text-decoration:none">${BRAND.url.replace("https://","")}</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function visitorContactHtml(name: string, subject: string) {
  return htmlWrap(`
    <h2 style="margin:0 0 6px;font-size:20px;color:#111">Thanks for reaching out, ${name}!</h2>
    <p style="margin:0 0 20px;font-size:15px;color:#555;line-height:1.5">We received your message regarding <strong>${subject || "your inquiry"}</strong>. Our team typically responds within 24 hours.</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="background:#f9f9fb;border-radius:8px;padding:16px 20px;margin:0 0 24px">
      <tr><td style="font-size:13px;color:#888;padding-bottom:4px">What happens next?</td></tr>
      <tr><td style="font-size:14px;color:#333;line-height:1.6">1. We review your message<br>2. A team member is assigned<br>3. You receive a reply via email</td></tr>
    </table>
    <p style="margin:0;font-size:14px;color:#555">In the meantime, you can track shipments or request a quote at <a href="${BRAND.url}" style="color:${BRAND.color}">${BRAND.url.replace("https://","")}</a>.</p>
  `)
}

function visitorQuoteHtml(name: string) {
  return htmlWrap(`
    <h2 style="margin:0 0 6px;font-size:20px;color:#111">Quote request received, ${name}!</h2>
    <p style="margin:0 0 20px;font-size:15px;color:#555;line-height:1.5">Thanks for your interest in shipping with Nexatrack. We're preparing a free quote tailored to your needs.</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="background:#f9f9fb;border-radius:8px;padding:16px 20px;margin:0 0 24px">
      <tr><td style="font-size:13px;color:#888;padding-bottom:4px">What happens next?</td></tr>
      <tr><td style="font-size:14px;color:#333;line-height:1.6">1. We review your requirements<br>2. A quote is calculated<br>3. You receive it via email within 24h</td></tr>
    </table>
    <p style="margin:0;font-size:14px;color:#555">Questions? Call us at <strong>+1 (506) 501-4402</strong> or reply to this email.</p>
  `)
}

function adminContactHtml(name: string, email: string, subject: string, message: string) {
  return htmlWrap(`
    <h2 style="margin:0 0 16px;font-size:18px;color:#111">New Contact Form Submission</h2>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin:0 0 20px">
      <tr><td style="padding:8px 0;font-size:13px;color:#888;border-bottom:1px solid #eee;width:80px;vertical-align:top">Name</td><td style="padding:8px 0;font-size:14px;color:#333;border-bottom:1px solid #eee">${name}</td></tr>
      <tr><td style="padding:8px 0;font-size:13px;color:#888;border-bottom:1px solid #eee;vertical-align:top">Email</td><td style="padding:8px 0;font-size:14px;color:#333;border-bottom:1px solid #eee"><a href="mailto:${email}" style="color:${BRAND.color}">${email}</a></td></tr>
      <tr><td style="padding:8px 0;font-size:13px;color:#888;border-bottom:1px solid #eee;vertical-align:top">Subject</td><td style="padding:8px 0;font-size:14px;color:#333;border-bottom:1px solid #eee">${subject || "N/A"}</td></tr>
      <tr><td style="padding:8px 0;font-size:13px;color:#888;vertical-align:top">Message</td><td style="padding:8px 0;font-size:14px;color:#333;line-height:1.5">${message || "N/A"}</td></tr>
    </table>
    <p style="margin:0;font-size:13px;color:#999">Received at ${new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
  `)
}

function adminQuoteHtml(name: string, email: string, mobile: string, serviceType: string, message: string) {
  return htmlWrap(`
    <h2 style="margin:0 0 16px;font-size:18px;color:#111">New Quote Request</h2>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin:0 0 20px">
      <tr><td style="padding:8px 0;font-size:13px;color:#888;border-bottom:1px solid #eee;width:80px;vertical-align:top">Name</td><td style="padding:8px 0;font-size:14px;color:#333;border-bottom:1px solid #eee">${name}</td></tr>
      <tr><td style="padding:8px 0;font-size:13px;color:#888;border-bottom:1px solid #eee;vertical-align:top">Email</td><td style="padding:8px 0;font-size:14px;color:#333;border-bottom:1px solid #eee"><a href="mailto:${email}" style="color:${BRAND.color}">${email}</a></td></tr>
      <tr><td style="padding:8px 0;font-size:13px;color:#888;border-bottom:1px solid #eee;vertical-align:top">Mobile</td><td style="padding:8px 0;font-size:14px;color:#333;border-bottom:1px solid #eee">${mobile || "N/A"}</td></tr>
      <tr><td style="padding:8px 0;font-size:13px;color:#888;border-bottom:1px solid #eee;vertical-align:top">Service</td><td style="padding:8px 0;font-size:14px;color:#333;border-bottom:1px solid #eee">${serviceType || "N/A"}</td></tr>
      <tr><td style="padding:8px 0;font-size:13px;color:#888;vertical-align:top">Notes</td><td style="padding:8px 0;font-size:14px;color:#333;line-height:1.5">${message || "N/A"}</td></tr>
    </table>
    <p style="margin:0;font-size:13px;color:#999">Received at ${new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
  `)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { type, email, name, message, mobile, subject, serviceType } = body
    const now = new Date()

    if (type === "newsletter") {
      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: "Info@nexatrackcourierservices.com",
        subject: `[Nexatrack] New Newsletter Subscription`,
        html: htmlWrap(`
          <h2 style="margin:0 0 16px;font-size:18px;color:#111">New Newsletter Subscriber</h2>
          <p style="margin:0 0 4px;font-size:14px;color:#333"><strong>Email:</strong> <a href="mailto:${email}" style="color:${BRAND.color}">${email}</a></p>
          <p style="margin:0;font-size:13px;color:#999">Signed up at ${now.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
        `),
      })
    } else if (type === "quote") {
      await Promise.all([
        transporter.sendMail({
          from: process.env.SMTP_FROM,
          to: email,
          subject: `Your Free Quote Request – ${BRAND.name}`,
          html: visitorQuoteHtml(name),
        }),
        transporter.sendMail({
          from: process.env.SMTP_FROM,
          to: "Info@nexatrackcourierservices.com",
          subject: `[Nexatrack] New Quote Request from ${name}`,
          html: adminQuoteHtml(name, email, mobile, serviceType, message),
        }),
      ])
    } else {
      await Promise.all([
        transporter.sendMail({
          from: process.env.SMTP_FROM,
          to: email,
          subject: `We received your message – ${BRAND.name}`,
          html: visitorContactHtml(name, subject),
        }),
        transporter.sendMail({
          from: process.env.SMTP_FROM,
          to: "Info@nexatrackcourierservices.com",
          subject: `[Nexatrack] Contact Form from ${name}`,
          html: adminContactHtml(name, email, subject, message),
        }),
      ])
    }

    return Response.json({ success: true })
  } catch (err) {
    console.error("Email send error:", err)
    return Response.json({ success: false, error: "Failed to send email" }, { status: 500 })
  }
}
