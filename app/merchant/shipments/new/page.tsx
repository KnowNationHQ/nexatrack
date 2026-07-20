"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase-browser"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/hooks/use-toast"

export default function NewShipment() {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    sender_name: "", sender_phone: "", sender_address: "",
    receiver_name: "", receiver_phone: "", receiver_address: "",
    origin_city: "", destination_city: "",
    weight: "", category_id: "", delivery_type_id: "",
  })
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const tracking = "NXT-" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase()

    const { error } = await supabase.from("parcels").insert({
      merchant_id: user.id,
      tracking_number: tracking,
      sender_name: form.sender_name,
      sender_phone: form.sender_phone,
      sender_address: form.sender_address,
      receiver_name: form.receiver_name,
      receiver_phone: form.receiver_phone,
      receiver_address: form.receiver_address,
      origin_city: form.origin_city,
      destination_city: form.destination_city,
      weight: Number(form.weight) || 0,
      category_id: form.category_id || null,
      delivery_type_id: form.delivery_type_id || null,
      status: "pending",
    })

    setLoading(false)
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } else {
      toast({ title: "Shipment created", description: `Tracking: ${tracking}` })
      router.push("/merchant/shipments")
    }
  }

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [field]: e.target.value }))

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-white">New Shipment</h1>
      <Card className="border-[#1a1725] bg-[#0a0715]">
        <CardHeader><CardTitle className="text-white">Shipment Details</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div><label className="mb-1 block text-sm text-gray-400">Sender Name</label><Input value={form.sender_name} onChange={set("sender_name")} required className="border-[#1a1725] bg-[#1a1725] text-white" /></div>
              <div><label className="mb-1 block text-sm text-gray-400">Sender Phone</label><Input value={form.sender_phone} onChange={set("sender_phone")} required className="border-[#1a1725] bg-[#1a1725] text-white" /></div>
            </div>
            <div><label className="mb-1 block text-sm text-gray-400">Sender Address</label><Input value={form.sender_address} onChange={set("sender_address")} className="border-[#1a1725] bg-[#1a1725] text-white" /></div>
            <div className="grid gap-4 md:grid-cols-2">
              <div><label className="mb-1 block text-sm text-gray-400">Receiver Name</label><Input value={form.receiver_name} onChange={set("receiver_name")} required className="border-[#1a1725] bg-[#1a1725] text-white" /></div>
              <div><label className="mb-1 block text-sm text-gray-400">Receiver Phone</label><Input value={form.receiver_phone} onChange={set("receiver_phone")} required className="border-[#1a1725] bg-[#1a1725] text-white" /></div>
            </div>
            <div><label className="mb-1 block text-sm text-gray-400">Receiver Address</label><Input value={form.receiver_address} onChange={set("receiver_address")} className="border-[#1a1725] bg-[#1a1725] text-white" /></div>
            <div className="grid gap-4 md:grid-cols-2">
              <div><label className="mb-1 block text-sm text-gray-400">Origin City</label><Input value={form.origin_city} onChange={set("origin_city")} required className="border-[#1a1725] bg-[#1a1725] text-white" /></div>
              <div><label className="mb-1 block text-sm text-gray-400">Destination City</label><Input value={form.destination_city} onChange={set("destination_city")} required className="border-[#1a1725] bg-[#1a1725] text-white" /></div>
            </div>
            <div><label className="mb-1 block text-sm text-gray-400">Weight (kg)</label><Input type="number" step="0.1" value={form.weight} onChange={set("weight")} required className="border-[#1a1725] bg-[#1a1725] text-white" /></div>
            <Button type="submit" disabled={loading} className="w-full bg-[#FF3E41] hover:bg-[#d92e31]">
              {loading ? "Creating..." : "Create Shipment"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
