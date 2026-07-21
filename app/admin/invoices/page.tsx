"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/db-client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MobileTable } from "@/components/mobile-table"
import { Search } from "lucide-react"

export default function InvoicesPage() {
  const [items, setItems] = useState<any[]>([])
  const [search, setSearch] = useState("")
  useEffect(() => {
    db("invoices", "select", { columns: "*, profiles:merchant_id(full_name)", order: { column: "created_at", ascending: false } }).then((data) => {
      if (data) setItems(data)
    })
  }, [])

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-white">Invoices</h1>
      <Card className="border-[#1a1725] bg-[#0a0715]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search size={16} className="text-gray-400" />
            <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="border-[#1a1725] bg-[#1a1725] text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <MobileTable
            cols={[
              { label: "Invoice #", key: "invoice_no", render: (i) => <span className="font-mono text-xs">{i.invoice_no || "—"}</span> },
              { label: "Merchant", key: "profiles", render: (i) => i.profiles?.full_name || "—" },
              { label: "Total", key: "total", render: (i) => <span className="font-semibold">${Number(i.total || 0).toFixed(2)}</span> },
              { label: "Status", key: "status", render: (i) => <Badge variant="outline" className={i.status === "paid" ? "bg-green-900/50 text-green-400" : i.status === "overdue" ? "bg-red-900/50 text-red-400" : "bg-yellow-900/50 text-yellow-400"}>{i.status || "pending"}</Badge> },
              { label: "Date", key: "created_at", render: (i) => <span className="text-gray-400">{i.created_at ? new Date(i.created_at).toLocaleDateString() : "—"}</span> },
            ]}
            data={items.filter((i) => !search || i.invoice_no?.toLowerCase().includes(search.toLowerCase()))}
          />
        </CardContent>
      </Card>
    </div>
  )
}

