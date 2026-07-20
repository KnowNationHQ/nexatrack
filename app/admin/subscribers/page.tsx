"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase-browser"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function SubscribersPage() {
  const [items, setItems] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const supabase = createClient()

  useEffect(() => {
    supabase.from("subscribers").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setItems(data)
    })
  }, [])

  const filtered = items.filter((i) => i.email?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-white">Subscribers</h1>
      <Card className="border-[#1a1725] bg-[#0a0715]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search size={16} className="text-gray-400" />
            <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="border-[#1a1725] bg-[#1a1725] text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[#1a1725] text-left text-gray-400"><th className="pb-3 pr-4 font-medium">Email</th><th className="pb-3 pr-4 font-medium">Subscribed</th></tr></thead>
            <tbody>
              {filtered.map((i) => (
                <tr key={i.id} className="border-b border-[#1a1725] text-white hover:bg-[#1a1725]/50">
                  <td className="py-3 pr-4">{i.email}</td>
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
