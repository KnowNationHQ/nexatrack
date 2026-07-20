"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase-browser"
import { db } from "@/lib/db-client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function MerchantInvoices() {
  const [items, setItems] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      db<any[]>("invoices", "select", { eq: { merchant_id: user.id }, order: { column: "created_at", ascending: false } }).then((data) => {
        if (data) setItems(data)
      })
    })
  }, [])

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-white">My Invoices</h1>
      <Card className="border-[#1a1725] bg-[#0a0715]">
        <CardContent className="pt-6">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[#1a1725] text-left text-gray-400"><th className="pb-3 pr-4 font-medium">Invoice #</th><th className="pb-3 pr-4 font-medium">Total</th><th className="pb-3 pr-4 font-medium">Status</th><th className="pb-3 pr-4 font-medium">Date</th></tr></thead>
            <tbody>
              {items.map((i) => (
                <tr key={i.id} className="border-b border-[#1a1725] text-white">
                  <td className="py-3 pr-4 font-mono text-xs">{i.invoice_no || "—"}</td>
                  <td className="py-3 pr-4">${Number(i.total || 0).toFixed(2)}</td>
                  <td className="py-3 pr-4"><Badge variant="outline" className={i.status === "paid" ? "bg-green-900/50 text-green-400" : "bg-yellow-900/50 text-yellow-400"}>{i.status || "pending"}</Badge></td>
                  <td className="py-3 pr-4 text-gray-400">{i.created_at ? new Date(i.created_at).toLocaleDateString() : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}

