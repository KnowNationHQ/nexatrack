import ChatWidget from "@/components/chat-widget"
import { Phone, MapPin, Mail, Globe, Truck, Ship, Train, Warehouse, Shield, Headphones, ArrowRight, ChevronDown, Clock, Package } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: 'var(--main-bg)' }}>
      <nav className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '3px solid var(--accent)', backgroundColor: 'var(--card-bg)' }}>
        <a href="/" className="flex items-center gap-2" style={{ backgroundColor: 'var(--accent)', padding: '10px 24px', marginLeft: '-24px' }}>
          <span className="font-bold text-xl text-white">Nexatrack</span>
        </a>
        <div className="hidden lg:flex items-center gap-6 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          <a href="/" className="hover:text-[var(--accent)] transition-colors" style={{ color: 'var(--accent)' }}>Home</a>
          <a href="/about" className="hover:text-[var(--accent)] transition-colors">About</a>
          <a href="/service" className="hover:text-[var(--accent)] transition-colors">Services</a>
          <div className="relative group">
            <a href="#" className="flex items-center gap-1 hover:text-[var(--accent)] transition-colors">Pages <ChevronDown size={14} /></a>
            <div className="absolute top-full left-0 mt-0 w-44 rounded-lg border shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <a href="/track" className="block px-4 py-2 text-sm hover:text-[var(--accent)] transition-colors" style={{ borderBottom: '1px solid var(--card-border)' }}>Tracking</a>
              <a href="/#features" className="block px-4 py-2 text-sm hover:text-[var(--accent)] transition-colors" style={{ borderBottom: '1px solid var(--card-border)' }}>Features</a>
              <a href="/auth/register" className="block px-4 py-2 text-sm hover:text-[var(--accent)] transition-colors">Free Quote</a>
            </div>
          </div>
          <a href="/contact" className="hover:text-[var(--accent)] transition-colors">Contact</a>
        </div>
        <div className="hidden lg:flex items-center gap-2" style={{ color: 'var(--accent)' }}>
          <Phone size={16} />
          <span className="font-semibold text-sm">+1 305 555 0199</span>
        </div>
        <button className="lg:hidden p-2 rounded-lg" style={{ color: 'var(--text-secondary)' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
        </button>
      </nav>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(rgba(6,3,21,0.7), rgba(6,3,21,0.7)), radial-gradient(ellipse at center, rgba(255,62,65,0.1) 0%, transparent 60%)' }} className="py-24 md:py-32 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h5 className="text-sm uppercase tracking-widest mb-4" style={{ color: 'var(--accent)' }}>Express &amp; Courier Services</h5>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6" style={{ color: 'var(--text-primary)' }}>
            #1 Place For Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF3E41] to-[#ff6b6b]">Courier</span> Services
          </h1>
          <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            From same-day delivery to statewide shipping, Nexatrack ensures your parcels arrive safely and on time every time.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/about" className="px-8 py-3 rounded-xl text-white font-semibold text-sm transition-all shadow hover:shadow-[0_6px_24px_rgba(255,62,65,0.45)] hover:-translate-y-0.5" style={{ background: 'linear-gradient(135deg, #FF3E41, #d92e31)' }}>Read More</a>
            <a href="/auth/register" className="px-8 py-3 rounded-xl font-semibold text-sm transition-all border hover:border-[var(--accent)] hover:text-[var(--accent)]" style={{ borderColor: 'var(--card-border)', color: 'var(--text-secondary)' }}>Free Quote</a>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="px-6 py-16 md:py-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'var(--card-border)' }}>
            <div className="aspect-[4/3] flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(255,62,65,0.1), rgba(81,207,237,0.1))' }}>
              <Package size={80} style={{ color: 'var(--accent)', opacity: 0.3 }} />
            </div>
          </div>
          <div>
            <h6 className="text-sm uppercase tracking-widest mb-3" style={{ color: 'var(--accent)' }}>About Us</h6>
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Quick Courier and Delivery Solutions</h2>
            <p className="mb-8 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Nexatrack Express Courier Services is a trusted name in the Florida courier industry, offering fast, secure, and affordable delivery solutions across the Sunshine State. We leverage modern logistics technology to provide real-time tracking and seamless delivery experiences for businesses and individuals throughout the Southeast.
            </p>
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <div className="flex gap-4">
                <Globe size={32} className="shrink-0 mt-1" style={{ color: 'var(--accent)' }} />
                <div>
                  <h5 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Florida-Wide Coverage</h5>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>We deliver to every major city in Florida — from Miami to Jacksonville, Tampa to Orlando.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Truck size={32} className="shrink-0 mt-1" style={{ color: 'var(--accent)' }} />
                <div>
                  <h5 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Timely Delivery Guarantee</h5>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Our streamlined operations ensure your packages reach their destination within the promised timeframe.</p>
                </div>
              </div>
            </div>
            <a href="/service" className="inline-flex px-6 py-3 rounded-xl text-white font-semibold text-sm transition-all shadow hover:shadow-[0_6px_24px_rgba(255,62,65,0.45)] hover:-translate-y-0.5" style={{ background: 'linear-gradient(135deg, #FF3E41, #d92e31)' }}>Explore More</a>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="px-6 py-16 md:py-24" style={{ borderTop: '1px solid var(--card-border)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h6 className="text-sm uppercase tracking-widest mb-3" style={{ color: 'var(--accent)' }}>Our Services</h6>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>Explore Our Services</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Truck, title: "Express Shipping", desc: "Fast and reliable express delivery for urgent parcels and documents across Florida." },
              { icon: Ship, title: "International Shipping", desc: "Seamless international shipping solutions with customs clearance and door-to-door delivery." },
              { icon: Train, title: "Road Delivery", desc: "Ground shipping services for bulk items, with real-time tracking and scheduled delivery slots." },
              { icon: Package, title: "Bulk Logistics", desc: "Cost-effective bulk shipping solutions for businesses with large-volume delivery needs." },
              { icon: Shield, title: "Customs Clearance", desc: "Expert handling of import and export documentation for smooth international shipping." },
              { icon: Warehouse, title: "Warehouse & Storage", desc: "Secure warehousing and inventory management solutions for businesses of all sizes." },
            ].map((s) => {
              const Icon = s.icon
              return (
                <div key={s.title} className="rounded-xl border overflow-hidden transition-all hover:-translate-y-1" style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)' }}>
                  <div className="h-40 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(255,62,65,0.08), rgba(81,207,237,0.08))' }}>
                    <Icon size={48} style={{ color: 'var(--accent)', opacity: 0.4 }} />
                  </div>
                  <div className="p-5">
                    <h4 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{s.title}</h4>
                    <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>{s.desc}</p>
                    <a href="#" className="inline-flex items-center gap-1 text-sm font-medium hover:gap-2 transition-all" style={{ color: 'var(--accent)' }}>Read More <ArrowRight size={14} /></a>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-16 md:py-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h6 className="text-sm uppercase tracking-widest mb-3" style={{ color: 'var(--accent)' }}>Our Features</h6>
            <h2 className="text-3xl md:text-4xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>We Are Trusted Courier Service Since 1990</h2>
            <div className="space-y-8">
              {[
                { icon: Globe, title: "Worldwide Service", desc: "Nexatrack covers every corner of Florida with a robust delivery network that ensures your parcels reach any destination in the Sunshine State." },
                { icon: Truck, title: "On Time Delivery", desc: "We prioritize punctuality with optimized routes and real-time tracking to guarantee on-time delivery every time." },
                { icon: Headphones, title: "24/7 Telephone Support", desc: "Our dedicated customer support team is available around the clock to assist with inquiries and tracking updates." },
              ].map((f) => {
                const Icon = f.icon
                return (
                  <div key={f.title} className="flex gap-4">
                    <Icon size={36} className="shrink-0 mt-1" style={{ color: 'var(--accent)' }} />
                    <div>
                      <h5 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{f.title}</h5>
                      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{f.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'var(--card-border)' }}>
            <div className="aspect-[4/3] flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(81,207,237,0.1), rgba(255,62,65,0.1))' }}>
              <Shield size={80} style={{ color: 'var(--accent)', opacity: 0.3 }} />
            </div>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="px-6 py-16 md:py-24" style={{ borderTop: '1px solid var(--card-border)' }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-5 gap-12 items-center">
          <div className="md:col-span-2">
            <h6 className="text-sm uppercase tracking-widest mb-3" style={{ color: 'var(--accent)' }}>Get A Quote</h6>
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Request A Free Quote!</h2>
            <p className="mb-8 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Get a personalized shipping quote tailored to your needs. Whether it is a single document or a bulk shipment, Nexatrack offers competitive rates and flexible delivery options across Florida.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl" style={{ backgroundColor: 'var(--accent)' }}>
                <Headphones size={24} className="text-white" />
              </div>
              <div>
                <h6 className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Call for any query!</h6>
                <h3 style={{ color: 'var(--accent)' }} className="font-bold">+1 305 555 0199</h3>
              </div>
            </div>
          </div>
          <div className="md:col-span-3 p-8 rounded-xl border" style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)' }}>
            <div className="grid sm:grid-cols-2 gap-4">
              <input type="text" placeholder="Your Name" className="px-4 py-3 rounded-lg text-sm border outline-none transition-colors focus:border-[var(--accent)]" style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }} />
              <input type="email" placeholder="Your Email" className="px-4 py-3 rounded-lg text-sm border outline-none transition-colors focus:border-[var(--accent)]" style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }} />
              <input type="tel" placeholder="Your Mobile" className="px-4 py-3 rounded-lg text-sm border outline-none transition-colors focus:border-[var(--accent)]" style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }} />
              <select className="px-4 py-3 rounded-lg text-sm border outline-none transition-colors focus:border-[var(--accent)]" style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }}>
                <option>Select Service Type</option>
                <option>Express Delivery</option>
                <option>International Shipping</option>
                <option>Bulk Logistics</option>
              </select>
              <textarea placeholder="Special Note" rows={3} className="sm:col-span-2 px-4 py-3 rounded-lg text-sm border outline-none transition-colors focus:border-[var(--accent)]" style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }} />
              <button className="sm:col-span-2 px-6 py-3 rounded-xl text-white font-semibold text-sm transition-all shadow hover:shadow-[0_6px_24px_rgba(255,62,65,0.45)] hover:-translate-y-0.5" style={{ background: 'linear-gradient(135deg, #FF3E41, #d92e31)' }}>Submit</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#060315', borderTop: '1px solid var(--card-border)' }}>
        <div className="max-w-6xl mx-auto px-6 py-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Address</h4>
            <div className="space-y-3 text-sm" style={{ color: 'var(--text-muted)' }}>
              <p className="flex items-center gap-3"><MapPin size={14} className="shrink-0" style={{ color: 'var(--accent)' }} />Miami, FL 33101, USA</p>
              <p className="flex items-center gap-3"><Phone size={14} className="shrink-0" style={{ color: 'var(--accent)' }} />+1 305 555 0199</p>
              <p className="flex items-center gap-3"><Mail size={14} className="shrink-0" style={{ color: 'var(--accent)' }} />info@nexatrack.com</p>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Services</h4>
            <div className="flex flex-col gap-3 text-sm">
              {["Express Shipping", "International Shipping", "Road Delivery", "Courier Solutions", "Bulk Logistics"].map(s => (
                <a key={s} href="/service" className="hover:text-[var(--accent)] transition-colors" style={{ color: 'var(--text-muted)' }}>{s}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Quick Links</h4>
            <div className="flex flex-col gap-3 text-sm">
              {[
                { label: "About Us", href: "/about" },
                { label: "Contact Us", href: "/contact" },
                { label: "Our Services", href: "/service" },
                { label: "Get a Quote", href: "/auth/register" },
                { label: "Track Parcel", href: "/track" },
              ].map(l => (
                <a key={l.label} href={l.href} className="hover:text-[var(--accent)] transition-colors" style={{ color: 'var(--text-muted)' }}>{l.label}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Newsletter</h4>
            <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Stay informed about our latest services and promotions.</p>
            <div className="flex">
              <input type="email" placeholder="Your email" className="flex-1 px-4 py-3 rounded-l-lg text-sm border outline-none" style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }} />
              <button className="px-4 py-3 rounded-r-lg text-white font-semibold text-sm" style={{ backgroundColor: 'var(--accent)' }}>SignUp</button>
            </div>
          </div>
        </div>
        <div className="text-center py-6 text-sm" style={{ borderTop: '1px solid var(--card-border)', color: 'var(--text-muted)' }}>
          &copy; <a href="/" className="hover:text-[var(--accent)] transition-colors">Nexatrack Express Courier Services</a>, All Right Reserved.
        </div>
      </footer>

      <ChatWidget />
    </div>
  )
}
