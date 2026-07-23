"use client"

import PageShell from "@/components/page-shell"

export default function PrivacyPage() {
  return (
    <PageShell activePage="privacy">
      <div className="container-fluid page-header py-5" style={{ marginBottom: "6rem" }}>
        <div className="container py-5">
          <h1 className="display-3 text-white mb-3 animated slideInDown">Privacy Policy</h1>
          <nav aria-label="breadcrumb animated slideInDown">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a className="text-white" href="/">Home</a></li>
              <li className="breadcrumb-item"><a className="text-white" href="/">Pages</a></li>
              <li className="breadcrumb-item text-white active" aria-current="page">Privacy Policy</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container-xxl py-5">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <p className="text-muted mb-4"><em>Last updated: July 22, 2026</em></p>

              <h2 className="mb-4">1. Introduction</h2>
              <p className="mb-5">Nexatrack Courier Services ("Nexatrack," "we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our courier and delivery services. Please read this policy carefully. If you do not agree with the terms, do not access the site or use our services.</p>

              <h2 className="mb-4">2. Information We Collect</h2>
              <h5 className="mb-3">Personal Data</h5>
              <p className="mb-4">We may collect personally identifiable information such as your name, email address, phone number, mailing address, and payment details when you: request a quote, create an account, schedule a pickup, track a shipment, or contact us.</p>
              <h5 className="mb-3">Derivative Data</h5>
              <p className="mb-4">Our servers automatically collect information your browser sends whenever you visit. This includes your IP address, browser type, operating system, access times, and the pages you viewed directly before and after accessing the site.</p>
              <h5 className="mb-3">Cookies &amp; Tracking Technologies</h5>
              <p className="mb-5">We use cookies and similar tracking technologies (such as the Smartsupp live chat widget) to improve your browsing experience, analyze site traffic, and provide customer support. You can control cookie preferences through your browser settings.</p>

              <h2 className="mb-4">3. How We Use Your Information</h2>
              <p className="mb-5">We use the information we collect to: process and deliver shipments, send transactional updates and tracking notifications, respond to inquiries and provide customer support, send marketing communications (with your consent), improve our website and services, comply with legal obligations and prevent fraud.</p>

              <h2 className="mb-4">4. GDPR Compliance (General Data Protection Regulation)</h2>
              <p className="mb-5">If you are a resident of the European Economic Area (EEA), you have the following rights under the GDPR:</p>
              <div className="row g-4 mb-5">
                {[
                  { title: "Right to Access", desc: "Request a copy of the personal data we hold about you." },
                  { title: "Right to Rectification", desc: "Request correction of inaccurate or incomplete data." },
                  { title: "Right to Erasure", desc: "Request deletion of your personal data where there is no compelling reason for its continued processing." },
                  { title: "Right to Restrict Processing", desc: "Request restriction of processing your personal data in certain circumstances." },
                  { title: "Right to Data Portability", desc: "Request transfer of your data to another organization in a machine-readable format." },
                  { title: "Right to Object", desc: "Object to processing of your personal data for direct marketing or legitimate interests." },
                ].map((r, i) => (
                  <div key={i} className="col-md-6">
                    <div className="d-flex">
                      <i className="fa fa-check-circle text-primary fa-2x flex-shrink-0 mt-1"></i>
                      <div className="ms-3">
                        <h5>{r.title}</h5>
                        <p className="mb-0">{r.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mb-5">To exercise any of these rights, please contact us at <strong>Info@nexatrackcourierservices.com</strong>. We will respond to your request within 30 days.</p>

              <h2 className="mb-4">5. Lawful Basis for Processing (GDPR)</h2>
              <p className="mb-5">We process your personal data under the following lawful bases: <strong>Contractual necessity</strong> — to fulfill shipment and delivery requests; <strong>Consent</strong> — for marketing communications and non-essential cookies; <strong>Legitimate interests</strong> — to improve our services, prevent fraud, and ensure network security; and <strong>Legal obligation</strong> — to comply with applicable laws and regulatory requirements.</p>

              <h2 className="mb-4">6. Data Retention</h2>
              <p className="mb-5">We retain your personal data only as long as necessary to fulfill the purposes described in this policy, or as required by law. Shipment records and transaction data are retained for the period required by applicable tax and accounting regulations. When data is no longer needed, we securely delete or anonymize it.</p>

              <h2 className="mb-4">7. Data Security</h2>
              <p className="mb-5">We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. This includes SSL/TLS encryption, access controls, secure data storage, and regular security audits. However, no method of transmission over the Internet is 100% secure.</p>

              <h2 className="mb-4">8. Third-Party Services</h2>
              <p className="mb-5">We may share your data with trusted third parties who assist us in operating our website and services, including payment processors, shipping carriers, and analytics providers. These third parties are contractually obligated to keep your data confidential and process it only for the specified purposes. We use <strong>Smartsupp</strong> for live chat support — your chat interactions are subject to Smartsupp's privacy policy.</p>

              <h2 className="mb-4">9. CCPA — California Privacy Rights</h2>
              <p className="mb-5">California residents have the right to: request disclosure of categories and specific pieces of personal data collected; request deletion of personal data; opt out of the sale of personal data (we do not sell your data). To exercise your CCPA rights, email <strong>Info@nexatrackcourierservices.com</strong>.</p>

              <h2 className="mb-4">10. International Data Transfers</h2>
              <p className="mb-5">Your information may be transferred to and processed in countries outside your country of residence, including the United States. We ensure appropriate safeguards are in place through Standard Contractual Clauses or equivalent mechanisms to protect your data in accordance with GDPR requirements.</p>

              <h2 className="mb-4">11. Children's Privacy</h2>
              <p className="mb-5">Our services are not directed to individuals under the age of 16. We do not knowingly collect personal data from children. If we become aware that a child has provided us with personal data, we will take steps to delete such information promptly.</p>

              <h2 className="mb-4">12. Changes to This Policy</h2>
              <p className="mb-5">We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on this page with a revised "Last updated" date. We encourage you to review this policy periodically.</p>

              <h2 className="mb-4">13. Contact Us</h2>
              <p className="mb-2">If you have questions or concerns about this Privacy Policy or wish to exercise your data protection rights, please contact us:</p>
              <div className="bg-light p-4 rounded mb-4">
                <p className="mb-1"><strong>Email:</strong> Info@nexatrackcourierservices.com</p>
                <p className="mb-1"><strong>Phone:</strong> +1 (506) 501-4402</p>
                <p className="mb-1"><strong>WhatsApp:</strong> +1 (506) 501-4402</p>
                <p className="mb-1"><strong>Address:</strong> Citrus Park, FL 11950 Sheldon Road. Tampa 33626</p>
                <p className="mb-0"><strong>DPO:</strong> Data Protection Officer — Info@nexatrackcourierservices.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
