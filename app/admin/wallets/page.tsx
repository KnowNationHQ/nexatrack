"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/db-client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MobileTable } from "@/components/mobile-table"
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
          <MobileTable
            cols={[
              { label: "Merchant", key: "profiles", render: (i) => i.profiles?.full_name || "—" },
              { label: "Email", key: "profiles.email", render: (i) => <span className="text-gray-400">{i.profiles?.email || "—"}</span> },
              { label: "Balance", key: "balance", render: (i) => <span className="font-semibold">${Number(i.balance || 0).toFixed(2)}</span> },
            ]}
            data={items.filter((i) => !search || i.profiles?.full_name?.toLowerCase().includes(search.toLowerCase()))}
          />
        </CardContent>
      </Card>
    </div>
  )
}

