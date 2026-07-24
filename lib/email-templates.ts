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
          <p style="margin:0;font-size:13px;color:#888">+1 (506) 501-4402 &bull; <a href="${BRAND.url}" style="color:${BRAND.color};text-decoration:none">nexatrackcourierservices.com</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function ctaBtn(url: string, label: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px 0 4px"><tr><td align="center">
    <a href="${url}" style="display:inline-block;padding:12px 28px;background:${BRAND.color};color:#fff;font-size:15px;font-weight:600;text-decoration:none;border-radius:8px">${label}</a>
  </td></tr></table>`
}

export function trackingUpdate(opts: { name: string; trackingNumber: string; status: string; statusLabel: string; origin?: string; dest?: string; eta?: string; trackUrl: string }) {
  return {
    subject: `Shipment ${opts.trackingNumber} is now ${opts.statusLabel}`,
    html: htmlWrap(`
      <p style="margin:0 0 4px;font-size:15px;color:#555">Hi ${opts.name},</p>
      <p style="margin:0 0 16px;font-size:15px;color:#555;line-height:1.5">Your shipment has a new status update.</p>
      <div style="text-align:center;margin:0 0 20px">
        <span style="display:inline-block;padding:6px 16px;border-radius:20px;font-size:14px;font-weight:600;background:rgba(255,62,65,.12);color:#dc2626">${opts.statusLabel}</span>
      </div>
      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin:0 0 16px">
        <tr><td style="padding:6px 0;font-size:13px;color:#888;border-bottom:1px solid #eee;width:80px">Tracking</td><td style="padding:6px 0;font-size:14px;color:#333;border-bottom:1px solid #eee;font-family:monospace">${opts.trackingNumber}</td></tr>
        ${opts.origin ? `<tr><td style="padding:6px 0;font-size:13px;color:#888;border-bottom:1px solid #eee">Origin</td><td style="padding:6px 0;font-size:14px;color:#333;border-bottom:1px solid #eee">${opts.origin}</td></tr>` : ""}
        ${opts.dest ? `<tr><td style="padding:6px 0;font-size:13px;color:#888;border-bottom:1px solid #eee">Destination</td><td style="padding:6px 0;font-size:14px;color:#333;border-bottom:1px solid #eee">${opts.dest}</td></tr>` : ""}
        ${opts.eta ? `<tr><td style="padding:6px 0;font-size:13px;color:#888;border-bottom:1px solid #eee">ETA</td><td style="padding:6px 0;font-size:14px;color:#333;border-bottom:1px solid #eee">${opts.eta}</td></tr>` : ""}
      </table>
      ${ctaBtn(opts.trackUrl, "Track Shipment")}
      <p style="margin:16px 0 0;font-size:13px;color:#999">You'll receive another update when the status changes again.</p>
    `),
  }
}

export function deliveryConfirmed(opts: { name: string; trackingNumber: string; podPhotoUrl?: string; podSignatureUrl?: string; dest?: string; deliveredAt: string }) {
  return {
    subject: `Package delivered — ${opts.trackingNumber}`,
    html: htmlWrap(`
      <div style="text-align:center;margin:0 0 20px">
        <div style="font-size:40px;margin-bottom:8px">✅</div>
        <h2 style="margin:0 0 4px;font-size:22px;color:#16a34a">Delivered!</h2>
        <p style="margin:0;font-size:15px;color:#555">Your package has been delivered successfully.</p>
      </div>
      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin:0 0 16px">
        <tr><td style="padding:6px 0;font-size:13px;color:#888;border-bottom:1px solid #eee;width:80px">Tracking</td><td style="padding:6px 0;font-size:14px;color:#333;border-bottom:1px solid #eee;font-family:monospace">${opts.trackingNumber}</td></tr>
        <tr><td style="padding:6px 0;font-size:13px;color:#888;border-bottom:1px solid #eee">Delivered at</td><td style="padding:6px 0;font-size:14px;color:#333;border-bottom:1px solid #eee">${opts.deliveredAt}</td></tr>
        ${opts.dest ? `<tr><td style="padding:6px 0;font-size:13px;color:#888;border-bottom:1px solid #eee">Location</td><td style="padding:6px 0;font-size:14px;color:#333;border-bottom:1px solid #eee">${opts.dest}</td></tr>` : ""}
      </table>
      ${opts.podPhotoUrl ? `<div style="margin:0 0 16px"><p style="margin:0 0 6px;font-size:13px;color:#888">Delivery Photo</p><img src="${opts.podPhotoUrl}" alt="" style="max-width:100%;border-radius:8px;border:1px solid #eee"></div>` : ""}
      ${opts.podSignatureUrl ? `<div style="margin:0 0 16px"><p style="margin:0 0 6px;font-size:13px;color:#888">Signature</p><img src="${opts.podSignatureUrl}" alt="" style="max-width:240px;border-radius:6px;border:1px solid #eee;background:#1a1a2e"></div>` : ""}
      <p style="margin:16px 0 0;font-size:13px;color:#999">Thank you for shipping with ${BRAND.name}.</p>
    `),
  }
}

export function invoiceReceipt(opts: { name: string; trackingNumber: string; amount: string; paidAt: string; invoiceUrl: string }) {
  return {
    subject: `Receipt for shipment ${opts.trackingNumber}`,
    html: htmlWrap(`
      <h2 style="margin:0 0 16px;font-size:20px;color:#111">Payment Receipt</h2>
      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin:0 0 16px">
        <tr><td style="padding:8px 0;font-size:13px;color:#888;border-bottom:1px solid #eee;width:100px">Tracking</td><td style="padding:8px 0;font-size:14px;color:#333;border-bottom:1px solid #eee;font-family:monospace">${opts.trackingNumber}</td></tr>
        <tr><td style="padding:8px 0;font-size:13px;color:#888;border-bottom:1px solid #eee">Amount</td><td style="padding:8px 0;font-size:14px;color:#333;border-bottom:1px solid #eee;font-weight:600">${opts.amount}</td></tr>
        <tr><td style="padding:8px 0;font-size:13px;color:#888;border-bottom:1px solid #eee">Date</td><td style="padding:8px 0;font-size:14px;color:#333;border-bottom:1px solid #eee">${opts.paidAt}</td></tr>
        <tr><td style="padding:8px 0;font-size:13px;color:#888;border-bottom:1px solid #eee">Status</td><td style="padding:8px 0;font-size:14px;color:#333;border-bottom:1px solid #eee"><span style="display:inline-block;padding:2px 10px;border-radius:12px;font-size:12px;font-weight:600;background:rgba(34,197,94,.12);color:#16a34a">Paid</span></td></tr>
      </table>
      ${ctaBtn(opts.invoiceUrl, "View Invoice")}
    `),
  }
}

export function walletTopUp(opts: { name: string; amount: string; newBalance: string; date: string }) {
  return {
    subject: "Wallet top-up confirmed",
    html: htmlWrap(`
      <h2 style="margin:0 0 16px;font-size:20px;color:#111">Top-Up Confirmed</h2>
      <p style="margin:0 0 16px;font-size:15px;color:#555">Hi ${opts.name}, your wallet has been topped up successfully.</p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin:0 0 16px">
        <tr><td style="padding:8px 0;font-size:13px;color:#888;border-bottom:1px solid #eee;width:100px">Amount</td><td style="padding:8px 0;font-size:14px;color:#333;border-bottom:1px solid #eee;font-weight:600">${opts.amount}</td></tr>
        <tr><td style="padding:8px 0;font-size:13px;color:#888;border-bottom:1px solid #eee">New Balance</td><td style="padding:8px 0;font-size:14px;color:#333;border-bottom:1px solid #eee;font-weight:600">${opts.newBalance}</td></tr>
        <tr><td style="padding:8px 0;font-size:13px;color:#888;border-bottom:1px solid #eee">Date</td><td style="padding:8px 0;font-size:14px;color:#333;border-bottom:1px solid #eee">${opts.date}</td></tr>
      </table>
    `),
  }
}

export function welcomeMerchant(opts: { name: string; email: string; loginUrl: string }) {
  return {
    subject: `Welcome to ${BRAND.name}!`,
    html: htmlWrap(`
      <h2 style="margin:0 0 6px;font-size:20px;color:#111">Welcome, ${opts.name}!</h2>
      <p style="margin:0 0 16px;font-size:15px;color:#555;line-height:1.5">Your merchant account has been created. You can now create shipments, track deliveries, and manage your account from the merchant dashboard.</p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="background:#f9f9fb;border-radius:8px;padding:16px 20px;margin:0 0 20px">
        <tr><td style="font-size:13px;color:#888;padding-bottom:4px">Your login details</td></tr>
        <tr><td style="font-size:14px;color:#333;padding-bottom:2px"><strong>Email:</strong> ${opts.email}</td></tr>
        <tr><td style="font-size:14px;color:#333">Use the password provided by your admin to sign in.</td></tr>
      </table>
      ${ctaBtn(opts.loginUrl, "Open Dashboard")}
      <p style="margin:12px 0 0;font-size:13px;color:#999">Need help? Reply to this email or call +1 (506) 501-4402.</p>
    `),
  }
}

export function welcomeDriver(opts: { name: string; email: string; loginUrl: string }) {
  return {
    subject: `Welcome to the ${BRAND.name} fleet!`,
    html: htmlWrap(`
      <h2 style="margin:0 0 6px;font-size:20px;color:#111">Welcome aboard, ${opts.name}!</h2>
      <p style="margin:0 0 16px;font-size:15px;color:#555;line-height:1.5">You've been registered as a delivery driver. Your dashboard will show assigned shipments, route information, and delivery updates.</p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="background:#f9f9fb;border-radius:8px;padding:16px 20px;margin:0 0 20px">
        <tr><td style="font-size:13px;color:#888;padding-bottom:4px">Getting started</td></tr>
        <tr><td style="font-size:14px;color:#333;line-height:1.6">1. Sign in with your email and password<br>2. Check for assigned shipments<br>3. Update delivery status as you go</td></tr>
      </table>
      ${ctaBtn(opts.loginUrl, "View Dashboard")}
      <p style="margin:12px 0 0;font-size:13px;color:#999">Questions? Contact dispatch at +1 (506) 501-4402.</p>
    `),
  }
}

export function passwordReset(opts: { name: string; resetUrl: string }) {
  return {
    subject: "Reset your Nexatrack password",
    html: htmlWrap(`
      <h2 style="margin:0 0 16px;font-size:20px;color:#111">Password Reset</h2>
      <p style="margin:0 0 16px;font-size:15px;color:#555;line-height:1.5">Hi ${opts.name}, we received a request to reset your password. Click the button below to set a new one.</p>
      ${ctaBtn(opts.resetUrl, "Reset Password")}
      <p style="margin:16px 0 0;font-size:13px;color:#888">This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
    `),
  }
}

export function visitorContact(name: string, subject: string) {
  return {
    subject: `We received your message – ${BRAND.name}`,
    html: htmlWrap(`
      <h2 style="margin:0 0 6px;font-size:20px;color:#111">Thanks for reaching out, ${name}!</h2>
      <p style="margin:0 0 20px;font-size:15px;color:#555;line-height:1.5">We received your message regarding <strong>${subject || "your inquiry"}</strong>. Our team typically responds within 24 hours.</p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="background:#f9f9fb;border-radius:8px;padding:16px 20px;margin:0 0 24px">
        <tr><td style="font-size:13px;color:#888;padding-bottom:4px">What happens next?</td></tr>
        <tr><td style="font-size:14px;color:#333;line-height:1.6">1. We review your message<br>2. A team member is assigned<br>3. You receive a reply via email</td></tr>
      </table>
      <p style="margin:0;font-size:14px;color:#555">In the meantime, track shipments or request a quote at <a href="${BRAND.url}" style="color:${BRAND.color}">nexatrackcourierservices.com</a>.</p>
    `),
  }
}

export function visitorQuote(name: string) {
  return {
    subject: `Your Free Quote Request – ${BRAND.name}`,
    html: htmlWrap(`
      <h2 style="margin:0 0 6px;font-size:20px;color:#111">Quote request received, ${name}!</h2>
      <p style="margin:0 0 20px;font-size:15px;color:#555;line-height:1.5">Thanks for your interest in shipping with Nexatrack. We're preparing a free quote tailored to your needs.</p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="background:#f9f9fb;border-radius:8px;padding:16px 20px;margin:0 0 24px">
        <tr><td style="font-size:13px;color:#888;padding-bottom:4px">What happens next?</td></tr>
        <tr><td style="font-size:14px;color:#333;line-height:1.6">1. We review your requirements<br>2. A quote is calculated<br>3. You receive it via email within 24h</td></tr>
      </table>
      <p style="margin:0;font-size:14px;color:#555">Questions? Call us at <strong>+1 (506) 501-4402</strong> or reply to this email.</p>
    `),
  }
}

export function adminContact(name: string, email: string, subject: string, message: string) {
  return {
    subject: `[Nexatrack] Contact Form from ${name}`,
    html: htmlWrap(`
      <h2 style="margin:0 0 16px;font-size:18px;color:#111">New Contact Form Submission</h2>
      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin:0 0 20px">
        <tr><td style="padding:8px 0;font-size:13px;color:#888;border-bottom:1px solid #eee;width:80px;vertical-align:top">Name</td><td style="padding:8px 0;font-size:14px;color:#333;border-bottom:1px solid #eee">${name}</td></tr>
        <tr><td style="padding:8px 0;font-size:13px;color:#888;border-bottom:1px solid #eee;vertical-align:top">Email</td><td style="padding:8px 0;font-size:14px;color:#333;border-bottom:1px solid #eee"><a href="mailto:${email}" style="color:${BRAND.color}">${email}</a></td></tr>
        <tr><td style="padding:8px 0;font-size:13px;color:#888;border-bottom:1px solid #eee;vertical-align:top">Subject</td><td style="padding:8px 0;font-size:14px;color:#333;border-bottom:1px solid #eee">${subject || "N/A"}</td></tr>
        <tr><td style="padding:8px 0;font-size:13px;color:#888;vertical-align:top">Message</td><td style="padding:8px 0;font-size:14px;color:#333;line-height:1.5">${message || "N/A"}</td></tr>
      </table>
      <p style="margin:0;font-size:13px;color:#999">Received at ${new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
    `),
  }
}

export function adminQuote(name: string, email: string, mobile: string, serviceType: string, message: string) {
  return {
    subject: `[Nexatrack] New Quote Request from ${name}`,
    html: htmlWrap(`
      <h2 style="margin:0 0 16px;font-size:18px;color:#111">New Quote Request</h2>
      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin:0 0 20px">
        <tr><td style="padding:8px 0;font-size:13px;color:#888;border-bottom:1px solid #eee;width:80px;vertical-align:top">Name</td><td style="padding:8px 0;font-size:14px;color:#333;border-bottom:1px solid #eee">${name}</td></tr>
        <tr><td style="padding:8px 0;font-size:13px;color:#888;border-bottom:1px solid #eee;vertical-align:top">Email</td><td style="padding:8px 0;font-size:14px;color:#333;border-bottom:1px solid #eee"><a href="mailto:${email}" style="color:${BRAND.color}">${email}</a></td></tr>
        <tr><td style="padding:8px 0;font-size:13px;color:#888;border-bottom:1px solid #eee;vertical-align:top">Mobile</td><td style="padding:8px 0;font-size:14px;color:#333;border-bottom:1px solid #eee">${mobile || "N/A"}</td></tr>
        <tr><td style="padding:8px 0;font-size:13px;color:#888;border-bottom:1px solid #eee;vertical-align:top">Service</td><td style="padding:8px 0;font-size:14px;color:#333;border-bottom:1px solid #eee">${serviceType || "N/A"}</td></tr>
        <tr><td style="padding:8px 0;font-size:13px;color:#888;vertical-align:top">Notes</td><td style="padding:8px 0;font-size:14px;color:#333;line-height:1.5">${message || "N/A"}</td></tr>
      </table>
      <p style="margin:0;font-size:13px;color:#999">Received at ${new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
    `),
  }
}

export function newsletterNotification(email: string) {
  return {
    subject: "[Nexatrack] New Newsletter Subscription",
    html: htmlWrap(`
      <h2 style="margin:0 0 16px;font-size:18px;color:#111">New Newsletter Subscriber</h2>
      <p style="margin:0 0 4px;font-size:14px;color:#333"><strong>Email:</strong> <a href="mailto:${email}" style="color:${BRAND.color}">${email}</a></p>
      <p style="margin:0;font-size:13px;color:#999">Signed up at ${new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
    `),
  }
}