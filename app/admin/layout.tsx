"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-browser"
import {
  LayoutDashboard, Package, Users, Truck, MapPin, Tag, PackageOpen, 
  Box, DollarSign, ClipboardList, Wallet, Receipt, FileText,
  HelpCircle, Mail, Settings, LogOut, Menu, X, ChevronDown,
  Ticket, MessageSquare, Sun, Moon
} from "lucide-react"

const menuGroups = [
  { label: "Main", items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }] },
  { label: "Logistics", items: [
    { href: "/admin/shipments", label: "All Shipments", icon: Package },
    { href: "/admin/shipments/pending", label: "Pending", icon: PackageOpen },
    { href: "/admin/shipments/transit", label: "In Transit", icon: Truck },
    { href: "/admin/dispatch", label: "Dispatch", icon: Truck },
    { href: "/admin/pickups", label: "Pickup Requests", icon: ClipboardList },
  ]},
  { label: "Management", items: [
    { href: "/admin/merchants", label: "Merchants", icon: Users },
    { href: "/admin/drivers", label: "Drivers", icon: Truck },
    { href: "/admin/branches", label: "Branches", icon: MapPin },
    { href: "/admin/categories", label: "Categories", icon: Tag },
    { href: "/admin/delivery-types", label: "Delivery Types", icon: PackageOpen },
    { href: "/admin/packaging", label: "Packaging", icon: Box },
    { href: "/admin/pricing", label: "Pricing", icon: DollarSign },
  ]},
  { label: "Finance", items: [
    { href: "/admin/wallets", label: "Wallets", icon: Wallet },
    { href: "/admin/transactions", label: "Transactions", icon: Receipt },
    { href: "/admin/invoices", label: "Invoices", icon: FileText },
  ]},
  { label: "Support", items: [
    { href: "/admin/tickets", label: "Tickets", icon: Ticket },
    { href: "/admin/chat", label: "Live Chat", icon: MessageSquare },
    { href: "/admin/faq", label: "FAQ", icon: HelpCircle },
  ]},
  { label: "System", items: [
    { href: "/admin/subscribers", label: "Subscribers", icon: Mail },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ]},
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({})
  const [isDark, setIsDark] = useState(true)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const stored = localStorage.getItem("nexatrack_theme")
    const dark = stored ? stored === "dark" : true
    setIsDark(dark)
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light")
  }, [])

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    localStorage.setItem("nexatrack_theme", next ? "dark" : "light")
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light")
  }

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }))
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  return (
    <div className="flex h-screen bg-sidebar">
      <style dangerouslySetInnerHTML={{__html: `
        :root,[data-theme=dark] {
          --sidebar-bg: #0a0715;
          --sidebar-bg-end: #0f0a1e;
          --sidebar-border: #1a1725;
          --sidebar-text: #9ca3af;
          --sidebar-text-active: #FF3E41;
          --sidebar-hover-bg: #1a1725;
          --sidebar-header-text: #ffffff;
          --sidebar-group-text: #6b7280;
          --sidebar-overlay: rgba(0,0,0,0.6);
          --main-bg: #0a0715;
          --main-border: #1a1725;
          --card-bg: #0a0715;
          --card-border: #1a1725;
        }
        [data-theme=light] {
          --sidebar-bg: #ffffff;
          --sidebar-bg-end: #f8f8fc;
          --sidebar-border: #e5e7eb;
          --sidebar-text: #6b7280;
          --sidebar-text-active: #FF3E41;
          --sidebar-hover-bg: #f3f4f6;
          --sidebar-header-text: #111827;
          --sidebar-group-text: #9ca3af;
          --sidebar-overlay: rgba(0,0,0,0.3);
          --main-bg: #f9fafb;
          --main-border: #e5e7eb;
          --card-bg: #ffffff;
          --card-border: #e5e7eb;
        }
        .sidebar-scroll::-webkit-scrollbar { width: 4px; }
        .sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
        .sidebar-scroll::-webkit-scrollbar-thumb { background: #FF3E41; border-radius: 4px; }
        .sidebar-scroll::-webkit-scrollbar-thumb:hover { background: #d92e31; }
        .sidebar-scroll { scrollbar-width: thin; scrollbar-color: #FF3E41 transparent; }
      `}} />
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 flex h-full w-64 transform flex-col transition-all duration-200 ease-in-out lg:relative lg:translate-x-0 ${
          collapsed ? "lg:w-16" : "lg:w-64"
        }`}
        style={{ background: `linear-gradient(to bottom, var(--sidebar-bg), var(--sidebar-bg-end))`, borderRight: `1px solid var(--sidebar-border)` }}
      >
        <div className="flex h-14 items-center justify-between px-4" style={{ borderBottom: `1px solid var(--sidebar-border)` }}>
          <Link href="/admin" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF3E41] to-[#d92e31] text-sm font-bold text-white shadow-lg shadow-[#FF3E41]/20">
              N
            </div>
            {!collapsed && <span className="font-bold tracking-tight" style={{ color: 'var(--sidebar-header-text)' }}>Nexatrack</span>}
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="rounded-lg p-1.5 lg:hidden" style={{ color: 'var(--sidebar-text)' }}>
            <X size={18} />
          </button>
        </div>

        <nav className="sidebar-scroll flex-1 overflow-y-auto px-3 py-4">
          {menuGroups.map((group) => {
            const isOpen = openGroups[group.label] !== false
            return (
              <div key={group.label} className="mb-2">
                <button
                  onClick={() => toggleGroup(group.label)}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-[11px] font-semibold uppercase tracking-widest lg:cursor-default"
                  style={{ color: 'var(--sidebar-group-text)' }}
                >
                  <div className="h-3 w-0.5 rounded-full bg-[#FF3E41]/60" />
                  <span>{group.label}</span>
                  <ChevronDown
                    size={12}
                    className={`ml-auto transition-transform lg:hidden ${isOpen ? "" : "-rotate-90"}`}
                  />
                </button>
                {(!collapsed || isOpen) && (
                  <div className={`mt-0.5 space-y-0.5 ${isOpen ? "block" : "hidden lg:block"}`}>
                    {group.items.map((item) => {
                      const Icon = item.icon
                      const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all border-l-2 ${
                            collapsed ? "justify-center" : ""
                          }`}
                          style={{
                            borderColor: active ? 'var(--sidebar-text-active)' : 'transparent',
                            backgroundColor: active ? 'rgba(255,62,65,0.05)' : 'transparent',
                            color: active ? 'var(--sidebar-text-active)' : 'var(--sidebar-text)',
                          }}
                          onMouseEnter={(e) => { if (!active) { e.currentTarget.style.borderColor = 'rgba(255,62,65,0.3)'; e.currentTarget.style.backgroundColor = 'var(--sidebar-hover-bg)'; e.currentTarget.style.color = '#ffffff'; }}}
                          onMouseLeave={(e) => { if (!active) { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--sidebar-text)'; }}}
                        >
                          <Icon size={18} />
                          {!collapsed && <span>{item.label}</span>}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        <div className="flex items-stretch" style={{ borderTop: `1px solid var(--sidebar-border)`, backgroundColor: 'var(--sidebar-bg)' }}>
          <button
            onClick={toggleTheme}
            className="flex flex-1 items-center justify-center gap-2 py-3 text-sm transition-all"
            style={{ color: 'var(--sidebar-text)' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--sidebar-hover-bg)'; e.currentTarget.style.color = 'var(--sidebar-text-active)' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--sidebar-text)' }}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
            {!collapsed && <span>{isDark ? "Light" : "Dark"}</span>}
          </button>
          <div className="w-px self-stretch" style={{ backgroundColor: 'var(--sidebar-border)' }} />
          <button
            onClick={handleLogout}
            className="flex flex-1 items-center justify-center gap-2 py-3 text-sm transition-all"
            style={{ color: 'var(--sidebar-text)' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--sidebar-hover-bg)'; e.currentTarget.style.color = '#FF3E41' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--sidebar-text)' }}
          >
            <LogOut size={16} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 backdrop-blur-sm lg:hidden" style={{ backgroundColor: 'var(--sidebar-overlay)' }} onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex flex-1 flex-col overflow-hidden" style={{ backgroundColor: 'var(--main-bg)' }}>
        <header className="flex h-14 items-center justify-between px-4" style={{ borderBottom: `1px solid var(--main-border)`, backgroundColor: 'var(--card-bg)' }}>
          <button onClick={() => setSidebarOpen(true)} className="rounded-lg p-1.5 lg:hidden" style={{ color: 'var(--sidebar-text)' }}>
            <Menu size={20} />
          </button>
          <div />
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6" style={{ backgroundColor: 'var(--main-bg)' }}>{children}</main>
      </div>
    </div>
  )
}
