"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-browser"
import { LayoutDashboard, Package, Plus, ClipboardList, Wallet, Receipt, FileText, Ticket, User, LogOut, Menu, X, Sun, Moon } from "lucide-react"

const menuItems = [
  { href: "/merchant", label: "Dashboard", icon: LayoutDashboard },
  { href: "/merchant/shipments", label: "My Shipments", icon: Package },
  { href: "/merchant/shipments/new", label: "New Shipment", icon: Plus },
  { href: "/merchant/pickups", label: "Pickup Request", icon: ClipboardList },
  { href: "/merchant/wallet", label: "Wallet", icon: Wallet },
  { href: "/merchant/transactions", label: "Transactions", icon: Receipt },
  { href: "/merchant/invoices", label: "Invoices", icon: FileText },
  { href: "/merchant/tickets", label: "Support", icon: Ticket },
  { href: "/merchant/profile", label: "Profile", icon: User },
]

export default function MerchantLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
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

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  return (
    <div className="flex h-screen bg-[#0a0715]">
      <aside className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-50 flex h-full w-64 transform flex-col border-r border-[#1a1725] bg-[#0a0715] transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0`}>
        <div className="flex h-14 items-center justify-between border-b border-[#1a1725] px-4">
          <Link href="/merchant" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-[#FF3E41] text-sm font-bold text-white">N</div>
            <span className="font-bold text-white">Merchant</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="text-gray-400 lg:hidden"><X size={20} /></button>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 py-4">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = pathname === item.href
            return (
              <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  active ? "bg-[#FF3E41]/10 text-[#FF3E41]" : "text-gray-400 hover:bg-[#1a1725] hover:text-white"
                }`}>
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
        <div className="border-t border-[#1a1725] p-3 space-y-1">
          <button onClick={toggleTheme} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-400 hover:bg-[#1a1725] hover:text-white">
            {isDark ? <Sun size={18} /> : <Moon size={18} />} <span>{isDark ? "Light" : "Dark"}</span>
          </button>
          <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-400 hover:bg-[#1a1725] hover:text-white">
            <LogOut size={18} /> <span>Logout</span>
          </button>
        </div>
      </aside>
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center justify-between border-b border-[#1a1725] bg-[#0a0715] px-4">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-400 lg:hidden"><Menu size={20} /></button>
        </header>
        <main className="flex-1 overflow-y-auto bg-[#0a0715] p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
