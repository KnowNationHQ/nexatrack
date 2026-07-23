"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/db-client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MobileTable } from "@/components/mobile-table"
import { Search } from "lucide-react"

export default function TransactionsPage() {
  const [items, setItems] = useState<any[]>([])
  const [search, setSearch] = useState("")
  useEffect(() => {
    db<any[]>("transactions", "select", { order: { column: "created_at", ascending: false }, limit: 50 }).then((data) => {
      if (data) setItems(data)
    })
  }, [])

  return (
    <div>
      <h1 style={{color:'var(--text-primary)'}} className="mb-6 text-2xl font-bold">Transactions</h1>
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
              { label: "Type", key: "type", render: (i) => <Badge variant="outline" style={i.type === "credit" ? {backgroundColor:'var(--badge-success-bg)',color:'var(--badge-success-text)'} : {backgroundColor:'var(--badge-error-bg)',color:'var(--badge-error-text)'}}>{i.type}</Badge> },
              { label: "Amount", key: "amount", render: (i) => <span className="font-semibold">${Number(i.amount || 0).toFixed(2)}</span> },
              { label: "Reference", key: "reference", render: (i) => <span style={{color:'var(--text-muted)'}} className="font-mono text-xs">{i.reference || "—"}</span> },
              { label: "Date", key: "created_at", render: (i) => <span style={{color:'var(--text-muted)'}}>{i.created_at ? new Date(i.created_at).toLocaleDateString() : "—"}</span> },
            ]}
            data={items}
          />
        </CardContent>
      </Card>
    </div>
  )
}


