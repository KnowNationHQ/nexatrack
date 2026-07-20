"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase-browser"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function InvoicesPage() {
  const [items, setItems] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const supabase = createClient()

  useEffect(() => {
    supabase.from("invoices").select("*, profiles:merchant_id(full_name)").order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setItems(data)
    })
  }, [])

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-white">Invoices</h1>
      <Card className="border-[#1a1725] bg-[#0a0715]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search size={16} className="text-gray-400" />
            <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="border-[#1a1725] bg-[#1a1725] text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[#1a1725] text-left text-gray-400"><th className="pb-3 pr-4 font-medium">Invoice #</th><th className="pb-3 pr-4 font-medium">Merchant</th><th className="pb-3 pr-4 font-medium">Total</th><th className="pb-3 pr-4 font-medium">Status</th><th className="pb-3 pr-4 font-medium">Date</th></tr></thead>
            <tbody>
              {items.filter((i) => !search || i.invoice_no?.toLowerCase().includes(search.toLowerCase())).map((i) => (
                <tr key={i.id} className="border-b border-[#1a1725] text-white hover:bg-[#1a1725]/50">
                  <td className="py-3 pr-4 font-mono text-xs">{i.invoice_no || "—"}</td>
                  <td className="py-3 pr-4">{i.profiles?.full_name || "—"}</td>
                  <td className="py-3 pr-4 font-semibold">${Number(i.total || 0).toFixed(2)}</td>
                  <td className="py-3 pr-4"><Badge variant="outline" className={i.status === "paid" ? "bg-green-900/50 text-green-400" : i.status === "overdue" ? "bg-red-900/50 text-red-400" : "bg-yellow-900/50 text-yellow-400"}>{i.status || "pending"}</Badge></td>
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
