"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/db-client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MobileTable } from "@/components/mobile-table"
import { Search } from "lucide-react"
import { TableSkeleton } from "@/components/ui/skeleton-table"

export default function WalletsPage() {
  const [items, setItems] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    db("wallets", "select", { columns: "*, profiles:merchant_id(full_name, email)", order: { column: "created_at", ascending: false } }).then((data) => {
      if (data) setItems(data)
    }).finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1 style={{color:'var(--text-primary)'}} className="mb-6 text-2xl font-bold">Wallets</h1>
      {loading ? (
        <div className="rounded-xl border p-5" style={{borderColor:'var(--card-border)',backgroundColor:'var(--card-bg)'}}>
          <TableSkeleton rows={5} />
        </div>
      ) : (
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
              { label: "Merchant", key: "profiles", render: (i) => i.profiles?.full_name || "—" },
              { label: "Email", key: "profiles.email", render: (i) => <span style={{color:'var(--text-muted)'}}>{i.profiles?.email || "—"}</span> },
              { label: "Balance", key: "balance", render: (i) => <span className="font-semibold">${Number(i.balance || 0).toFixed(2)}</span> },
            ]}
            data={items.filter((i) => !search || i.profiles?.full_name?.toLowerCase().includes(search.toLowerCase()))}
          />
        </CardContent>
      </Card>
      )}
    </div>
  )
}

