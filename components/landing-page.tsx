"use client"

import PageShell from "@/components/page-shell"

export default function LandingPage() {
  return (
    <PageShell activePage="home">
      <div className="container-fluid p-0 pb-5">
        <div className="owl-carousel header-carousel position-relative mb-5">
          <div className="owl-carousel-item position-relative">
            <img className="img-fluid" src="/img/carousel-1.jpg" alt="" />
            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center" style={{ background: "rgba(6, 3, 21, .5)" }}>
              <div className="container">
                <div className="row justify-content-start">
                  <div className="col-10 col-lg-8">
                    <h5 className="text-white text-uppercase mb-3 animated slideInDown">Express &amp; Courier Services</h5>
                    <h1 className="display-3 text-white animated slideInDown mb-4">#1 Place For Your <span className="text-primary">Courier</span> Services</h1>
                    <p className="fs-5 fw-medium text-white mb-4 pb-2">From same-day delivery to statewide shipping, Nexatrack ensures your parcels arrive safely and on time every time.</p>
                    <a href="/track" className="btn btn-primary py-md-3 px-md-5 me-3 animated slideInLeft">Track</a>
                    <a href="/auth/register" className="btn btn-secondary py-md-3 px-md-5 animated slideInRight">Free Quote</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="owl-carousel-item position-relative">
            <img className="img-fluid" src="/img/carousel-2.jpg" alt="" />
            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center" style={{ background: "rgba(6, 3, 21, .5)" }}>
              <div className="container">
                <div className="row justify-content-start">
                  <div className="col-10 col-lg-8">
                    <h5 className="text-white text-uppercase mb-3 animated slideInDown">Express &amp; Courier Services</h5>
                    <h1 className="display-3 text-white animated slideInDown mb-4">#1 Place For Your <span className="text-primary">Express</span> Services</h1>
                    <p className="fs-5 fw-medium text-white mb-4 pb-2">Real-time tracking, professional handling, and reliable delivery across Florida and the Southeast USA.</p>
                    <a href="/track" className="btn btn-primary py-md-3 px-md-5 me-3 animated slideInLeft">Track</a>
                    <a href="/auth/register" className="btn btn-secondary py-md-3 px-md-5 animated slideInRight">Free Quote</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-xxl py-5">
        <div className="container py-5">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.1s">
              <h6 className="text-secondary text-uppercase mb-3">About Us</h6>
              <h1 className="mb-5">Quick Courier and Delivery Solutions</h1>
              <p className="mb-5">Nexatrack Express Courier Services is a trusted name in the Florida courier industry, offering fast, secure, and affordable delivery solutions across the Sunshine State. We leverage modern logistics technology to provide real-time tracking and seamless delivery experiences for businesses and individuals throughout the Southeast.</p>
              <div className="row g-4 mb-5">
                <div className="col-sm-6 wow fadeIn" data-wow-delay="0.5s">
                  <i className="fa fa-globe fa-3x text-primary mb-3"></i>
                  <h5>Florida-Wide Coverage</h5>
                  <p className="m-0">We deliver to every major city in Florida — from Miami to Jacksonville, Tampa to Orlando — with a network of reliable hubs.</p>
                </div>
                <div className="col-sm-6 wow fadeIn" data-wow-delay="0.7s">
                  <i className="fa fa-shipping-fast fa-3x text-primary mb-3"></i>
                  <h5>Timely Delivery Guarantee</h5>
                  <p className="m-0">Our streamlined operations ensure your packages reach their destination within the promised timeframe.</p>
                </div>
              </div>
              <a href="/service" className="btn btn-primary py-3 px-5">Explore More</a>
            </div>
            <div className="col-lg-6 wow fadeInRight d-flex" data-wow-delay="0.1s">
              <div className="flex-grow-1" style={{ background: "url(/img/about.jpg) center/cover no-repeat", minHeight: "400px" }}></div>
            </div>
          </div>
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

      <div className="container-fluid overflow-hidden py-5 px-lg-0">
        <div className="container feature py-5 px-lg-0">
          <div className="row g-5 mx-lg-0">
            <div className="col-lg-6 feature-text wow fadeInUp" data-wow-delay="0.1s">
              <h6 className="text-secondary text-uppercase mb-3">Our Features</h6>
              <h1 className="mb-5">We Are Trusted Courier Service Since 1990</h1>
              <div className="d-flex mb-5 wow fadeInUp" data-wow-delay="0.3s">
                <i className="fa fa-globe text-primary fa-3x flex-shrink-0"></i>
                <div className="ms-4">
                  <h5>Worldwide Service</h5>
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
            <div className="col-lg-6 pe-lg-0 wow fadeInRight d-flex" data-wow-delay="0.1s">
              <div className="flex-grow-1" style={{ background: "url(/img/feature.jpg) center/cover no-repeat", minHeight: "400px" }}></div>
            </div>
          </div>
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
                <form>
                  <div className="row g-3">
                    <div className="col-12 col-sm-6">
                      <input type="text" className="form-control border-0" placeholder="Your Name" style={{ height: "55px" }} />
                    </div>
                    <div className="col-12 col-sm-6">
                      <input type="email" className="form-control border-0" placeholder="Your Email" style={{ height: "55px" }} />
                    </div>
                    <div className="col-12 col-sm-6">
                      <input type="text" className="form-control border-0" placeholder="Your Mobile" style={{ height: "55px" }} />
                    </div>
                    <div className="col-12 col-sm-6">
                      <select className="form-select border-0" style={{ height: "55px" }}>
                        <option selected>Select Service Type</option>
                        <option value="1">Express Delivery</option>
                        <option value="2">International Shipping</option>
                        <option value="3">Bulk Logistics</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <textarea className="form-control border-0" placeholder="Special Note"></textarea>
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
