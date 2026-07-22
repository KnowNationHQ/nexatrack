"use client"

import { useState } from "react"
import PageShell from "@/components/page-shell"

export default function FreeQuotePage() {
  const [qf, setQf] = useState({ name: "", email: "", mobile: "", service: "Select Service Type", note: "" })

  async function handleQuote(e: React.FormEvent) {
    e.preventDefault()
    await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "quote", name: qf.name, email: qf.email, mobile: qf.mobile, serviceType: qf.service, message: qf.note }),
    })
    setQf({ name: "", email: "", mobile: "", service: "Select Service Type", note: "" })
    alert("Thank you! We will get back to you with a free quote shortly.")
  }

  return (
    <PageShell activePage="free-quote">
      <div className="container-fluid page-header py-5" style={{ marginBottom: "6rem" }}>
        <div className="container py-5">
          <h1 className="display-3 text-white mb-3 animated slideInDown">Quote</h1>
          <nav aria-label="breadcrumb animated slideInDown">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a className="text-white" href="/">Home</a></li>
              <li className="breadcrumb-item"><a className="text-white" href="/">Pages</a></li>
              <li className="breadcrumb-item text-white active" aria-current="page">Quote</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container-xxl py-5">
        <div className="container py-5">
          <div className="row g-5 align-items-center">
            <div className="col-lg-5 wow fadeInUp" data-wow-delay="0.1s">
              <h6 className="text-secondary text-uppercase mb-3">Get A Quote</h6>
              <h1 className="mb-5">Request A Free Quote!</h1>
              <p className="mb-5">Get a personalized shipping quote tailored to your needs. Whether it is a single document or a bulk shipment, Nexatrack offers competitive rates and flexible delivery options across Florida.</p>
              <div className="d-flex align-items-center">
                <i className="fa fa-headphones fa-2x flex-shrink-0 bg-primary p-3 text-white"></i>
                <div className="ps-4">
                  <h6>Call for any query!</h6>
                  <h3 className="text-primary m-0">+1 305 555 0199</h3>
                </div>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="bg-light text-center p-5 wow fadeIn" data-wow-delay="0.5s">
                <form onSubmit={handleQuote}>
                  <div className="row g-3">
                    <div className="col-12 col-sm-6">
                      <input type="text" className="form-control border-0" placeholder="Your Name" style={{ height: "55px" }} value={qf.name} onChange={e => setQf({...qf, name: e.target.value})} required />
                    </div>
                    <div className="col-12 col-sm-6">
                      <input type="email" className="form-control border-0" placeholder="Your Email" style={{ height: "55px" }} value={qf.email} onChange={e => setQf({...qf, email: e.target.value})} required />
                    </div>
                    <div className="col-12 col-sm-6">
                      <input type="text" className="form-control border-0" placeholder="Your Mobile" style={{ height: "55px" }} value={qf.mobile} onChange={e => setQf({...qf, mobile: e.target.value})} />
                    </div>
                    <div className="col-12 col-sm-6">
                      <select className="form-select border-0" style={{ height: "55px" }} value={qf.service} onChange={e => setQf({...qf, service: e.target.value})}>
                        <option value="Select Service Type">Select Service Type</option>
                        <option value="Express Delivery">Express Delivery</option>
                        <option value="International Shipping">International Shipping</option>
                        <option value="Bulk Logistics">Bulk Logistics</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <textarea className="form-control border-0" placeholder="Special Note" style={{ height: "100px" }} value={qf.note} onChange={e => setQf({...qf, note: e.target.value})}></textarea>
                    </div>
                    <div className="col-12">
                      <button className="btn btn-primary w-100 py-3" type="submit">Submit</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
