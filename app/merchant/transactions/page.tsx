"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase-browser"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function MerchantTransactions() {
  const [items, setItems] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from("wallets").select("id").eq("merchant_id", user.id).single().then(({ data: wallet }) => {
        if (!wallet) return
        supabase.from("transactions").select("*").eq("wallet_id", wallet.id).order("created_at", { ascending: false }).limit(50).then(({ data }) => {
          if (data) setItems(data)
        })
      })
    })
  }, [])

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-white">My Transactions</h1>
      <Card className="border-[#1a1725] bg-[#0a0715]">
        <CardHeader><h2 className="text-sm font-medium text-gray-400">Recent Transactions</h2></CardHeader>
        <CardContent>
          {items.map((i) => (
            <div key={i.id} className="flex items-center justify-between border-b border-[#1a1725] py-3 text-white">
              <div>
                <p className="font-medium capitalize">{i.type}</p>
                <p className="text-xs text-gray-400">{i.created_at ? new Date(i.created_at).toLocaleDateString() : ""}</p>
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
