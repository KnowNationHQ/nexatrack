"use client"

import { useEffect, useState, ReactNode } from "react"
import SmartsuppChat from "@/components/smartsupp-chat"
import LanguageSwitcher from "@/components/language-switcher"

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
.bg-primary { background-color: #FF3E41 !important; }
.text-primary { color: #FF3E41 !important; }
.text-secondary { color: #51CFED !important; }
.border-primary { border-color: #FF3E41 !important; }
.text-dark { color: #060315 !important; }
.btn-primary { background-color: #FF3E41 !important; border-color: #FF3E41 !important; }
.btn-secondary { background-color: #51CFED !important; border-color: #51CFED !important; }
.bg-brand { background-color: #060315 !important; }
.text-brand { color: #060315 !important; }
.border-brand { border-color: #060315 !important; }
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
.navbar-light .navbar-nav .nav-link { position: relative; margin-right: 30px; padding: 25px 0; color: #060315; font-size: 15px; text-transform: uppercase; outline: none; }
.navbar-dark .navbar-nav .nav-link:hover, .navbar-dark .navbar-nav .nav-link.active, .navbar-light .navbar-nav .nav-link:hover, .navbar-light .navbar-nav .nav-link.active { color: var(--primary); }
@media (max-width: 991.98px) { .sticky-top { top: 0 !important; } #navbarCollapse:not(.show-nav) { display: none !important; } #navbarCollapse.show-nav { display: block !important; } .navbar-collapse { position: absolute; top: 100%; left: 0; right: 0; background: #FFFFFF; z-index: 1000; max-height: calc(100vh - 75px); overflow-y: auto; } .navbar-nav .nav-link { margin-right: 0; padding: 14px 20px; font-size: 15px; color: #060315 !important; } .navbar-nav { padding: 10px 0; } .nav-item.dropdown .dropdown-toggle::after { float: right; margin-top: 8px; } .nav-item.dropdown .dropdown-menu { position: static !important; background: transparent !important; border: none !important; padding-left: 24px; } .nav-item.dropdown .dropdown-menu:not(.show) { display: none; } .nav-item.dropdown .dropdown-menu .dropdown-item { color: #333; padding: 10px 20px; font-size: 14px; } .nav-item.dropdown .dropdown-menu .dropdown-item:hover { color: var(--primary); background: transparent; } }
@media (min-width: 768px) and (max-width: 991.98px) { .navbar-collapse { left: auto; right: 12px; max-width: 380px; border-radius: 0 0 8px 8px; } }
.navbar .navbar-brand, .navbar a.btn { height: 75px; }
.navbar-nav .nav-link { font-weight: 500; }
@media (min-width: 992px) { .navbar-expand-lg .navbar-collapse { display: flex !important; flex-basis: auto; } .navbar-expand-lg .navbar-nav { flex-direction: row; } .navbar-nav .nav-link::before { position: absolute; content: ""; width: 0; height: 5px; top: -6px; left: 50%; background: var(--primary); transition: .5s; } .navbar-nav .nav-link:hover::before, .navbar-nav .nav-link.active::before { width: 100%; left: 0; } .navbar-nav .nav-link.nav-contact::before { display: none; } .navbar .nav-item .dropdown-menu { display: block; border: none; margin-top: 0; top: 150%; opacity: 0; visibility: hidden; transition: .5s; box-shadow: 0 0.5rem 1rem rgba(0,0,0,.1); } .navbar .nav-item:hover .dropdown-menu { top: 100%; visibility: visible; transition: .5s; opacity: 1; } }
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
@media (max-width: 575.98px) { .service-item { padding: 1rem !important; } .service-item h4 { font-size: 1rem; } .service-item p { font-size: 0.85rem; } }
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
.footer .btn.btn-social:hover { color: #FFF; background: var(--primary); border-color: var(--primary); }
.footer .btn.btn-link { display: block; margin-bottom: 5px; padding: 0; text-align: left; color: #FFFFFF; font-size: 15px; font-weight: normal; text-transform: capitalize; transition: .3s; }
.footer .btn.btn-link::before { position: relative; content: "\\f105"; font-family: "Font Awesome 5 Free"; font-weight: 900; margin-right: 10px; }
.footer .btn.btn-link:hover { letter-spacing: 1px; box-shadow: none; }
.footer .copyright { padding: 25px 0; font-size: 15px; border-top: 1px solid rgba(256, 256, 256, .1); }
.footer .copyright a { color: var(--light); }
::-webkit-scrollbar { width: 10px; }
::-webkit-scrollbar-track { background: var(--light); }
::-webkit-scrollbar-thumb { background: var(--primary); border-radius: 5px; }
::-webkit-scrollbar-thumb:hover { background: #e63538; }
* { scrollbar-width: thin; scrollbar-color: var(--primary) var(--light); }
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

export default function PageShell({ children, activePage }: { children: ReactNode; activePage: string }) {
  const [newsletterEmail, setNewsletterEmail] = useState("")

  async function handleNewsletter(e: React.FormEvent) {
    e.preventDefault()
    await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "newsletter", email: newsletterEmail }),
    })
    setNewsletterEmail("")
    alert("Thank you for subscribing!")
  }

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
        const $dropdown = $(".dropdown"), $dropdownToggle = $(".dropdown-toggle"), $dropdownMenu = $(".dropdown-menu"), showClass = "show"
        ;(function setupDropdowns() {
          if (window.matchMedia("(min-width: 992px)").matches) {
            $dropdown.hover(
              function(this: any) { $(this).addClass(showClass); $(this).find($dropdownToggle).attr("aria-expanded", "true"); $(this).find($dropdownMenu).addClass(showClass) },
              function(this: any) { $(this).removeClass(showClass); $(this).find($dropdownToggle).attr("aria-expanded", "false"); $(this).find($dropdownMenu).removeClass(showClass) }
            )
          } else {
            $dropdown.off("mouseenter mouseleave")
            $dropdownToggle.off("click.dropdown")
            $dropdownToggle.on("click.dropdown", function(this: any, e: any) {
              e.stopPropagation()
              const parent = $(this).parent()
              parent.toggleClass(showClass)
              parent.find($dropdownMenu).toggleClass(showClass)
            })
          }
        })()
        $(window).on("resize", function(this: Window) {
          if (this.matchMedia("(min-width: 992px)").matches) {
            $("#navbarCollapse").removeClass("show-nav")
            $dropdown.off("mouseenter mouseleave")
            $dropdownToggle.off("click.dropdown")
            $dropdown.hover(
              function(this: any) { $(this).addClass(showClass); $(this).find($dropdownToggle).attr("aria-expanded", "true"); $(this).find($dropdownMenu).addClass(showClass) },
              function(this: any) { $(this).removeClass(showClass); $(this).find($dropdownToggle).attr("aria-expanded", "false"); $(this).find($dropdownMenu).removeClass(showClass) }
            )
          } else {
            $dropdown.off("mouseenter mouseleave")
            $dropdownToggle.off("click.dropdown")
            $dropdownToggle.on("click.dropdown", function(this: any, e: any) {
              e.stopPropagation()
              const parent = $(this).parent()
              parent.toggleClass(showClass)
              parent.find($dropdownMenu).toggleClass(showClass)
            })
          }
        })
        $(window).on("scroll", () => { if ($(window).scrollTop() > 300) $(".back-to-top").fadeIn("slow"); else $(".back-to-top").fadeOut("slow") })
        $(".back-to-top").on("click", () => { $("html, body").animate({ scrollTop: 0 }, 1500, "easeInOutExpo"); return false })
        const carousel = $(".header-carousel")
        if (carousel.length) {
          carousel.owlCarousel({ autoplay: false, smartSpeed: 1500, items: 1, dots: false, loop: true, nav: true, navText: ['<i class="bi bi-chevron-left"></i>', '<i class="bi bi-chevron-right"></i>'] })
        }
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

      <nav className="navbar navbar-expand-lg bg-white navbar-light shadow-sm sticky-top p-0">
        <a href="/" className="navbar-brand bg-primary d-flex align-items-center px-4 px-lg-5">
          <h2 className="mb-2 text-white">Nexatrack</h2>
        </a>
        <button type="button" className="navbar-toggler me-4" id="navbarToggle" onClick={() => document.getElementById("navbarCollapse")?.classList.toggle("show-nav")}>
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="navbar-collapse" id="navbarCollapse" onClick={(e) => { const t = (e.target as HTMLElement).closest(".nav-link:not(.dropdown-toggle)"); if (t && window.innerWidth < 992) document.getElementById("navbarCollapse")?.classList.remove("show-nav") }}>
          <div className="navbar-nav ms-auto p-4 p-lg-0">
            <a href="/" className={'nav-item nav-link' + (activePage === 'home' ? ' active' : '')}>Home</a>
            <a href="/about" className={'nav-item nav-link' + (activePage === 'about' ? ' active' : '')}>About</a>
            <a href="/service" className={'nav-item nav-link' + (activePage === 'service' ? ' active' : '')}>Services</a>
            <div className="nav-item dropdown">
              <a role="button" tabIndex={0} className="nav-link dropdown-toggle" onClick={(e) => { if (window.innerWidth < 992) { const m = e.currentTarget.nextElementSibling; if (m) m.classList.toggle("show"); } }}>Resources</a>
              <div className="dropdown-menu fade-up m-0">
                <a href="/track" className="dropdown-item">Tracking</a>
                <a href="/#features" className="dropdown-item">Features</a>
                <a href="/auth/register" className="dropdown-item">Free Quote</a>
              </div>
            </div>
            <a href="/contact" className={'nav-item nav-link' + (activePage === 'contact' ? ' active' : '')}>Contact</a>
            <div className="d-lg-none px-3 py-2 border-top mt-2 pt-3"><LanguageSwitcher /></div>
          </div>
          <div className="d-none d-lg-flex align-items-center gap-2 pe-lg-4"><LanguageSwitcher /><h4 className="m-0 text-dark"><i className="fa fa-headphones text-dark me-3"></i>+1 (506) 501-4402</h4></div>
        </div>
      </nav>

      {children}

      <div className="container-fluid bg-dark text-light footer pt-5 wow fadeIn" data-wow-delay="0.1s" style={{ marginTop: "6rem" }}>
        <div className="container py-5">
          <div className="row g-5">
            <div className="col-lg-3 col-md-6">
              <h4 className="text-light mb-4">Address</h4>
              <p className="mb-2"><i className="fa fa-map-marker-alt me-3"></i>Citrus Park, FL 11950 Sheldon Road. Tampa 33626</p>
              <p className="mb-2"><i className="fa fa-phone-alt me-3"></i><a href="tel:+15065014402" className="text-light text-decoration-none">+1 (506) 501-4402</a></p>
              <p className="mb-2"><i className="fab fa-whatsapp me-3"></i><a href="https://wa.me/15065014402" target="_blank" rel="noopener noreferrer" className="text-light text-decoration-none">+1 (506) 501-4402</a></p>
              <p className="mb-2"><i className="fa fa-envelope me-3"></i>Info@nexatrackcourierservices.com</p>
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
              <a className="btn btn-link" href="/privacy">Privacy Policy</a>
            </div>
            <div className="col-lg-3 col-md-6">
              <h4 className="text-light mb-4">Newsletter</h4>
              <p>Stay informed about our latest services and promotions.</p>
              <form className="position-relative mx-auto" style={{ maxWidth: "400px" }} onSubmit={handleNewsletter}>
                <input className="form-control border-0 w-100 py-3 ps-4 pe-5" type="email" placeholder="Your email" name="email" value={newsletterEmail} onChange={e => setNewsletterEmail(e.target.value)} required />
                <button type="submit" className="btn btn-primary py-2 position-absolute top-0 end-0 mt-2 me-2">SignUp</button>
              </form>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="copyright">
            <div className="row">
              <div className="col-12 text-center">
                &copy; <a className="border-bottom" href="/">Nexatrack Courier Services</a>, All Right Reserved.
              </div>
            </div>
          </div>
        </div>
      </div>

      <a href="#" className="btn btn-lg btn-primary btn-lg-square rounded-0 back-to-top"><i className="bi bi-arrow-up"></i></a>

      <SmartsuppChat />
    </>
  )
}
