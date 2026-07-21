"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/db-client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MobileTable } from "@/components/mobile-table"
import { Search } from "lucide-react"

export default function PickupsPage() {
  const [pickups, setPickups] = useState<any[]>([])
  const [search, setSearch] = useState("")
  useEffect(() => {
    db<any[]>("pickup_requests", "select", { order: { column: "created_at", ascending: false } }).then((data) => {
      if (data) setPickups(data)
    })
  }, [])

  const filtered = pickups.filter((p) => p.address?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-white">Pickup Requests</h1>
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
              { label: "Address", key: "address", render: (p) => p.address || "—" },
              { label: "City", key: "city", render: (p) => <span className="text-gray-400">{p.city || "—"}</span> },
              { label: "Parcels", key: "parcel_count", render: (p) => p.parcel_count || 1 },
              { label: "Status", key: "status", render: (p) => <Badge variant="outline" className={p.status === "pending" ? "bg-yellow-900/50 text-yellow-400" : "bg-green-900/50 text-green-400"}>{p.status || "pending"}</Badge> },
              { label: "Date", key: "created_at", render: (p) => <span className="text-gray-400">{p.created_at ? new Date(p.created_at).toLocaleDateString() : "—"}</span> },
            ]}
            data={filtered}
          />
        </CardContent>
      </Card>
    </div>
  )
}


