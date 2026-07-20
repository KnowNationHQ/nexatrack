"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase-browser"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Plus } from "lucide-react"

export default function BranchesPage() {
  const [branches, setBranches] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const supabase = createClient()

  useEffect(() => {
    supabase.from("branches").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setBranches(data)
    })
  }, [])

  const filtered = branches.filter((b) =>
    b.name?.toLowerCase().includes(search.toLowerCase()) ||
    b.city?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Branches</h1>
        <Button className="bg-[#FF3E41] hover:bg-[#d92e31]"><Plus size={16} className="mr-1" /> Add Branch</Button>
      </div>
      <Card className="border-[#1a1725] bg-[#0a0715]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search size={16} className="text-gray-400" />
            <Input placeholder="Search branches..." value={search} onChange={(e) => setSearch(e.target.value)} className="border-[#1a1725] bg-[#1a1725] text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1a1725] text-left text-gray-400">
                  <th className="pb-3 pr-4 font-medium">Name</th>
                  <th className="pb-3 pr-4 font-medium">City</th>
                  <th className="pb-3 pr-4 font-medium">Phone</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr key={b.id} className="border-b border-[#1a1725] text-white hover:bg-[#1a1725]/50">
                    <td className="py-3 pr-4">{b.name}</td>
                    <td className="py-3 pr-4 text-gray-400">{b.city || "—"}</td>
                    <td className="py-3 pr-4 text-gray-400">{b.phone || "—"}</td>
                    <td className="py-3 pr-4">
                      <Badge variant="outline" className={b.status === "active" ? "bg-green-900/50 text-green-400" : "bg-yellow-900/50 text-yellow-400"}>
                        {b.status || "active"}
                      </Badge>
                    </td>
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
