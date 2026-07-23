"use client"

import { useState } from "react"
import PageShell from "@/components/page-shell"

export default function ContactPage() {
  const [cf, setCf] = useState({ name: "", email: "", subject: "", message: "" })

  async function handleContact(e: React.FormEvent) {
    e.preventDefault()
    await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "contact", name: cf.name, email: cf.email, subject: cf.subject, message: cf.message }),
    })
    setCf({ name: "", email: "", subject: "", message: "" })
    alert("Thank you for your message! We'll get back to you shortly.")
  }

  return (
    <PageShell activePage="contact">
      <div className="container-fluid page-header py-5" style={{ marginBottom: "6rem" }}>
        <div className="container py-5">
          <h1 className="display-3 text-white mb-3 animated slideInDown">Contact Us</h1>
          <nav aria-label="breadcrumb animated slideInDown">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a className="text-white" href="/">Home</a></li>
              <li className="breadcrumb-item"><a className="text-white" href="/">Pages</a></li>
              <li className="breadcrumb-item text-white active" aria-current="page">Contact</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container-fluid overflow-hidden py-5 px-lg-0">
        <div className="container contact-page py-5 px-lg-0">
          <div className="row g-5 mx-lg-0">
            <div className="col-md-6 contact-form wow fadeIn" data-wow-delay="0.1s">
              <h6 className="text-secondary text-uppercase">Get In Touch</h6>
              <h1 className="mb-4">Contact For Any Query</h1>
              <div className="bg-light p-4">
                <form onSubmit={handleContact}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input type="text" className="form-control" id="name" placeholder="Your Name" value={cf.name} onChange={e => setCf({...cf, name: e.target.value})} required />
                        <label htmlFor="name">Your Name</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input type="email" className="form-control" id="email" placeholder="Your Email" value={cf.email} onChange={e => setCf({...cf, email: e.target.value})} required />
                        <label htmlFor="email">Your Email</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating">
                        <input type="text" className="form-control" id="subject" placeholder="Subject" value={cf.subject} onChange={e => setCf({...cf, subject: e.target.value})} required />
                        <label htmlFor="subject">Subject</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating">
                        <textarea className="form-control" placeholder="Leave a message here" id="message" style={{ height: "100px" }} value={cf.message} onChange={e => setCf({...cf, message: e.target.value})} required></textarea>
                        <label htmlFor="message">Message</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <button className="btn btn-primary w-100 py-3" type="submit">Send Message</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="col-md-6 pe-lg-0 wow fadeInRight" data-wow-delay="0.1s">
              <div className="position-relative h-100 md:min-h-[400px]" style={{ minHeight: "250px" }}>
                <iframe className="position-absolute w-100 h-100" style={{ objectFit: "cover", border: 0 }}
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56346.11901384147!2d-82.632783!3d28.082255!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88c2f8f1f1f1f1f1%3A0x1f1f1f1f1f1f1f1f!2sTampa%2C+FL!5e0!3m2!1sen!2sus!4v1"
                  allowFullScreen aria-hidden="false" tabIndex={0}></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
