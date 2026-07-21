"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-browser"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard, Package, Users, Truck, MapPin, Tag, PackageOpen, 
  Box, DollarSign, ClipboardList, Wallet, Receipt, FileText,
  HelpCircle, Mail, Settings, LogOut, Menu, X, ChevronDown, ChevronRight,
  Ticket, MessageSquare
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
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

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
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 flex h-full w-64 transform flex-col border-r border-[#1a1725] bg-[#0a0715] transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 ${
          collapsed ? "lg:w-16" : "lg:w-64"
        }`}
      >
        <div className="flex h-14 items-center justify-between border-b border-[#1a1725] px-4">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-[#FF3E41] text-sm font-bold text-white">
              N
            </div>
            {!collapsed && <span className="font-bold text-white">Nexatrack</span>}
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="text-gray-400 lg:hidden">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-4">
          {menuGroups.map((group) => {
            const isOpen = openGroups[group.label] !== false
            const hasActive = group.items.some((i) => pathname === i.href)
            return (
              <div key={group.label} className="mb-1">
                <button
                  onClick={() => toggleGroup(group.label)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold uppercase text-gray-500 hover:text-white lg:cursor-default lg:hover:text-gray-500"
                >
                  <span>{group.label}</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform lg:hidden ${isOpen ? "rotate-0" : "-rotate-90"}`}
                  />
                </button>
                {(!collapsed || isOpen) && (
                  <div className={`${isOpen ? "block" : "hidden lg:block"}`}>
                    {group.items.map((item) => {
                      const Icon = item.icon
                      const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                            active
                              ? "bg-[#FF3E41]/10 text-[#FF3E41]"
                              : "text-gray-400 hover:bg-[#1a1725] hover:text-white"
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

        <div className="border-t border-[#1a1725] p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-400 hover:bg-[#1a1725] hover:text-white"
          >
            <LogOut size={18} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center justify-between border-b border-[#1a1725] bg-[#0a0715] px-4">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-400 lg:hidden">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              <LogOut size={16} className="mr-1" />
              Logout
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-[#0a0715] p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
