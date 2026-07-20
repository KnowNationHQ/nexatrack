"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase-browser"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/hooks/use-toast"

export default function PickupRequestPage() {
  const [form, setForm] = useState({ address: "", city: "", preferred_date: "", preferred_time: "", parcel_count: "1", notes: "" })
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase.from("pickup_requests").insert({
      merchant_id: user.id, address: form.address, city: form.city,
      preferred_date: form.preferred_date, preferred_time: form.preferred_time,
      parcel_count: Number(form.parcel_count) || 1, notes: form.notes, status: "pending",
    })
    setLoading(false)
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }) }
    else { toast({ title: "Pickup requested" }); router.push("/merchant") }
  }

  const set = (f: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((p) => ({ ...p, [f]: e.target.value }))

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-white">Request Pickup</h1>
      <Card className="border-[#1a1725] bg-[#0a0715]">
        <CardHeader><CardTitle className="text-white">Pickup Details</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="mb-1 block text-sm text-gray-400">Address</label><Input value={form.address} onChange={set("address")} required className="border-[#1a1725] bg-[#1a1725] text-white" /></div>
            <div className="grid gap-4 md:grid-cols-2">
              <div><label className="mb-1 block text-sm text-gray-400">City</label><Input value={form.city} onChange={set("city")} required className="border-[#1a1725] bg-[#1a1725] text-white" /></div>
              <div><label className="mb-1 block text-sm text-gray-400">Parcel Count</label><Input type="number" value={form.parcel_count} onChange={set("parcel_count")} className="border-[#1a1725] bg-[#1a1725] text-white" /></div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div><label className="mb-1 block text-sm text-gray-400">Preferred Date</label><Input type="date" value={form.preferred_date} onChange={set("preferred_date")} className="border-[#1a1725] bg-[#1a1725] text-white" /></div>
              <div><label className="mb-1 block text-sm text-gray-400">Preferred Time</label><Input type="time" value={form.preferred_time} onChange={set("preferred_time")} className="border-[#1a1725] bg-[#1a1725] text-white" /></div>
            </div>
            <div><label className="mb-1 block text-sm text-gray-400">Notes</label><Input value={form.notes} onChange={set("notes")} className="border-[#1a1725] bg-[#1a1725] text-white" /></div>
            <Button type="submit" disabled={loading} className="w-full bg-[#FF3E41] hover:bg-[#d92e31]">{loading ? "Submitting..." : "Request Pickup"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
