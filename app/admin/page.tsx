"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { db } from "@/lib/db-client"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpRight } from "lucide-react"

const cardStyle = [
  { label: "Total Shipments", href: "/admin/shipments", isCurrency: false, bg: "bg-blue-500/10", hex: "#3b82f6",
    svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg> },
  { label: "Pending", href: "/admin/shipments/pending", isCurrency: false, bg: "bg-yellow-500/10", hex: "#eab308",
    svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
  { label: "In Transit", href: "/admin/shipments/transit", isCurrency: false, bg: "bg-orange-500/10", hex: "#f97316",
    svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg> },
  { label: "Delivered", href: "/admin/shipments?status=delivered", isCurrency: false, bg: "bg-green-500/10", hex: "#22c55e",
    svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
  { label: "Revenue", href: "/admin/transactions", isCurrency: true, bg: "bg-emerald-500/10", hex: "#10b981",
    svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
  { label: "Merchants", href: "/admin/merchants", isCurrency: false, bg: "bg-purple-500/10", hex: "#a855f7",
    svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { label: "Pickups", href: "/admin/pickups", isCurrency: false, bg: "bg-cyan-500/10", hex: "#06b6d4",
    svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> },
  { label: "Open Tickets", href: "/admin/tickets", isCurrency: false, bg: "bg-red-500/10", hex: "#ef4444",
    svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> },
]

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalShipments: 0, pending: 0, inTransit: 0, delivered: 0,
    totalRevenue: 0, totalMerchants: 0, pendingPickups: 0, openTickets: 0,
  })

  useEffect(() => {
    async function loadStats() {
      const [{ count: totalShipments }, { count: pending }, { count: inTransit }, { count: delivered },
        { count: totalMerchants }, { count: pendingPickups }, { count: openTickets }] = await Promise.all([
        db("parcels", "select", { count: "exact", head: true }),
        db("parcels", "select", { count: "exact", head: true, eq: { status: "pending" } }),
        db("parcels", "select", { count: "exact", head: true, eq: { status: "in_transit" } }),
        db("parcels", "select", { count: "exact", head: true, eq: { status: "delivered" } }),
        db("profiles", "select", { count: "exact", head: true, eq: { role: "merchant" } }),
        db("pickup_requests", "select", { count: "exact", head: true, eq: { status: "pending" } }),
        db("support_tickets", "select", { count: "exact", head: true, neq: { status: "closed" } }),
      ])
      const { data: revenueData } = await db("transactions", "select", { columns: "amount", eq: { type: "credit" } })
      const totalRevenue = (revenueData || []).reduce((sum: number, t: any) => sum + Number(t.amount), 0)
      setStats({ totalShipments: totalShipments || 0, pending: pending || 0, inTransit: inTransit || 0, delivered: delivered || 0, totalRevenue, totalMerchants: totalMerchants || 0, pendingPickups: pendingPickups || 0, openTickets: openTickets || 0 })
    }
    loadStats()
  }, [])

  const values = [
    stats.totalShipments, stats.pending, stats.inTransit, stats.delivered,
    stats.totalRevenue, stats.totalMerchants, stats.pendingPickups, stats.openTickets,
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Dashboard</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>Overview of your courier operations</p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
        {cardStyle.map((card, i) => {
          const val = values[i]
          const display = card.isCurrency ? `$${Number(val).toLocaleString()}` : val
          return (
            <Link key={card.label} href={card.href} className="block">
            <Card className="group relative overflow-hidden shadow-lg shadow-black/20 transition-all duration-300 hover:border-[#FF3E41]/20 hover:shadow-[#FF3E41]/5 cursor-pointer" style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)' }}>
              <div className="absolute right-0 top-0 h-20 w-20 translate-x-6 -translate-y-6 rounded-full opacity-5 transition-all group-hover:opacity-10"
                style={{ background: `radial-gradient(circle, ${card.hex}33)` }} />
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className={`rounded-xl ${card.bg} p-2.5`}>{card.svg}</div>
                  <ArrowUpRight size={14} className="transition-all group-hover:text-[#FF3E41]" style={{ color: 'var(--text-muted)' }} />
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>{display}</div>
                  <div className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>{card.label}</div>
                </div>
              </CardContent>
            </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
