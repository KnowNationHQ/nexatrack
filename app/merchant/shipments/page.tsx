"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase-browser"
import { db } from "@/lib/db-client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function MerchantShipments() {
  const [shipments, setShipments] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      db<{ data: any[] }>("parcels", "select", { eq: { merchant_id: user.id }, order: { column: "created_at", ascending: false }, limit: 50 }).then(({ data }) => {
        if (data) setShipments(data)
      })
    })
  }, [])

  const filtered = shipments.filter((s) =>
    s.tracking_number?.toLowerCase().includes(search.toLowerCase()) ||
    s.receiver_name?.toLowerCase().includes(search.toLowerCase())
  )

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-900/50 text-yellow-400", in_transit: "bg-blue-900/50 text-blue-400",
    delivered: "bg-green-900/50 text-green-400", picked_up: "bg-purple-900/50 text-purple-400",
    cancelled: "bg-gray-900/50 text-gray-400", returned: "bg-red-900/50 text-red-400",
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-white">My Shipments</h1>
      <Card className="border-[#1a1725] bg-[#0a0715]">
        <CardHeader><div className="flex items-center gap-2"><Search size={16} className="text-gray-400" /><Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="border-[#1a1725] bg-[#1a1725] text-white" /></div></CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[#1a1725] text-left text-gray-400"><th className="pb-3 pr-4 font-medium">Tracking</th><th className="pb-3 pr-4 font-medium">Receiver</th><th className="pb-3 pr-4 font-medium">Destination</th><th className="pb-3 pr-4 font-medium">Status</th><th className="pb-3 pr-4 font-medium">Charge</th><th className="pb-3 pr-4 font-medium">Date</th></tr></thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="cursor-pointer border-b border-[#1a1725] text-white hover:bg-[#1a1725]/50" onClick={() => window.location.href = `/merchant/shipments/${s.id}`}>
                  <td className="py-3 pr-4 font-mono text-xs">{s.tracking_number || "—"}</td>
                  <td className="py-3 pr-4">{s.receiver_name || "—"}</td>
                  <td className="py-3 pr-4 text-gray-400">{s.destination_city || "—"}</td>
                  <td className="py-3 pr-4"><Badge variant="outline" className={statusColors[s.status] || ""}>{s.status?.replace(/_/g, " ")}</Badge></td>
                  <td className="py-3 pr-4">${Number(s.total_charge || 0).toFixed(2)}</td>
                  <td className="py-3 pr-4 text-gray-400">{s.created_at ? new Date(s.created_at).toLocaleDateString() : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
