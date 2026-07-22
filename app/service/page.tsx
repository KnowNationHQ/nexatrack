"use client"

import PageShell from "@/components/page-shell"

export default function ServicePage() {
  return (
    <PageShell activePage="service">
      <div className="container-fluid page-header py-5" style={{ marginBottom: "6rem" }}>
        <div className="container py-5">
          <h1 className="display-3 text-white mb-3 animated slideInDown">Our Services</h1>
          <nav aria-label="breadcrumb animated slideInDown">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a className="text-white" href="/">Home</a></li>
              <li className="breadcrumb-item text-white active" aria-current="page">Services</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container-xxl py-5">
        <div className="container py-5">
          <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
            <h6 className="text-secondary text-uppercase">Our Services</h6>
            <h1 className="mb-5">Explore Our Services</h1>
          </div>
          <div className="row g-4">
            {[{ title: "Express Shipping", desc: "Fast and reliable express delivery for urgent parcels and documents across Florida.", img: "/img/service-1.jpg" },
              { title: "International Shipping", desc: "Seamless international shipping solutions with customs clearance and door-to-door delivery.", img: "/img/service-2.jpg" },
              { title: "Road Delivery", desc: "Ground shipping services for bulk items, with real-time tracking and scheduled delivery slots.", img: "/img/service-3.jpg" },
              { title: "Bulk Logistics", desc: "Cost-effective bulk shipping solutions for businesses with large-volume delivery needs.", img: "/img/service-4.jpg" },
              { title: "Customs Clearance", desc: "Expert handling of import and export documentation for smooth international shipping.", img: "/img/service-5.jpg" },
              { title: "Warehouse & Storage", desc: "Secure warehousing and inventory management solutions for businesses of all sizes.", img: "/img/service-6.jpg" },
            ].map((s, i) => (
              <div key={i} className="col-lg-4 col-md-6 col-sm-6 wow fadeInUp" data-wow-delay={`${0.1 + i * 0.1}s`}>
                <div className="service-item bg-light text-center p-5" style={{ height: "100%" }}>
                  <img className="img-fluid mb-4" src={s.img} alt={s.title} style={{ width: "80px", height: "80px", objectFit: "cover" }} />
                  <h4>{s.title}</h4>
                  <p className="mb-3">{s.desc}</p>
                  <a className="btn-slide mt-2" href="/service"><i className="fa fa-arrow-right"></i><span>Read More</span></a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  )
}
