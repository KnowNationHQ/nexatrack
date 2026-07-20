"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/db-client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function TicketsPage() {
  const [items, setItems] = useState<any[]>([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    db<{ data: any[] }>("support_tickets", "select", { columns: "*, profiles:user_id(full_name, email)", order: { column: "created_at", ascending: false } }).then(({ data }) => {
      if (data) setItems(data)
    })
  }, [])

  const filtered = items.filter((i) =>
    i.subject?.toLowerCase().includes(search.toLowerCase()) ||
    i.profiles?.full_name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-white">Support Tickets</h1>
      <Card className="border-[#1a1725] bg-[#0a0715]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search size={16} className="text-gray-400" />
            <Input placeholder="Search tickets..." value={search} onChange={(e) => setSearch(e.target.value)} className="border-[#1a1725] bg-[#1a1725] text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[#1a1725] text-left text-gray-400"><th className="pb-3 pr-4 font-medium">Subject</th><th className="pb-3 pr-4 font-medium">User</th><th className="pb-3 pr-4 font-medium">Status</th><th className="pb-3 pr-4 font-medium">Date</th></tr></thead>
            <tbody>
              {filtered.map((i) => (
                <tr key={i.id} className="border-b border-[#1a1725] text-white hover:bg-[#1a1725]/50">
                  <td className="py-3 pr-4">{i.subject}</td>
                  <td className="py-3 pr-4 text-gray-400">{i.profiles?.full_name || i.profiles?.email || "—"}</td>
                  <td className="py-3 pr-4">
                    <Badge variant="outline" className={
                      i.status === "open" ? "bg-green-900/50 text-green-400" :
                      i.status === "in_progress" ? "bg-blue-900/50 text-blue-400" :
                      "bg-gray-900/50 text-gray-400"
                    }>{i.status}</Badge>
                  </td>
                  <td className="py-3 pr-4 text-gray-400">{i.created_at ? new Date(i.created_at).toLocaleDateString() : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
