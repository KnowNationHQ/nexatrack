"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase-browser"
import { db } from "@/lib/db-client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function MerchantTransactions() {
  const [items, setItems] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      db("wallets", "select", { columns: "id", eq: { merchant_id: user.id }, single: true }).then((wallet) => {
        if (!wallet) return
        db<any[]>("transactions", "select", { eq: { wallet_id: wallet.id }, order: { column: "created_at", ascending: false }, limit: 50 }).then((data) => {
          if (data) setItems(data)
        })
      })
    })
  }, [])

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>My Transactions</h1>
      <Card style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)' }}>
        <CardHeader><h2 className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Recent Transactions</h2></CardHeader>
        <CardContent>
          {items.map((i) => (
            <div key={i.id} className="flex items-center justify-between border-b py-3" style={{ borderBottomColor: 'var(--card-border)', color: 'var(--text-primary)' }}>
              <div>
                <p className="font-medium capitalize">{i.type}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{i.created_at ? new Date(i.created_at).toLocaleDateString() : ""}</p>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${i.type === "credit" ? "text-green-400" : "text-red-400"}`}>
                  {i.type === "credit" ? "+" : "-"}${Number(i.amount || 0).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
