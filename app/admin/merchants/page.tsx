"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase-browser"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"

export default function MerchantsPage() {
  const [merchants, setMerchants] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const supabase = createClient()

  useEffect(() => {
    supabase
      .from("profiles")
      .select("*")
      .eq("role", "merchant")
      .order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setMerchants(data) })
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
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1a1725] text-left text-gray-400">
                  <th className="pb-3 pr-4 font-medium">Name</th>
                  <th className="pb-3 pr-4 font-medium">Email</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 pr-4 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => (
                  <tr key={m.id} className="border-b border-[#1a1725] text-white hover:bg-[#1a1725]/50">
                    <td className="py-3 pr-4">{m.full_name || "—"}</td>
                    <td className="py-3 pr-4 text-gray-400">{m.email}</td>
                    <td className="py-3 pr-4">
                      <Badge variant="outline" className={m.banned ? "bg-red-900/50 text-red-400" : "bg-green-900/50 text-green-400"}>
                        {m.banned ? "Banned" : "Active"}
                      </Badge>
                    </td>
                    <td className="py-3 pr-4 text-gray-400">
                      {m.created_at ? new Date(m.created_at).toLocaleDateString() : "—"}
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
