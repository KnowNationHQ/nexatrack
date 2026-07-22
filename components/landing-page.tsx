"use client"

import { useEffect } from "react"
import ChatWidget from "@/components/chat-widget"

const CSS_LINKS = [
  "https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/css/bootstrap.min.css",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.0/css/all.min.css",
  "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css",
  "https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css",
  "https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css",
  "https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.theme.default.min.css",
]

const JS_SCRIPTS = [
  "https://code.jquery.com/jquery-3.4.1.min.js",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/wow/1.1.2/wow.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.4.1/jquery.easing.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/waypoints/4.0.1/jquery.waypoints.min.js",
]

const TEMPLATE_CSS = `
:root { --primary: #FF3E41; --secondary: #51CFED; --light: #F8F2F0; --dark: #060315; }
:root { --bs-primary: #FF3E41; --bs-primary-rgb: 255,62,65; --bs-secondary: #51CFED; --bs-secondary-rgb: 81,207,237; --bs-dark: #060315; --bs-dark-rgb: 6,3,21; --bs-light: #F8F2F0; --bs-light-rgb: 248,242,240; }
.bg-dark { background-color: #060315 !important; }
.bg-light { background-color: #F8F2F0 !important; }
.text-primary { color: #FF3E41 !important; }
.text-secondary { color: #51CFED !important; }
.border-primary { border-color: #FF3E41 !important; }
.btn-primary { background-color: #FF3E41 !important; border-color: #FF3E41 !important; }
.btn-secondary { background-color: #51CFED !important; border-color: #51CFED !important; }
.bg-brand { background-color: #0F1F33 !important; }
.text-brand { color: #0F1F33 !important; }
.border-brand { border-color: #0F1F33 !important; }
.btn-primary { --bs-btn-hover-bg:#e63538; --bs-btn-hover-border-color:#e63538; --bs-btn-active-bg:#cc2f32; --bs-btn-active-border-color:#cc2f32; }
.btn-secondary { --bs-btn-hover-bg:#45b8d4; --bs-btn-hover-border-color:#45b8d4; --bs-btn-active-bg:#3aa3be; --bs-btn-active-border-color:#3aa3be; }
.fw-medium { font-weight: 600 !important; }
.back-to-top { position: fixed; display: none; right: 45px; bottom: 45px; z-index: 99; }
#spinner { opacity: 0; visibility: hidden; transition: opacity .5s ease-out, visibility 0s linear .5s; z-index: 99999; }
#spinner.show { transition: opacity .5s ease-out, visibility 0s linear 0s; visibility: visible; opacity: 1; }
.btn { font-weight: 600; transition: .5s; }
.btn.btn-primary, .btn.btn-secondary { color: #FFFFFF; }
.btn-square { width: 38px; height: 38px; }
.btn-sm-square { width: 32px; height: 32px; }
.btn-lg-square { width: 48px; height: 48px; }
.btn-square, .btn-sm-square, .btn-lg-square { padding: 0; display: flex; align-items: center; justify-content: center; font-weight: normal; }
.navbar .dropdown-toggle::after { border: none; content: "\\f107"; font-family: "Font Awesome 5 Free"; font-weight: 900; vertical-align: middle; margin-left: 8px; }
.navbar-light .navbar-nav .nav-link { position: relative; margin-right: 30px; padding: 25px 0; color: #FFFFFF; font-size: 15px; text-transform: uppercase; outline: none; }
.navbar-dark .navbar-nav .nav-link:hover, .navbar-dark .navbar-nav .nav-link.active { color: var(--primary); }
@media (max-width: 991.98px) { .navbar-dark .navbar-nav .nav-link { margin-right: 0; padding: 12px 20px; } .navbar-dark .navbar-nav { border-top: 1px solid rgba(255,255,255,.1); padding-bottom: 10px; } .nav-item.dropdown .dropdown-toggle::after { float: right; margin-top: 8px; } .nav-item.dropdown .dropdown-menu { position: static !important; background: transparent !important; border: none !important; padding-left: 20px; display: block !important; opacity: 1 !important; visibility: visible !important; } .nav-item.dropdown .dropdown-menu .dropdown-item { color: rgba(255,255,255,.55); padding: 8px 20px; font-size: 14px; } .nav-item.dropdown .dropdown-menu .dropdown-item:hover { color: var(--primary); background: transparent; } }
.navbar-dark .navbar-brand, .navbar-dark a.btn { height: 75px; }
.navbar-dark .navbar-nav .nav-link { color: rgba(255,255,255,.8); font-weight: 500; }
.navbar-dark.sticky-top { top: -100px; transition: .5s; }
@media (min-width: 992px) { .navbar-dark .navbar-nav .nav-link::before { position: absolute; content: ""; width: 0; height: 5px; top: -6px; left: 50%; background: var(--primary); transition: .5s; } .navbar-dark .navbar-nav .nav-link:hover::before, .navbar-dark .navbar-nav .nav-link.active::before { width: 100%; left: 0; } .navbar-dark .navbar-nav .nav-link.nav-contact::before { display: none; } .navbar .nav-item .dropdown-menu { display: block; border: none; margin-top: 0; top: 150%; opacity: 0; visibility: hidden; transition: .5s; } .navbar .nav-item:hover .dropdown-menu { top: 100%; visibility: visible; transition: .5s; opacity: 1; } }
@media (max-width: 768px) { .header-carousel .owl-carousel-item { position: relative; min-height: 500px; } .header-carousel .owl-carousel-item img { position: absolute; width: 100%; height: 100%; object-fit: cover; } .header-carousel .owl-carousel-item h5, .header-carousel .owl-carousel-item p { font-size: 14px !important; font-weight: 400 !important; } .header-carousel .owl-carousel-item h1 { font-size: 30px; font-weight: 600; } }
.header-carousel .owl-nav { position: absolute; top: 50%; right: 8%; transform: translateY(-50%); display: flex; flex-direction: column; }
.header-carousel .owl-nav .owl-prev, .header-carousel .owl-nav .owl-next { margin: 7px 0; width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; color: #FFFFFF; background: transparent; border: 1px solid #FFFFFF; border-radius: 45px; font-size: 22px; transition: .5s; }
.header-carousel .owl-nav .owl-prev:hover, .header-carousel .owl-nav .owl-next:hover { background: var(--primary); border-color: var(--primary); }
.page-header { background: linear-gradient(rgba(6, 3, 21, .5), rgba(6, 3, 21, .5)), url(/img/carousel-1.jpg) center center no-repeat; background-size: cover; }
.breadcrumb-item + .breadcrumb-item::before { color: var(--light); }
@media (min-width: 992px) { .container.about { max-width: 100% !important; } .about-text { padding-right: calc(((100% - 960px) / 2) + .75rem); } }
@media (min-width: 1200px) { .about-text { padding-right: calc(((100% - 1140px) / 2) + .75rem); } }
@media (min-width: 1400px) { .about-text { padding-right: calc(((100% - 1320px) / 2) + .75rem); } }
@media (min-width: 992px) { .container.feature { max-width: 100% !important; } .feature-text { padding-left: calc(((100% - 960px) / 2) + .75rem); } }
@media (min-width: 1200px) { .feature-text { padding-left: calc(((100% - 1140px) / 2) + .75rem); } }
@media (min-width: 1400px) { .feature-text { padding-left: calc(((100% - 1320px) / 2) + .75rem); } }
.service-item { box-shadow: 0 0 45px rgba(0, 0, 0, .07); }
.service-item img { transition: .5s; }
.service-item:hover img { transform: scale(1.1); }
.service-item a.btn-slide { position: relative; display: inline-block; overflow: hidden; font-size: 0; }
.service-item a.btn-slide i, .service-item a.btn-slide span { position: relative; height: 40px; padding: 0 15px; display: inline-flex; align-items: center; font-size: 16px; color: #FFFFFF; background: var(--primary); border-radius: 0 35px 35px 0; transition: .5s; z-index: 2; }
.service-item a.btn-slide span { padding-left: 0; left: -100%; z-index: 1; }
.service-item:hover a.btn-slide i { border-radius: 0; }
.service-item:hover a.btn-slide span { left: 0; }
.service-item a.btn-slide:hover i, .service-item a.btn-slide:hover span { background: var(--secondary); }
@media (min-width: 992px) { .container.contact-page { max-width: 100% !important; } .contact-page .contact-form { padding-left: calc(((100% - 960px) / 2) + .75rem); } }
@media (min-width: 1200px) { .contact-page .contact-form { padding-left: calc(((100% - 1140px) / 2) + .75rem); } }
@media (min-width: 1400px) { .contact-page .contact-form { padding-left: calc(((100% - 1320px) / 2) + .75rem); } }
.footer { background: linear-gradient(rgba(6, 3, 21, .5), rgba(6, 3, 21, .5)), url(/img/map.png) center center no-repeat; background-size: cover; }
.footer .btn.btn-social { margin-right: 5px; width: 35px; height: 35px; display: flex; align-items: center; justify-content: center; color: var(--light); border: 1px solid #FFFFFF; border-radius: 35px; transition: .3s; }
.footer .btn.btn-social:hover { color: var(--primary); }
.footer .btn.btn-link { display: block; margin-bottom: 5px; padding: 0; text-align: left; color: #FFFFFF; font-size: 15px; font-weight: normal; text-transform: capitalize; transition: .3s; }
.footer .btn.btn-link::before { position: relative; content: "\\f105"; font-family: "Font Awesome 5 Free"; font-weight: 900; margin-right: 10px; }
.footer .btn.btn-link:hover { letter-spacing: 1px; box-shadow: none; }
.footer .copyright { padding: 25px 0; font-size: 15px; border-top: 1px solid rgba(256, 256, 256, .1); }
.footer .copyright a { color: var(--light); }
`

