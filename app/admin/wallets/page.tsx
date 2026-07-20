"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/db-client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function WalletsPage() {
  const [items, setItems] = useState<any[]>([])
  const [search, setSearch] = useState("")
  useEffect(() => {
    db("wallets", "select", { columns: "*, profiles:merchant_id(full_name, email)", order: { column: "created_at", ascending: false } }).then((data) => {
      if (data) setItems(data)
    })
  }, [])

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-white">Wallets</h1>
      <Card className="border-[#1a1725] bg-[#0a0715]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search size={16} className="text-gray-400" />
            <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="border-[#1a1725] bg-[#1a1725] text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
          <div className="overflow-x-auto">`n          <table className="min-w-[600px] w-full text-sm">
            <thead><tr className="border-b border-[#1a1725] text-left text-gray-400"><th className="pb-3 pr-4 font-medium">Merchant</th><th className="pb-3 pr-4 font-medium">Email</th><th className="pb-3 pr-4 font-medium">Balance</th></tr></thead>
            <tbody>
              {items.filter((i) => !search || i.profiles?.full_name?.toLowerCase().includes(search.toLowerCase())).map((i) => (
                <tr key={i.id} className="border-b border-[#1a1725] text-white hover:bg-[#1a1725]/50">
                  <td className="py-3 pr-4">{i.profiles?.full_name || "—"}</td>
                  <td className="py-3 pr-4 text-gray-400">{i.profiles?.email || "—"}</td>
                  <td className="py-3 pr-4 font-semibold">${Number(i.balance || 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>`n        </div>`n        </div>
        </CardContent>
      </Card>
    </div>
  )
}

