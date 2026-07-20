"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase-browser"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function InTransitPage() {
  const [items, setItems] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const supabase = createClient()

  useEffect(() => {
    supabase.from("parcels").select("*").eq("status", "in_transit").order("created_at", { ascending: false }).limit(50).then(({ data }) => {
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
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[#1a1725] text-left text-gray-400"><th className="pb-3 pr-4 font-medium">Tracking #</th><th className="pb-3 pr-4 font-medium">Sender</th><th className="pb-3 pr-4 font-medium">Receiver</th><th className="pb-3 pr-4 font-medium">Status</th><th className="pb-3 pr-4 font-medium">Date</th></tr></thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b border-[#1a1725] text-white hover:bg-[#1a1725]/50">
                  <td className="py-3 pr-4 font-mono text-xs">{s.tracking_number || "—"}</td>
                  <td className="py-3 pr-4">{s.sender_name || "—"}</td>
                  <td className="py-3 pr-4">{s.receiver_name || "—"}</td>
                  <td className="py-3 pr-4"><Badge variant="outline" className="bg-blue-900/50 text-blue-400">in transit</Badge></td>
                  <td className="py-3 pr-4 text-gray-400">{s.created_at ? new Date(s.created_at).toLocaleDateString() : "—"}</td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={5} className="pt-4 text-center text-gray-500">No shipments in transit</td></tr>}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
