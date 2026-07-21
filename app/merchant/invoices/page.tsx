"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase-browser"
import { db } from "@/lib/db-client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MobileTable } from "@/components/mobile-table"

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
          <MobileTable
            cols={[
              { label: "Invoice #", key: "invoice_no", render: (i) => <span className="font-mono text-xs">{i.invoice_no || "—"}</span> },
              { label: "Total", key: "total", render: (i) => `$${Number(i.total || 0).toFixed(2)}` },
              { label: "Status", key: "status", render: (i) => <Badge variant="outline" className={i.status === "paid" ? "bg-green-900/50 text-green-400 border-green-700" : "bg-yellow-900/50 text-yellow-400 border-yellow-700"}>{i.status || "pending"}</Badge> },
              { label: "Date", key: "created_at", render: (i) => i.created_at ? new Date(i.created_at).toLocaleDateString() : "—" },
            ]}
            data={items}
          />
        </CardContent>
      </Card>
    </div>
  )
}
