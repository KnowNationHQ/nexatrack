"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase-browser"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function PickupsPage() {
  const [pickups, setPickups] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const supabase = createClient()

  useEffect(() => {
    supabase.from("pickup_requests").select("*").order("created_at", { ascending: false }).then(({ data }) => {
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
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1a1725] text-left text-gray-400">
                  <th className="pb-3 pr-4 font-medium">Address</th>
                  <th className="pb-3 pr-4 font-medium">City</th>
                  <th className="pb-3 pr-4 font-medium">Parcels</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 pr-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b border-[#1a1725] text-white hover:bg-[#1a1725]/50">
                    <td className="py-3 pr-4">{p.address || "—"}</td>
                    <td className="py-3 pr-4 text-gray-400">{p.city || "—"}</td>
                    <td className="py-3 pr-4">{p.parcel_count || 1}</td>
                    <td className="py-3 pr-4">
                      <Badge variant="outline" className={p.status === "pending" ? "bg-yellow-900/50 text-yellow-400" : "bg-green-900/50 text-green-400"}>
                        {p.status || "pending"}
                      </Badge>
                    </td>
                    <td className="py-3 pr-4 text-gray-400">{p.created_at ? new Date(p.created_at).toLocaleDateString() : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
