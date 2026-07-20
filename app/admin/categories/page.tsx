"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/db-client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Plus } from "lucide-react"

export default function CategoriesPage() {
  const [items, setItems] = useState<any[]>([])
  const [search, setSearch] = useState("")
  useEffect(() => {
    db<any[]>("delivery_categories", "select", { order: { column: "created_at", ascending: false } }).then((data) => {
      if (data) setItems(data)
    })
  }, [])

  const filtered = items.filter((i) => i.name?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Categories</h1>
        <Button className="bg-[#FF3E41] hover:bg-[#d92e31]"><Plus size={16} className="mr-1" /> Add</Button>
      </div>
      <Card className="border-[#1a1725] bg-[#0a0715]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search size={16} className="text-gray-400" />
            <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="border-[#1a1725] bg-[#1a1725] text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[#1a1725] text-left text-gray-400"><th className="pb-3 pr-4 font-medium">Name</th><th className="pb-3 pr-4 font-medium">Status</th></tr></thead>
            <tbody>
              {filtered.map((i) => (
                <tr key={i.id} className="border-b border-[#1a1725] text-white hover:bg-[#1a1725]/50">
                  <td className="py-3 pr-4">{i.name}</td>
                  <td className="py-3 pr-4"><Badge variant="outline" className={i.status === "active" ? "bg-green-900/50 text-green-400" : "bg-yellow-900/50 text-yellow-400"}>{i.status || "active"}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}

