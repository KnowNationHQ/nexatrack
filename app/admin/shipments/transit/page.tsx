"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/db-client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MobileTable } from "@/components/mobile-table"
import { Search } from "lucide-react"

export default function InTransitPage() {
  const [items, setItems] = useState<any[]>([])
  const [search, setSearch] = useState("")
  useEffect(() => {
    db<any[]>("parcels", "select", { eq: { status: "in_transit" }, order: { column: "created_at", ascending: false }, limit: 50 }).then((data) => {
      if (data) setItems(data)
    })
  }, [])

  const filtered = items.filter((s) =>
    s.tracking_number?.toLowerCase().includes(search.toLowerCase()) ||
    s.sender_name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-white">In Transit</h1>
      <Card className="border-[#1a1725] bg-[#0a0715]">
        <CardHeader><div className="flex items-center gap-2"><Search size={16} className="text-gray-400" /><Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="border-[#1a1725] bg-[#1a1725] text-white" /></div></CardHeader>
        <CardContent>
          <MobileTable
            cols={[
              { label: "Tracking #", key: "tracking_number", render: (s) => <span className="font-mono text-xs">{s.tracking_number || "—"}</span> },
              { label: "Sender", key: "sender_name" },
              { label: "Receiver", key: "receiver_name" },
              { label: "Status", key: "status", render: () => <Badge variant="outline" className="bg-blue-900/50 text-blue-400">in transit</Badge> },
              { label: "Date", key: "created_at", render: (s) => <span className="text-gray-400">{s.created_at ? new Date(s.created_at).toLocaleDateString() : "—"}</span> },
            ]}
            data={filtered}
          />
        </CardContent>
      </Card>
    </div>
  )
}


