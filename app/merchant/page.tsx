"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase-browser"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, CheckCircle, Truck, DollarSign } from "lucide-react"

export default function MerchantDashboard() {
  const [stats, setStats] = useState({ total: 0, inTransit: 0, delivered: 0, balance: 0 })
  const [merchantId, setMerchantId] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      setMerchantId(user.id)
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

  const cards = [
    { title: "Total Shipments", value: stats.total, icon: Package, color: "text-blue-500" },
    { title: "In Transit", value: stats.inTransit, icon: Truck, color: "text-orange-500" },
    { title: "Delivered", value: stats.delivered, icon: CheckCircle, color: "text-green-500" },
    { title: "Wallet Balance", value: `$${stats.balance.toFixed(2)}`, icon: DollarSign, color: "text-emerald-500" },
  ]

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Merchant Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon
          return (
            <Card key={c.title} style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)' }}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>{c.title}</CardTitle>
                <Icon className={`h-4 w-4 ${c.color}`} />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{c.value}</div></CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