function injectTags(type: "link" | "script", urls: string[]) {
  const tags: HTMLElement[] = []
  for (const url of urls) {
    if (type === "link") {
      const el = document.createElement("link")
      el.rel = "stylesheet"
      el.href = url
      document.head.appendChild(el)
      tags.push(el)
    } else {
      const el = document.createElement("script")
      el.src = url
      el.async = false
      document.body.appendChild(el)
      tags.push(el)
    }
  }
  return tags
}

export default function LandingPage() {
  useEffect(() => {
    const links = injectTags("link", CSS_LINKS)
    const scripts = injectTags("script", JS_SCRIPTS)
    const style = document.createElement("style")
    style.textContent = TEMPLATE_CSS
    document.head.appendChild(style)

    let loaded = 0
    const checkAll = () => {
      loaded++
      const $ = (window as any).jQuery
      if (loaded >= JS_SCRIPTS.length && $ && $.fn) {
        setTimeout(() => { if ($("#spinner").length > 0) $("#spinner").removeClass("show") }, 1)
        new (window as any).WOW().init()
        $(window).on("scroll", () => {
          if ($(window).scrollTop() > 300) $(".sticky-top").css("top", "0px")
          else $(".sticky-top").css("top", "-100px")
        })
        const $dropdown = $(".dropdown"), $dropdownToggle = $(".dropdown-toggle"), $dropdownMenu = $(".dropdown-menu"), showClass = "show"
        $(window).on("load resize", function(this: Window) {
          if (this.matchMedia("(min-width: 992px)").matches) {
            $dropdown.hover(
              function(this: any) { $(this).addClass(showClass); $(this).find($dropdownToggle).attr("aria-expanded", "true"); $(this).find($dropdownMenu).addClass(showClass) },
              function(this: any) { $(this).removeClass(showClass); $(this).find($dropdownToggle).attr("aria-expanded", "false"); $(this).find($dropdownMenu).removeClass(showClass) }
            )
          } else {
            $dropdown.off("mouseenter mouseleave")
            $dropdownToggle.off("click.dropdown")
            $dropdownToggle.on("click.dropdown", function(this: any) {
              const parent = $(this).parent()
              parent.toggleClass(showClass)
              parent.find($dropdownMenu).toggleClass(showClass)
            })
          }
        })
        $(window).on("scroll", () => { if ($(window).scrollTop() > 300) $(".back-to-top").fadeIn("slow"); else $(".back-to-top").fadeOut("slow") })
        $(".back-to-top").on("click", () => { $("html, body").animate({ scrollTop: 0 }, 1500, "easeInOutExpo"); return false })
        $(".header-carousel").owlCarousel({ autoplay: false, smartSpeed: 1500, items: 1, dots: false, loop: true, nav: true, navText: ['<i class="bi bi-chevron-left"></i>', '<i class="bi bi-chevron-right"></i>'] })
      }
    }
    for (const s of scripts) { s.onload = checkAll }
    checkAll()

    return () => {
      links.forEach(el => el.remove())
      scripts.forEach(el => el.remove())
      style.remove()
    }
  }, [])

  return (
    <>
      <div id="spinner" className="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
        <div className="spinner-grow text-primary" style={{ width: "3rem", height: "3rem" }} role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>

      <nav className="navbar navbar-expand-lg bg-dark navbar-dark shadow border-top border-3 border-brand sticky-top p-0">
        <a href="/" className="navbar-brand bg-brand d-flex align-items-center px-4 px-lg-5">
          <h2 className="mb-2 text-white">Nexatrack</h2>
        </a>
        <button type="button" className="navbar-toggler me-4" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarCollapse">
          <div className="navbar-nav ms-auto p-4 p-lg-0">
            <a href="/" className="nav-item nav-link active">Home</a>
            <a href="/about" className="nav-item nav-link">About</a>
            <a href="/service" className="nav-item nav-link">Services</a>
            <div className="nav-item dropdown">
              <a role="button" tabIndex={0} className="nav-link dropdown-toggle">Pages</a>
              <div className="dropdown-menu fade-up m-0">
                <a href="/track" className="dropdown-item">Tracking</a>
                <a href="/#features" className="dropdown-item">Features</a>
                <a href="/auth/register" className="dropdown-item">Free Quote</a>
              </div>
            </div>
            <a href="/contact" className="nav-item nav-link">Contact</a>
          </div>
          <h4 className="m-0 pe-lg-5 d-none d-lg-block text-white-50"><i className="fa fa-headphones text-white-50 me-3"></i>+1 305 555 0199</h4>
        </div>
      </nav>

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
                    <a href="/about" className="btn btn-primary py-md-3 px-md-5 me-3 animated slideInLeft">Read More</a>
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
                    <a href="/about" className="btn btn-primary py-md-3 px-md-5 me-3 animated slideInLeft">Read More</a>
                    <a href="/auth/register" className="btn btn-secondary py-md-3 px-md-5 animated slideInRight">Free Quote</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid overflow-hidden py-5 px-lg-0">
        <div className="container about py-5 px-lg-0">
          <div className="row g-5 mx-lg-0">
            <div className="col-lg-6 ps-lg-0 wow fadeInLeft" data-wow-delay="0.1s" style={{ minHeight: "400px" }}>
              <div className="position-relative h-100">
                <img className="position-absolute img-fluid w-100 h-100" src="/img/about.jpg" style={{ objectFit: "cover" }} alt="" />
              </div>
            </div>
            <div className="col-lg-6 about-text wow fadeInUp" data-wow-delay="0.3s">
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
            {[
              { img: "service-1.jpg", title: "Express Shipping", desc: "Fast and reliable express delivery for urgent parcels and documents across Florida." },
              { img: "service-2.jpg", title: "International Shipping", desc: "Seamless international shipping solutions with customs clearance and door-to-door delivery." },
              { img: "service-3.jpg", title: "Road Delivery", desc: "Ground shipping services for bulk items, with real-time tracking and scheduled delivery slots." },
              { img: "service-4.jpg", title: "Bulk Logistics", desc: "Cost-effective bulk shipping solutions for businesses with large-volume delivery needs." },
              { img: "service-5.jpg", title: "Customs Clearance", desc: "Expert handling of import and export documentation for smooth international shipping." },
              { img: "service-6.jpg", title: "Warehouse & Storage", desc: "Secure warehousing and inventory management solutions for businesses of all sizes." },
            ].map((s, i) => (
              <div key={s.title} className="col-md-6 col-lg-4 wow fadeInUp" data-wow-delay={`${0.3 + i * 0.2}s`}>
                <div className="service-item p-4">
                  <div className="overflow-hidden mb-4">
                    <img className="img-fluid" src={`/img/${s.img}`} alt="" />
                  </div>
                  <h4 className="mb-3">{s.title}</h4>
                  <p>{s.desc}</p>
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
            <div className="col-lg-6 pe-lg-0 wow fadeInRight" data-wow-delay="0.1s" style={{ minHeight: "400px" }}>
              <div className="position-relative h-100">
                <img className="position-absolute img-fluid w-100 h-100" src="/img/feature.jpg" style={{ objectFit: "cover" }} alt="" />
              </div>
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

      <div className="container-fluid bg-dark text-light footer pt-5 wow fadeIn" data-wow-delay="0.1s" style={{ marginTop: "6rem" }}>
        <div className="container py-5">
          <div className="row g-5">
            <div className="col-lg-3 col-md-6">
              <h4 className="text-light mb-4">Address</h4>
              <p className="mb-2"><i className="fa fa-map-marker-alt me-3"></i>Miami, FL 33101, USA</p>
              <p className="mb-2"><i className="fa fa-phone-alt me-3"></i>+1 305 555 0199</p>
              <p className="mb-2"><i className="fa fa-envelope me-3"></i>info@nexatrack.com</p>
              <div className="d-flex pt-2">
                <a className="btn btn-outline-light btn-social" href="#"><i className="fab fa-twitter"></i></a>
                <a className="btn btn-outline-light btn-social" href="#"><i className="fab fa-facebook-f"></i></a>
                <a className="btn btn-outline-light btn-social" href="#"><i className="fab fa-youtube"></i></a>
                <a className="btn btn-outline-light btn-social" href="#"><i className="fab fa-linkedin-in"></i></a>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <h4 className="text-light mb-4">Services</h4>
              <a className="btn btn-link" href="/service">Express Shipping</a>
              <a className="btn btn-link" href="/service">International Shipping</a>
              <a className="btn btn-link" href="/service">Road Delivery</a>
              <a className="btn btn-link" href="/service">Courier Solutions</a>
              <a className="btn btn-link" href="/service">Bulk Logistics</a>
            </div>
            <div className="col-lg-3 col-md-6">
              <h4 className="text-light mb-4">Quick Links</h4>
              <a className="btn btn-link" href="/about">About Us</a>
              <a className="btn btn-link" href="/contact">Contact Us</a>
              <a className="btn btn-link" href="/service">Our Services</a>
              <a className="btn btn-link" href="/auth/register">Get a Quote</a>
              <a className="btn btn-link" href="/track">Track Parcel</a>
            </div>
            <div className="col-lg-3 col-md-6">
              <h4 className="text-light mb-4">Newsletter</h4>
              <p>Stay informed about our latest services and promotions.</p>
              <div className="position-relative mx-auto" style={{ maxWidth: "400px" }}>
                <input className="form-control border-0 w-100 py-3 ps-4 pe-5" type="text" placeholder="Your email" />
                <button type="button" className="btn btn-primary py-2 position-absolute top-0 end-0 mt-2 me-2">SignUp</button>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="copyright">
            <div className="row">
              <div className="col-12 text-center">
                &copy; <a className="border-bottom" href="/">Nexatrack Express Courier Services</a>, All Right Reserved.
              </div>
            </div>
          </div>
        </div>
      </div>

      <a href="#" className="btn btn-lg btn-primary btn-lg-square rounded-0 back-to-top"><i className="bi bi-arrow-up"></i></a>

      <ChatWidget />
    </>
  )
}
