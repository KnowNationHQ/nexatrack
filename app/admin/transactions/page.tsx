"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/db-client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MobileTable } from "@/components/mobile-table"
import { Search } from "lucide-react"

export default function TransactionsPage() {
  const [items, setItems] = useState<any[]>([])
  const [search, setSearch] = useState("")
  useEffect(() => {
    db<any[]>("transactions", "select", { order: { column: "created_at", ascending: false }, limit: 50 }).then((data) => {
      if (data) setItems(data)
    })
  }, [])

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-white">Transactions</h1>
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
              { label: "Type", key: "type", render: (i) => <Badge variant="outline" className={i.type === "credit" ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"}>{i.type}</Badge> },
              { label: "Amount", key: "amount", render: (i) => <span className="font-semibold">${Number(i.amount || 0).toFixed(2)}</span> },
              { label: "Reference", key: "reference", render: (i) => <span className="text-gray-400 font-mono text-xs">{i.reference || "—"}</span> },
              { label: "Date", key: "created_at", render: (i) => <span className="text-gray-400">{i.created_at ? new Date(i.created_at).toLocaleDateString() : "—"}</span> },
            ]}
            data={items}
          />
        </CardContent>
      </Card>
    </div>
  )
}


