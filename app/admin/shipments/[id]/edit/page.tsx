"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { db } from "@/lib/db-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/hooks/use-toast"
import { ArrowLeft } from "lucide-react"
import { DetailSkeleton } from "@/components/ui/skeleton-table"

export default function AdminEditShipment() {
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [merchants, setMerchants] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [deliveryTypes, setDeliveryTypes] = useState<any[]>([])
  const [form, setForm] = useState<any>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    Promise.all([
      db<any[]>("profiles", "select", { eq: { role: "merchant" }, order: { column: "created_at", ascending: false } }),
      db<any[]>("delivery_categories", "select", { order: { column: "name", ascending: true } }),
      db<any[]>("delivery_types", "select", { order: { column: "name", ascending: true } }),
      db<any>("parcels", "select", { eq: { id }, single: true }),
    ]).then(([m, c, t, p]) => {
      if (m) setMerchants(m)
      if (c) setCategories(c)
      if (t) setDeliveryTypes(t)
      if (p) {
        setForm({
          merchant_id: p.merchant_id || "",
          sender_name: p.sender_name || "",
          sender_phone: p.sender_phone || "",
          sender_address: p.sender_address || "",
          receiver_name: p.receiver_name || "",
          receiver_phone: p.receiver_phone || "",
          receiver_address: p.receiver_address || "",
          origin_city: p.origin_city || "",
          destination_city: p.destination_city || "",
          weight: p.weight?.toString() || "",
          category_id: p.category_id || "",
          delivery_type_id: p.delivery_type_id || "",
          priority: p.priority || "normal",
          delivery_charge: p.delivery_charge?.toString() || "",
          vat_amount: p.vat_amount?.toString() || "",
          cod_charge: p.cod_charge?.toString() || "",
          packaging_charge: p.packaging_charge?.toString() || "",
          liquid_fragile_charge: p.liquid_fragile_charge?.toString() || "",
          cod_amount: p.cod_amount?.toString() || "",
          payment_status: p.payment_status || "unpaid",
          notes: p.notes || "",
          status: p.status || "pending",
        })
      }
      setFetching(false)
    }).catch(() => setFetching(false))
  }, [id])

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f: any) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload: Record<string, any> = {
        sender_name: form.sender_name,
        sender_phone: form.sender_phone || null,
        sender_address: form.sender_address || null,
        receiver_name: form.receiver_name,
        receiver_phone: form.receiver_phone || null,
        receiver_address: form.receiver_address || null,
        origin_city: form.origin_city || null,
        destination_city: form.destination_city || null,
        weight: Number(form.weight) || 0,
        priority: form.priority || "normal",
        payment_status: form.payment_status || "unpaid",
        status: form.status || "pending",
        notes: form.notes || null,
      }
      if (form.merchant_id) payload.merchant_id = form.merchant_id
      else payload.merchant_id = null
      if (form.category_id) payload.category_id = form.category_id
      else payload.category_id = null
      if (form.delivery_type_id) payload.delivery_type_id = form.delivery_type_id
      else payload.delivery_type_id = null
      if (form.delivery_charge) payload.delivery_charge = Number(form.delivery_charge)
      else payload.delivery_charge = null
      if (form.vat_amount) payload.vat_amount = Number(form.vat_amount)
      else payload.vat_amount = null
      if (form.cod_charge) payload.cod_charge = Number(form.cod_charge)
      else payload.cod_charge = null
      if (form.packaging_charge) payload.packaging_charge = Number(form.packaging_charge)
      else payload.packaging_charge = null
      if (form.liquid_fragile_charge) payload.liquid_fragile_charge = Number(form.liquid_fragile_charge)
      else payload.liquid_fragile_charge = null
      if (form.cod_amount) payload.cod_amount = Number(form.cod_amount)
      else payload.cod_amount = null

      await db("parcels", "update", { eq: { id }, data: payload })
      toast({ title: "Shipment updated" })
      router.push(`/admin/shipments/${id}`)
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" })
    }
    setLoading(false)
  }

  if (fetching) return <DetailSkeleton />
  if (!form) return <p style={{ color: 'var(--text-muted)' }}>Shipment not found.</p>

  const inputStyle = { borderColor: 'var(--card-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }
  const labelStyle = { color: 'var(--text-muted)' }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.push(`/admin/shipments/${id}`)}
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Edit Shipment</h1>
      </div>

      <Card style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)' }}>
        <CardHeader><CardTitle style={{ color: 'var(--text-primary)' }}>Shipment Details</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Merchant</h2>
              <select value={form.merchant_id} onChange={set("merchant_id")}
                className="w-full rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF3E41]"
                style={{ border: '1px solid var(--card-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }}>
                <option value="">Select merchant (optional)</option>
                {merchants.map(m => (
                  <option key={m.id} value={m.id}>{m.full_name || m.email || m.id.slice(0, 8)}</option>
                ))}
              </select>
            </div>

            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Sender</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="mb-1 block text-sm" style={labelStyle}>Name *</label><Input value={form.sender_name} onChange={set("sender_name")} required style={inputStyle} /></div>
                <div><label className="mb-1 block text-sm" style={labelStyle}>Phone</label><Input value={form.sender_phone} onChange={set("sender_phone")} style={inputStyle} /></div>
              </div>
              <div className="mt-4"><label className="mb-1 block text-sm" style={labelStyle}>Address</label><Input value={form.sender_address} onChange={set("sender_address")} style={inputStyle} /></div>
            </div>

            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Receiver</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="mb-1 block text-sm" style={labelStyle}>Name *</label><Input value={form.receiver_name} onChange={set("receiver_name")} required style={inputStyle} /></div>
                <div><label className="mb-1 block text-sm" style={labelStyle}>Phone</label><Input value={form.receiver_phone} onChange={set("receiver_phone")} style={inputStyle} /></div>
              </div>
              <div className="mt-4"><label className="mb-1 block text-sm" style={labelStyle}>Address</label><Input value={form.receiver_address} onChange={set("receiver_address")} style={inputStyle} /></div>
            </div>

            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Route &amp; Category</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="mb-1 block text-sm" style={labelStyle}>Origin City</label><Input value={form.origin_city} onChange={set("origin_city")} style={inputStyle} /></div>
                <div><label className="mb-1 block text-sm" style={labelStyle}>Destination City</label><Input value={form.destination_city} onChange={set("destination_city")} style={inputStyle} /></div>
                <div><label className="mb-1 block text-sm" style={labelStyle}>Weight (kg) *</label><Input type="number" step="0.1" value={form.weight} onChange={set("weight")} required style={inputStyle} /></div>
                <div>
                  <label className="mb-1 block text-sm" style={labelStyle}>Category</label>
                  <select value={form.category_id} onChange={set("category_id")}
                    className="w-full rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF3E41]"
                    style={{ border: '1px solid var(--card-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }}>
                    <option value="">None</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm" style={labelStyle}>Delivery Type</label>
                  <select value={form.delivery_type_id} onChange={set("delivery_type_id")}
                    className="w-full rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF3E41]"
                    style={{ border: '1px solid var(--card-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }}>
                    <option value="">None</option>
                    {deliveryTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm" style={labelStyle}>Priority</label>
                  <select value={form.priority} onChange={set("priority")}
                    className="w-full rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF3E41]"
                    style={{ border: '1px solid var(--card-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }}>
                    <option value="normal">Normal</option>
                    <option value="express">Express</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm" style={labelStyle}>Status</label>
                  <select value={form.status} onChange={set("status")}
                    className="w-full rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF3E41]"
                    style={{ border: '1px solid var(--card-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }}>
                    {["pending","pickup_assign","picked_up","received_warehouse","delivery_man_assign","in_transit","out_for_delivery","partial_delivered","delivered","return_assign_to_merchant","return_received_by_merchant","cancelled"].map(s => (
                      <option key={s} value={s}>{s.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Charges</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                <div><label className="mb-1 block text-sm" style={labelStyle}>Delivery Charge</label><Input type="number" step="0.01" value={form.delivery_charge} onChange={set("delivery_charge")} style={inputStyle} /></div>
                <div><label className="mb-1 block text-sm" style={labelStyle}>VAT Amount</label><Input type="number" step="0.01" value={form.vat_amount} onChange={set("vat_amount")} style={inputStyle} /></div>
                <div><label className="mb-1 block text-sm" style={labelStyle}>COD Amount</label><Input type="number" step="0.01" value={form.cod_amount} onChange={set("cod_amount")} style={inputStyle} /></div>
                <div><label className="mb-1 block text-sm" style={labelStyle}>COD Charge</label><Input type="number" step="0.01" value={form.cod_charge} onChange={set("cod_charge")} style={inputStyle} /></div>
                <div><label className="mb-1 block text-sm" style={labelStyle}>Packaging Charge</label><Input type="number" step="0.01" value={form.packaging_charge} onChange={set("packaging_charge")} style={inputStyle} /></div>
                <div><label className="mb-1 block text-sm" style={labelStyle}>Liquid/Fragile Charge</label><Input type="number" step="0.01" value={form.liquid_fragile_charge} onChange={set("liquid_fragile_charge")} style={inputStyle} /></div>
              </div>
            </div>

            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Payment</h2>
              <select value={form.payment_status} onChange={set("payment_status")}
                className="w-full rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF3E41] sm:w-64"
                style={{ border: '1px solid var(--card-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }}>
                <option value="unpaid">Unpaid</option>
                <option value="paid">Paid</option>
                <option value="partial">Partial</option>
                <option value="cod">COD</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm" style={labelStyle}>Notes</label>
              <textarea value={form.notes} onChange={set("notes")} rows={3}
                className="w-full rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF3E41]"
                style={{ border: '1px solid var(--card-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }} />
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={loading} className="flex-1 bg-[#FF3E41] hover:bg-[#d92e31] disabled:opacity-50">
                {loading ? "Saving..." : "Save Changes"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push(`/admin/shipments/${id}`)}
                style={{ borderColor: 'var(--card-border)', color: 'var(--text-muted)' }}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
