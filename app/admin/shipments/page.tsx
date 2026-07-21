"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/db-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MobileTable } from "@/components/mobile-table"
import { Plus, Search } from "lucide-react"

const statusColors: Record<string, string> = {
  pending: "bg-yellow-900/50 text-yellow-400 border-yellow-700",
  in_transit: "bg-blue-900/50 text-blue-400 border-blue-700",
  delivered: "bg-green-900/50 text-green-400 border-green-700",
  returned: "bg-red-900/50 text-red-400 border-red-700",
  cancelled: "bg-gray-900/50 text-gray-400 border-gray-700",
  picked_up: "bg-purple-900/50 text-purple-400 border-purple-700",
}

export default function ShipmentsPage() {
  const [shipments, setShipments] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    loadShipments()
  }, [])

  async function loadShipments() {
    setLoading(true)
    const data = await db("parcels", "select", { order: { column: "created_at", ascending: false }, limit: 50 })
    if (data) setShipments(data)
    setLoading(false)
  }

  const filtered = shipments.filter(
    (s) =>
      s.tracking_number?.toLowerCase().includes(search.toLowerCase()) ||
      s.sender_name?.toLowerCase().includes(search.toLowerCase()) ||
      s.receiver_name?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="text-center text-gray-500 py-8">Loading...</div>

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Shipments</h1>
        <Button className="bg-[#FF3E41] hover:bg-[#d92e31]">
          <Plus size={16} className="mr-1" /> New Shipment
        </Button>
      </div>

      <Card className="border-[#1a1725] bg-[#0a0715]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search size={16} className="text-gray-400" />
            <Input
              placeholder="Search by tracking #, sender or receiver..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-[#1a1725] bg-[#1a1725] text-white"
            />
          </div>
        </CardHeader>
        <CardContent>
          <MobileTable
            cols={[
              { label: "Tracking #", key: "tracking_number", render: (s) => <span className="font-mono text-xs">{s.tracking_number || "—"}</span> },
              { label: "Sender", key: "sender_name" },
              { label: "Receiver", key: "receiver_name" },
              { label: "Status", key: "status", render: (s) => <Badge variant="outline" className={statusColors[s.status] || ""}>{s.status?.replace(/_/g, " ") || "pending"}</Badge> },
              { label: "Charge", key: "total_charge", render: (s) => `$${Number(s.total_charge || 0).toFixed(2)}` },
              { label: "Date", key: "created_at", render: (s) => <span className="text-gray-400">{s.created_at ? new Date(s.created_at).toLocaleDateString() : "—"}</span> },
            ]}
            data={filtered}
            onRowClick={(s) => window.location.href = `/admin/shipments/${s.id}`}
          />
        </CardContent>
      </Card>
    </div>
  )
}
