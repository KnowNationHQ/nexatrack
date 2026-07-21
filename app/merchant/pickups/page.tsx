"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase-browser"
import { db } from "@/lib/db-client"
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
    try {
      await db("pickup_requests", "insert", {
        data: { merchant_id: user.id, address: form.address, city: form.city,
        preferred_date: form.preferred_date, preferred_time: form.preferred_time,
        parcel_count: Number(form.parcel_count) || 1, notes: form.notes, status: "pending" }
      })
      toast({ title: "Pickup requested" }); router.push("/merchant")
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" })
    }
    setLoading(false)
  }

  const set = (f: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((p) => ({ ...p, [f]: e.target.value }))

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Request Pickup</h1>
      <Card style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)' }}>
        <CardHeader><CardTitle style={{ color: 'var(--text-primary)' }}>Pickup Details</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="mb-1 block text-sm" style={{ color: 'var(--text-muted)' }}>Address</label><Input value={form.address} onChange={set("address")} required style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }} /></div>
            <div className="grid gap-4 md:grid-cols-2">
              <div><label className="mb-1 block text-sm" style={{ color: 'var(--text-muted)' }}>City</label><Input value={form.city} onChange={set("city")} required style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }} /></div>
              <div><label className="mb-1 block text-sm" style={{ color: 'var(--text-muted)' }}>Parcel Count</label><Input type="number" value={form.parcel_count} onChange={set("parcel_count")} style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }} /></div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div><label className="mb-1 block text-sm" style={{ color: 'var(--text-muted)' }}>Preferred Date</label><Input type="date" value={form.preferred_date} onChange={set("preferred_date")} style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }} /></div>
              <div><label className="mb-1 block text-sm" style={{ color: 'var(--text-muted)' }}>Preferred Time</label><Input type="time" value={form.preferred_time} onChange={set("preferred_time")} style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }} /></div>
            </div>
            <div><label className="mb-1 block text-sm" style={{ color: 'var(--text-muted)' }}>Notes</label><Input value={form.notes} onChange={set("notes")} style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }} /></div>
            <Button type="submit" disabled={loading} className="w-full bg-[#FF3E41] hover:bg-[#d92e31]">{loading ? "Submitting..." : "Request Pickup"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
