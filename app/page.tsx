import ChatWidget from "@/components/chat-widget"
import { Package, Truck, MapPin, Clock, Shield, HeadphonesIcon } from "lucide-react"

const features = [
  { icon: Truck, title: "Same-Day Delivery", desc: "Florida-wide same-day delivery. We pick up and deliver within hours, not days." },
  { icon: MapPin, title: "Real-Time Tracking", desc: "Track every shipment live on the map. Know exactly where your package is at all times." },
  { icon: Clock, title: "Route Optimization", desc: "AI-powered route planning ensures your deliveries take the fastest path, every time." },
  { icon: Shield, title: "Proof of Delivery", desc: "Digital POD with photos and signatures. Full chain-of-custody for every parcel." },
  { icon: HeadphonesIcon, title: "24/7 Support", desc: "Live chat with our team. Real people, real answers, real fast." },
  { icon: Package, title: "Multi-Branch Network", desc: "Branches across Florida. Pickup and drop-off at any location, free of charge." },
]

const stats = [
  { value: "500+", label: "Deliveries/Day" },
  { value: "50+", label: "Florida Cities" },
  { value: "99.8%", label: "On-Time Rate" },
  { value: "200+", label: "Active Drivers" },
]

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: 'var(--main-bg)' }}>
      <nav className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--card-border)' }}>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF3E41] to-[#d92e31] text-sm font-bold text-white shadow-lg shadow-[#FF3E41]/20">N</div>
          <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Nexatrack</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="/auth/login" className="text-sm font-medium px-4 py-2 rounded-lg transition-colors hover:text-[var(--text-primary)]" style={{ color: 'var(--text-secondary)' }}>Sign In</a>
          <a href="/auth/register" className="text-sm font-medium px-4 py-2 rounded-lg text-white transition-all shadow hover:shadow-[0_4px_16px_rgba(255,62,65,0.4)] hover:-translate-y-0.5" style={{ background: 'linear-gradient(135deg, #FF3E41, #d92e31)' }}>Get Started</a>
        </div>
      </nav>

      <section className="flex flex-col items-center justify-center text-center px-6 py-24 md:py-32" style={{ background: 'radial-gradient(ellipse at center, rgba(255,62,65,0.08) 0%, transparent 60%)' }}>
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6" style={{ backgroundColor: 'rgba(255,62,65,0.1)', color: 'var(--accent)', border: '1px solid rgba(255,62,65,0.2)' }}>
            <span className="h-1.5 w-1.5 rounded-full bg-green-400" /> Florida&apos;s Fastest Courier
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6" style={{ color: 'var(--text-primary)' }}>
            Deliveries That
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#FF3E41] to-[#ff6b6b]"> Move at Speed</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            Same-day courier across all of Florida. Real-time tracking, proof of delivery, and a network of drivers ready to move your packages — from Miami to Tallahassee.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/auth/register" className="px-8 py-3 rounded-xl text-white font-semibold text-sm transition-all shadow hover:shadow-[0_6px_24px_rgba(255,62,65,0.45)] hover:-translate-y-0.5" style={{ background: 'linear-gradient(135deg, #FF3E41, #d92e31)' }}>Start Shipping</a>
            <a href="/track" className="px-8 py-3 rounded-xl font-semibold text-sm transition-all border hover:border-[var(--accent)] hover:text-[var(--text-primary)]" style={{ borderColor: 'var(--card-border)', color: 'var(--text-secondary)' }}>Track a Package</a>
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center p-6 rounded-xl border" style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)' }}>
              <p className="text-3xl md:text-4xl font-extrabold mb-1" style={{ color: 'var(--accent)' }}>{s.value}</p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-16 md:py-24" style={{ borderTop: '1px solid var(--card-border)' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4" style={{ color: 'var(--text-primary)' }}>Everything You Need</h2>
          <p className="text-center mb-12 max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>From dispatch to delivery, Nexatrack gives you full control over your courier operations.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => {
              const Icon = f.icon
              return (
                <div key={f.title} className="p-6 rounded-xl border transition-all" style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)' }}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg mb-4" style={{ backgroundColor: 'rgba(255,62,65,0.1)' }}>
                    <Icon size={20} style={{ color: 'var(--accent)' }} />
                  </div>
                  <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{f.title}</h3>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 text-center" style={{ borderTop: '1px solid var(--card-border)' }}>
        <div className="max-w-xl mx-auto p-10 rounded-2xl border" style={{ borderColor: 'rgba(255,62,65,0.2)', background: 'radial-gradient(ellipse at center, rgba(255,62,65,0.06) 0%, transparent 70%)' }}>
          <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Ready to Ship?</h2>
          <p className="mb-8" style={{ color: 'var(--text-muted)' }}>Join hundreds of Florida businesses that trust Nexatrack for their same-day deliveries.</p>
          <a href="/auth/register" className="inline-flex px-8 py-3 rounded-xl text-white font-semibold text-sm transition-all shadow hover:shadow-[0_6px_24px_rgba(255,62,65,0.45)] hover:-translate-y-0.5" style={{ background: 'linear-gradient(135deg, #FF3E41, #d92e31)' }}>Create Free Account</a>
        </div>
      </section>

      <footer className="px-6 py-8 text-center text-xs" style={{ borderTop: '1px solid var(--card-border)', color: 'var(--text-muted)' }}>
        <p>&copy; {new Date().getFullYear()} Nexatrack Courier Services. Florida&apos;s Fastest Same-Day Delivery.</p>
      </footer>

      <ChatWidget />
    </div>
  )
}
