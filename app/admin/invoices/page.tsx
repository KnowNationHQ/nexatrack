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
      <h1 style={{color:'var(--text-primary)'}} className="mb-6 text-2xl font-bold">Invoices</h1>
      <Card style={{borderColor:'var(--card-border)',backgroundColor:'var(--card-bg)'}}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search size={16} style={{color:'var(--text-muted)'}} />
            <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} style={{borderColor:'var(--card-border)',backgroundColor:'var(--input-bg)',color:'var(--text-primary)'}} />
          </div>
        </CardHeader>
        <CardContent>
          <MobileTable
            cols={[
              { label: "Invoice #", key: "invoice_no", render: (i) => <span className="font-mono text-xs">{i.invoice_no || "—"}</span> },
              { label: "Merchant", key: "profiles", render: (i) => i.profiles?.full_name || "—" },
              { label: "Total", key: "total", render: (i) => <span className="font-semibold">${Number(i.total || 0).toFixed(2)}</span> },
              { label: "Status", key: "status", render: (i) => <Badge variant="outline" style={i.status === "paid" ? {backgroundColor:'var(--badge-success-bg)',color:'var(--badge-success-text)'} : i.status === "overdue" ? {backgroundColor:'var(--badge-error-bg)',color:'var(--badge-error-text)'} : {backgroundColor:'var(--badge-warning-bg)',color:'var(--badge-warning-text)'}}>{i.status || "pending"}</Badge> },
              { label: "Date", key: "created_at", render: (i) => <span style={{color:'var(--text-muted)'}}>{i.created_at ? new Date(i.created_at).toLocaleDateString() : "—"}</span> },
            ]}
            data={items.filter((i) => !search || i.invoice_no?.toLowerCase().includes(search.toLowerCase()))}
          />
        </CardContent>
      </Card>
    </div>
  )
}

