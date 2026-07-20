"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/db-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Plus } from "lucide-react"

export default function PendingShipmentsPage() {
  const [shipments, setShipments] = useState<any[]>([])
  const [search, setSearch] = useState("")
  useEffect(() => {
    db("parcels", "select", { eq: { status: "pending" }, order: { column: "created_at", ascending: false }, limit: 50 }).then((data) => {
      if (data) setShipments(data)
    })
  }, [])

  const filtered = shipments.filter((s) =>
    s.tracking_number?.toLowerCase().includes(search.toLowerCase()) ||
    s.sender_name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Pending Shipments</h1>
        <Button className="bg-[#FF3E41] hover:bg-[#d92e31]"><Plus size={16} className="mr-1" /> New</Button>
      </div>
      <Card className="border-[#1a1725] bg-[#0a0715]">
        <CardHeader><div className="flex items-center gap-2"><Search size={16} className="text-gray-400" /><Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="border-[#1a1725] bg-[#1a1725] text-white" /></div></CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[#1a1725] text-left text-gray-400"><th className="pb-3 pr-4 font-medium">Tracking #</th><th className="pb-3 pr-4 font-medium">Sender</th><th className="pb-3 pr-4 font-medium">Receiver</th><th className="pb-3 pr-4 font-medium">Status</th><th className="pb-3 pr-4 font-medium">Date</th></tr></thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b border-[#1a1725] text-white hover:bg-[#1a1725]/50">
                  <td className="py-3 pr-4 font-mono text-xs">{s.tracking_number || "—"}</td>
                  <td className="py-3 pr-4">{s.sender_name || "—"}</td>
                  <td className="py-3 pr-4">{s.receiver_name || "—"}</td>
                  <td className="py-3 pr-4"><Badge variant="outline" className="bg-yellow-900/50 text-yellow-400">pending</Badge></td>
                  <td className="py-3 pr-4 text-gray-400">{s.created_at ? new Date(s.created_at).toLocaleDateString() : "—"}</td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={5} className="pt-4 text-center text-gray-500">No pending shipments</td></tr>}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
