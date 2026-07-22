"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-browser"
import NotificationBell from "@/components/notification-bell"
import { Package, LogOut, Menu, X, MapPin, MessageSquare, Sun, Moon } from "lucide-react"

export default function DriverLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isDark, setIsDark] = useState(true)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const stored = localStorage.getItem("nexatrack_theme")
    const dark = stored ? stored === "dark" : true
    setIsDark(dark)
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light")
    if (dark) document.documentElement.classList.add("dark"); else document.documentElement.classList.remove("dark")
  }, [])

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    localStorage.setItem("nexatrack_theme", next ? "dark" : "light")
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light")
    if (next) document.documentElement.classList.add("dark"); else document.documentElement.classList.remove("dark")
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  const navItems = [
    { href: "/driver", label: "My Shipments", icon: Package },
    { href: "/driver/shipments", label: "All Jobs", icon: MapPin },
    { href: "/driver/chat", label: "Chat", icon: MessageSquare },
  ]

  return (
    <div className="flex h-screen" style={{ backgroundColor: 'var(--sidebar-bg)' }}>
      <style dangerouslySetInnerHTML={{__html: `
        :root,[data-theme=dark] {
          --sidebar-bg: #0a0715;
          --sidebar-bg-end: #0f0a1e;
          --sidebar-border: #1a1725;
          --sidebar-text: #9ca3af;
          --sidebar-text-active: #FF3E41;
          --sidebar-hover-bg: #1a1725;
          --sidebar-header-text: #ffffff;
          --sidebar-overlay: rgba(0,0,0,0.6);
          --main-bg: #0a0715;
          --main-border: #1a1725;
          --card-bg: #0a0715;
          --card-hover: #12101e;
          --card-border: #1a1725;
          --text-primary: #ffffff;
          --text-secondary: #d1d5db;
          --text-muted: #9ca3af;
        }
        [data-theme=light] {
          --sidebar-bg: #ffffff;
          --sidebar-bg-end: #f8f8fc;
          --sidebar-border: #e5e7eb;
          --sidebar-text: #6b7280;
          --sidebar-text-active: #FF3E41;
          --sidebar-hover-bg: #f3f4f6;
          --sidebar-header-text: #111827;
          --sidebar-overlay: rgba(0,0,0,0.3);
          --main-bg: #f9fafb;
          --main-border: #e5e7eb;
          --card-bg: #ffffff;
          --card-hover: #f3f4f6;
          --card-border: #e5e7eb;
          --text-primary: #111827;
          --text-secondary: #374151;
          --text-muted: #6b7280;
        }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #FF3E41; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #d92e31; }
        * { scrollbar-width: thin; scrollbar-color: #FF3E41 transparent; }
        .sidebar-scroll::-webkit-scrollbar { width: 4px; }
        .sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
        .sidebar-scroll::-webkit-scrollbar-thumb { background: #FF3E41; border-radius: 4px; }
        .sidebar-scroll::-webkit-scrollbar-thumb:hover { background: #d92e31; }
        .sidebar-scroll { scrollbar-width: thin; scrollbar-color: #FF3E41 transparent; }
      `}} />
      <aside className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-50 flex h-full w-64 transform flex-col transition-all lg:relative lg:translate-x-0`}
        style={{ background: `linear-gradient(to bottom, var(--sidebar-bg), var(--sidebar-bg-end))`, borderRight: `1px solid var(--sidebar-border)` }}>
        <div className="flex h-14 items-center justify-between px-4" style={{ borderBottom: `1px solid var(--sidebar-border)` }}>
          <Link href="/driver" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF3E41] to-[#d92e31] text-sm font-bold text-white shadow-lg shadow-[#FF3E41]/20">D</div>
            <span className="font-bold tracking-tight" style={{ color: 'var(--sidebar-header-text)' }}>Driver</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="rounded-lg p-1.5 lg:hidden" style={{ color: 'var(--sidebar-text)' }}><X size={18} /></button>
        </div>
        <nav className="sidebar-scroll flex-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = pathname === item.href
            return (
              <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all border-l-2"
                style={{
                  borderColor: active ? 'var(--sidebar-text-active)' : 'transparent',
                  backgroundColor: active ? 'rgba(255,62,65,0.05)' : 'transparent',
                  color: active ? 'var(--sidebar-text-active)' : 'var(--sidebar-text)',
                }}
                onMouseEnter={(e) => { if (!active) { e.currentTarget.style.borderColor = 'rgba(255,62,65,0.3)'; e.currentTarget.style.backgroundColor = 'var(--sidebar-hover-bg)'; e.currentTarget.style.color = 'var(--text-primary)'; }}}
                onMouseLeave={(e) => { if (!active) { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--sidebar-text)'; }}}
              >
                <Icon size={18} /><span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
        <div className="flex items-stretch" style={{ borderTop: `1px solid var(--sidebar-border)`, backgroundColor: 'var(--sidebar-bg)' }}>
          <button onClick={toggleTheme}
            className="flex flex-1 items-center justify-center gap-2 py-3 text-sm transition-all"
            style={{ color: 'var(--sidebar-text)' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--sidebar-hover-bg)'; e.currentTarget.style.color = 'var(--sidebar-text-active)' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--sidebar-text)' }}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}<span>{isDark ? "Light" : "Dark"}</span>
          </button>
          <div className="w-px self-stretch" style={{ backgroundColor: 'var(--sidebar-border)' }} />
          <button onClick={handleLogout}
            className="flex flex-1 items-center justify-center gap-2 py-3 text-sm transition-all"
            style={{ color: 'var(--sidebar-text)' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--sidebar-hover-bg)'; e.currentTarget.style.color = '#FF3E41' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--sidebar-text)' }}
          >
            <LogOut size={16} /><span>Logout</span>
          </button>
        </div>
      </aside>
      {sidebarOpen && <div className="fixed inset-0 z-40 backdrop-blur-sm lg:hidden" style={{ backgroundColor: 'var(--sidebar-overlay)' }} onClick={() => setSidebarOpen(false)} />}
      <div className="flex flex-1 flex-col overflow-hidden" style={{ backgroundColor: 'var(--main-bg)' }}>
        <header className="flex h-14 items-center justify-between px-4" style={{ borderBottom: `1px solid var(--main-border)`, backgroundColor: 'var(--card-bg)' }}>
          <button onClick={() => setSidebarOpen(true)} className="rounded-lg p-1.5 lg:hidden" style={{ color: 'var(--sidebar-text)' }}><Menu size={20} /></button>
          <div className="flex items-center gap-2">
            <NotificationBell />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6" style={{ backgroundColor: 'var(--main-bg)' }}>{children}</main>
      </div>
    </div>
  )
}
