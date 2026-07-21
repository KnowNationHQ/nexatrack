"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/db-client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MobileTable } from "@/components/mobile-table"
import { Search } from "lucide-react"

export default function MerchantsPage() {
  const [merchants, setMerchants] = useState<any[]>([])
  const [search, setSearch] = useState("")
  useEffect(() => {
    db<any[]>("profiles", "select", { eq: { role: "merchant" }, order: { column: "created_at", ascending: false } }).then((data) => {
      if (data) setMerchants(data)
    })
  }, [])

  const filtered = merchants.filter((m) =>
    m.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    m.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-white">Merchants</h1>
      <Card className="border-[#1a1725] bg-[#0a0715]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search size={16} className="text-gray-400" />
            <Input
              placeholder="Search merchants..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-[#1a1725] bg-[#1a1725] text-white"
            />
          </div>
        </CardHeader>
        <CardContent>
          <MobileTable
            cols={[
              { label: "Name", key: "full_name", render: (m) => m.full_name || "—" },
              { label: "Email", key: "email", render: (m) => <span className="text-gray-400">{m.email}</span> },
              { label: "Status", key: "banned", render: (m) => <Badge variant="outline" className={m.banned ? "bg-red-900/50 text-red-400" : "bg-green-900/50 text-green-400"}>{m.banned ? "Banned" : "Active"}</Badge> },
              { label: "Joined", key: "created_at", render: (m) => <span className="text-gray-400">{m.created_at ? new Date(m.created_at).toLocaleDateString() : "—"}</span> },
            ]}
            data={filtered}
          />
        </CardContent>
      </Card>
    </div>
  )
}


