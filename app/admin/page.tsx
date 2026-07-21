"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { db } from "@/lib/db-client"
import { Card, CardContent } from "@/components/ui/card"
import { Package, Truck, CheckCircle, DollarSign, Users, ClipboardList, Clock, MessageSquare, ArrowUpRight } from "lucide-react"

const cardStyle = [
  { icon: Package, label: "Total Shipments", href: "/admin/shipments", color: "from-blue-500 to-blue-600", bg: "bg-blue-500/10" },
  { icon: Clock, label: "Pending", href: "/admin/shipments/pending", color: "from-yellow-500 to-yellow-600", bg: "bg-yellow-500/10" },
  { icon: Truck, label: "In Transit", href: "/admin/shipments/transit", color: "from-orange-500 to-orange-600", bg: "bg-orange-500/10" },
  { icon: CheckCircle, label: "Delivered", href: "/admin/shipments?status=delivered", color: "from-green-500 to-green-600", bg: "bg-green-500/10" },
  { icon: DollarSign, label: "Revenue", href: "/admin/transactions", color: "from-emerald-500 to-emerald-600", bg: "bg-emerald-500/10", isCurrency: true },
  { icon: Users, label: "Merchants", href: "/admin/merchants", color: "from-purple-500 to-purple-600", bg: "bg-purple-500/10" },
  { icon: ClipboardList, label: "Pickups", href: "/admin/pickups", color: "from-cyan-500 to-cyan-600", bg: "bg-cyan-500/10" },
  { icon: MessageSquare, label: "Open Tickets", href: "/admin/tickets", color: "from-red-500 to-red-600", bg: "bg-red-500/10" },
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
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Overview of your courier operations</p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
        {cardStyle.map((card, i) => {
          const Icon = card.icon
          const val = values[i]
          const display = card.isCurrency ? `$${Number(val).toLocaleString()}` : val
          return (
            <Link key={card.label} href={card.href} className="block">
            <Card className="group relative overflow-hidden border-[#1a1725]/60 bg-gradient-to-b from-[#0a0715] to-[#0d0a1a] shadow-lg shadow-black/20 transition-all duration-300 hover:border-[#FF3E41]/20 hover:shadow-[#FF3E41]/5 cursor-pointer">
              <div className="absolute right-0 top-0 h-20 w-20 translate-x-6 -translate-y-6 rounded-full opacity-5 transition-all group-hover:opacity-10" style={{ background: `radial-gradient(circle, ${card.color.replace('from-', '').replace(' to-', ',')})` }} />
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className={`rounded-xl ${card.bg} p-2.5`}>
                    <Icon size={18} className={`bg-gradient-to-br ${card.color} bg-clip-text text-transparent`} />
                  </div>
                  <ArrowUpRight size={14} className="text-gray-600 transition-all group-hover:text-[#FF3E41]" />
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-bold tracking-tight text-white">{display}</div>
                  <div className="mt-1 text-xs text-gray-500">{card.label}</div>
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
