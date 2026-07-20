"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/db-client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Plus } from "lucide-react"

export default function PricingPage() {
  const [items, setItems] = useState<any[]>([])
  const [search, setSearch] = useState("")
  useEffect(() => {
    db("delivery_charges", "select", { columns: "*, delivery_categories(name)", order: { column: "created_at", ascending: false } }).then((data) => {
      if (data) setItems(data)
    })
  }, [])

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Pricing</h1>
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
            <thead><tr className="border-b border-[#1a1725] text-left text-gray-400"><th className="pb-3 pr-4 font-medium">Category</th><th className="pb-3 pr-4 font-medium">Weight</th><th className="pb-3 pr-4 font-medium">Same Day</th><th className="pb-3 pr-4 font-medium">Next Day</th><th className="pb-3 pr-4 font-medium">Sub City</th><th className="pb-3 pr-4 font-medium">Outside City</th></tr></thead>
            <tbody>
              {items.filter((i) => !search || i.delivery_categories?.name?.toLowerCase().includes(search.toLowerCase())).map((i) => (
                <tr key={i.id} className="border-b border-[#1a1725] text-white hover:bg-[#1a1725]/50">
                  <td className="py-3 pr-4">{i.delivery_categories?.name || "—"}</td>
                  <td className="py-3 pr-4">{i.weight}kg</td>
                  <td className="py-3 pr-4">${Number(i.same_day || 0).toFixed(2)}</td>
                  <td className="py-3 pr-4">${Number(i.next_day || 0).toFixed(2)}</td>
                  <td className="py-3 pr-4">${Number(i.sub_city || 0).toFixed(2)}</td>
                  <td className="py-3 pr-4">${Number(i.outside_city || 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
