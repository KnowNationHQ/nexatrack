"use client"

import PageShell from "@/components/page-shell"

export default function FeaturePage() {
  return (
    <PageShell activePage="feature">
      <div className="container-fluid page-header py-5" style={{ marginBottom: "6rem" }}>
        <div className="container py-5">
          <h1 className="display-3 text-white mb-3 animated slideInDown">Features</h1>
          <nav aria-label="breadcrumb animated slideInDown">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a className="text-white" href="/">Home</a></li>
              <li className="breadcrumb-item"><a className="text-white" href="/">Pages</a></li>
              <li className="breadcrumb-item text-white active" aria-current="page">Features</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container-fluid overflow-hidden py-5 px-lg-0">
        <div className="container feature py-5 px-lg-0">
          <div className="row g-5 mx-lg-0">
            <div className="col-lg-6 feature-text wow fadeInUp" data-wow-delay="0.1s">
              <h6 className="text-secondary text-uppercase mb-3">Our Features</h6>
              <h1 className="mb-5">We Are Trusted Courier Service Since 1990</h1>
              <div className="d-flex mb-5 wow fadeInUp" data-wow-delay="0.3s">
                <i className="fa fa-globe text-primary fa-3x flex-shrink-0"></i>
                <div className="ms-4">
                  <h5>Florida-Wide Coverage</h5>
                  <p className="mb-0">Nexatrack covers every corner of Florida with a robust delivery network that ensures your parcels reach any destination in the Sunshine State.</p>
                </div>
              </div>
              <div className="d-flex mb-5 wow fadeIn" data-wow-delay="0.5s">
                <i className="fa fa-shipping-fast text-primary fa-3x flex-shrink-0"></i>
                <div className="ms-4">
                  <h5>On Time Delivery</h5>
                  <p className="mb-0">We prioritize punctuality with optimized routes and real-time tracking to guarantee on-time delivery every time.</p>
                </div>
              </div>
              <div className="d-flex mb-0 wow fadeInUp" data-wow-delay="0.7s">
                <i className="fa fa-headphones text-primary fa-3x flex-shrink-0"></i>
                <div className="ms-4">
                  <h5>24/7 Telephone Support</h5>
                  <p className="mb-0">Our dedicated customer support team is available around the clock to assist with inquiries and tracking updates.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-6 pe-lg-0 wow fadeInRight" data-wow-delay="0.1s" style={{ minHeight: "400px" }}>
              <div className="position-relative h-100">
                <img className="position-absolute img-fluid w-100 h-100" src="/img/feature.jpg" style={{ objectFit: "cover" }} alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
