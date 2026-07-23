"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { db } from "@/lib/db-client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MobileTable } from "@/components/mobile-table"
import { Search } from "lucide-react"
import { TableSkeleton } from "@/components/ui/skeleton-table"

export default function TicketsPage() {
  const router = useRouter()
  const [items, setItems] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    db<any[]>("support_tickets", "select", { columns: "*, profiles:user_id(full_name, email)", order: { column: "created_at", ascending: false } }).then((data) => {
      if (data) setItems(data)
    }).finally(() => setLoading(false))
  }, [])

  const filtered = items.filter((i) =>
    i.subject?.toLowerCase().includes(search.toLowerCase()) ||
    i.profiles?.full_name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <h1 style={{color:'var(--text-primary)'}} className="mb-6 text-2xl font-bold">Support Tickets</h1>
      {loading ? (
        <div className="rounded-xl border p-5" style={{borderColor:'var(--card-border)',backgroundColor:'var(--card-bg)'}}>
          <TableSkeleton rows={5} />
        </div>
      ) : (
      <Card style={{borderColor:'var(--card-border)',backgroundColor:'var(--card-bg)'}}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search size={16} style={{color:'var(--text-muted)'}} />
            <Input placeholder="Search tickets..." value={search} onChange={(e) => setSearch(e.target.value)} style={{borderColor:'var(--card-border)',backgroundColor:'var(--input-bg)',color:'var(--text-primary)'}} />
          </div>
        </CardHeader>
        <CardContent>
          <MobileTable
            cols={[
              { label: "Subject", key: "subject" },
              { label: "User", key: "profiles", render: (i) => <span style={{color:'var(--text-muted)'}}>{i.profiles?.full_name || i.profiles?.email || "—"}</span> },
              { label: "Status", key: "status", render: (i) => <Badge variant="outline" style={i.status === "open" ? {backgroundColor:'var(--badge-success-bg)',color:'var(--badge-success-text)'} : i.status === "in_progress" ? {backgroundColor:'var(--badge-info-bg)',color:'var(--badge-info-text)'} : {backgroundColor:'var(--badge-neutral-bg)',color:'var(--badge-neutral-text)'}}>{i.status}</Badge> },
              { label: "Date", key: "created_at", render: (i) => <span style={{color:'var(--text-muted)'}}>{i.created_at ? new Date(i.created_at).toLocaleDateString() : "—"}</span> },
            ]}
            data={filtered}
            onRowClick={(item) => router.push(`/admin/tickets/${item.id}`)}
          />
        </CardContent>
      </Card>
      )}
    </div>
  )
}

