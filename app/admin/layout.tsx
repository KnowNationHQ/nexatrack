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
  {
    label: "Main",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Logistics",
    items: [
      { href: "/admin/shipments", label: "All Shipments", icon: Package },
      { href: "/admin/shipments/pending", label: "Pending", icon: PackageOpen },
      { href: "/admin/shipments/transit", label: "In Transit", icon: Truck },
      { href: "/admin/pickups", label: "Pickup Requests", icon: ClipboardList },
    ],
  },
  {
    label: "Management",
    items: [
      { href: "/admin/merchants", label: "Merchants", icon: Users },
      { href: "/admin/drivers", label: "Drivers", icon: Truck },
      { href: "/admin/branches", label: "Branches", icon: MapPin },
      { href: "/admin/categories", label: "Categories", icon: Tag },
      { href: "/admin/delivery-types", label: "Delivery Types", icon: PackageOpen },
      { href: "/admin/packaging", label: "Packaging", icon: Box },
      { href: "/admin/pricing", label: "Pricing", icon: DollarSign },
    ],
  },
  {
    label: "Finance",
    items: [
      { href: "/admin/wallets", label: "Wallets", icon: Wallet },
      { href: "/admin/transactions", label: "Transactions", icon: Receipt },
      { href: "/admin/invoices", label: "Invoices", icon: FileText },
    ],
  },
  {
    label: "Support",
    items: [
      { href: "/admin/tickets", label: "Tickets", icon: Ticket },
      { href: "/admin/chat", label: "Live Chat", icon: MessageSquare },
      { href: "/admin/faq", label: "FAQ", icon: HelpCircle },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/admin/subscribers", label: "Subscribers", icon: Mail },
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
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
    document.documentElement.classList.toggle("dark", dark)
  }, [])

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    localStorage.setItem("nexatrack_theme", next ? "dark" : "light")
    document.documentElement.classList.toggle("dark", next)
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
    <div className="flex h-screen bg-[#0a0715]">
      <style dangerouslySetInnerHTML={{__html: `
        .sidebar-nav::-webkit-scrollbar { width: 4px; }
        .sidebar-nav::-webkit-scrollbar-track { background: transparent; }
        .sidebar-nav::-webkit-scrollbar-thumb { background: #FF3E41; border-radius: 4px; }
        .sidebar-nav::-webkit-scrollbar-thumb:hover { background: #d92e31; }
        .sidebar-nav { scrollbar-width: thin; scrollbar-color: #FF3E41 transparent; }
      `}} />
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 flex h-full w-64 transform flex-col border-r border-[#1a1725] bg-gradient-to-b from-[#0a0715] via-[#0a0715] to-[#0f0a1e] transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 ${
          collapsed ? "lg:w-16" : "lg:w-64"
        }`}
      >
        <div className="flex h-14 items-center justify-between border-b border-[#1a1725]/50 px-4">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF3E41] to-[#d92e31] text-sm font-bold text-white shadow-lg shadow-[#FF3E41]/20">
              N
            </div>
            {!collapsed && <span className="font-bold text-white/90 tracking-tight">Nexatrack</span>}
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="rounded-lg p-1.5 text-gray-500 hover:bg-[#1a1725] hover:text-white lg:hidden">
            <X size={18} />
          </button>
        </div>

        <nav className="sidebar-nav flex-1 overflow-y-auto px-3 py-4">
          {menuGroups.map((group) => {
            const isOpen = openGroups[group.label] !== false
            return (
              <div key={group.label} className="mb-2">
                <button
                  onClick={() => toggleGroup(group.label)}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-[11px] font-semibold uppercase tracking-widest text-gray-600 hover:text-[#FF3E41] lg:cursor-default lg:hover:text-gray-600"
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
                            active
                              ? "border-[#FF3E41] bg-[#FF3E41]/5 text-[#FF3E41]"
                              : "border-transparent text-gray-400 hover:border-[#FF3E41]/30 hover:bg-[#1a1725]/80 hover:text-white"
                          } ${collapsed ? "justify-center" : ""}`}
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

        <div className="border-t border-[#1a1725]/50 bg-[#0a0715] p-3 space-y-1">
          <button
            onClick={toggleTheme}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-[#1a1725]/80 hover:text-white transition-all"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
            {!collapsed && <span>{isDark ? "Light" : "Dark"}</span>}
          </button>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-[#1a1725]/80 hover:text-[#FF3E41] transition-all"
          >
            <LogOut size={18} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center justify-between border-b border-[#1a1725] bg-[#0a0715] px-4">
          <button onClick={() => setSidebarOpen(true)} className="rounded-lg p-1.5 text-gray-500 hover:bg-[#1a1725] hover:text-white lg:hidden">
            <Menu size={20} />
          </button>
          <div />
        </header>
        <main className="flex-1 overflow-y-auto bg-[#0a0715] p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
