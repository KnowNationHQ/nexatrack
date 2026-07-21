"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase-browser"
import { Card, CardContent } from "@/components/ui/card"
import { Package, CheckCircle, Truck, DollarSign, Clock } from "lucide-react"

export default function MerchantDashboard() {
  const [stats, setStats] = useState({ total: 0, inTransit: 0, delivered: 0, balance: 0 })
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      Promise.all([
        supabase.from("parcels").select("*", { count: "exact", head: true }).eq("merchant_id", user.id),
        supabase.from("parcels").select("*", { count: "exact", head: true }).eq("merchant_id", user.id).eq("status", "in_transit"),
        supabase.from("parcels").select("*", { count: "exact", head: true }).eq("merchant_id", user.id).eq("status", "delivered"),
        supabase.from("wallets").select("balance").eq("merchant_id", user.id).single(),
      ]).then(([total, transit, delivered, wallet]) => {
        setStats({
          total: total.count || 0,
          inTransit: transit.count || 0,
          delivered: delivered.count || 0,
          balance: Number((wallet.data as any)?.balance || 0),
        })
      })
    })
  }, [])

  const statCards = [
    { label: "Total Shipments", value: stats.total, icon: Package, color: "text-blue-400", sub: "All time" },
    { label: "In Transit", value: stats.inTransit, icon: Truck, color: "text-orange-400", sub: "Active deliveries" },
    { label: "Delivered", value: stats.delivered, icon: CheckCircle, color: "text-green-400", sub: "Completed" },
    { label: "Wallet Balance", value: `$${stats.balance.toFixed(2)}`, icon: DollarSign, color: "text-emerald-400", sub: "Available funds" },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Merchant Portal</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => {
          const Icon = s.icon
          return (
            <Card key={s.label} className="border transition-all cursor-default"
              style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)' }}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{s.label}</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{s.value}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.sub}</p>
                    </div>
                  </div>
                  <Icon size={24} className={`${s.color} opacity-80`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
