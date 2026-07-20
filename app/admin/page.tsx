"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase-browser"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Truck, CheckCircle, DollarSign, Users, ClipboardList, AlertTriangle } from "lucide-react"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalShipments: 0,
    pending: 0,
    inTransit: 0,
    delivered: 0,
    totalRevenue: 0,
    totalMerchants: 0,
    pendingPickups: 0,
    openTickets: 0,
  })
  const supabase = createClient()

  useEffect(() => {
    async function loadStats() {
      const [
        { count: totalShipments },
        { count: pending },
        { count: inTransit },
        { count: delivered },
        { count: totalMerchants },
        { count: pendingPickups },
        { count: openTickets },
      ] = await Promise.all([
        supabase.from("parcels").select("*", { count: "exact", head: true }),
        supabase.from("parcels").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("parcels").select("*", { count: "exact", head: true }).eq("status", "in_transit"),
        supabase.from("parcels").select("*", { count: "exact", head: true }).eq("status", "delivered"),
        supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "merchant"),
        supabase.from("pickup_requests").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("support_tickets").select("*", { count: "exact", head: true }).neq("status", "closed"),
      ])

      const { data: revenueData } = await supabase
        .from("transactions")
        .select("amount")
        .eq("type", "credit")

      const totalRevenue = (revenueData || []).reduce((sum, t) => sum + Number(t.amount), 0)

      setStats({
        totalShipments: totalShipments || 0,
        pending: pending || 0,
        inTransit: inTransit || 0,
        delivered: delivered || 0,
        totalRevenue,
        totalMerchants: totalMerchants || 0,
        pendingPickups: pendingPickups || 0,
        openTickets: openTickets || 0,
      })
    }
    loadStats()
  }, [])

  const cards = [
    { title: "Total Shipments", value: stats.totalShipments, icon: Package, color: "text-blue-500" },
    { title: "Pending", value: stats.pending, icon: AlertTriangle, color: "text-yellow-500" },
    { title: "In Transit", value: stats.inTransit, icon: Truck, color: "text-orange-500" },
    { title: "Delivered", value: stats.delivered, icon: CheckCircle, color: "text-green-500" },
    { title: "Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-emerald-500" },
    { title: "Merchants", value: stats.totalMerchants, icon: Users, color: "text-purple-500" },
    { title: "Pickups", value: stats.pendingPickups, icon: ClipboardList, color: "text-cyan-500" },
    { title: "Open Tickets", value: stats.openTickets, icon: AlertTriangle, color: "text-red-500" },
  ]

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-white">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.title} className="border-[#1a1725] bg-[#0a0715]">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">{card.title}</CardTitle>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{card.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
