"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { db } from "@/lib/db-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/hooks/use-toast"
import { ArrowLeft, Package, DollarSign, Loader2, Edit3, Mail, Phone, MapPin, Calendar } from "lucide-react"

export default function MerchantDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { toast } = useToast()
  const [merchant, setMerchant] = useState<any>(null)
  const [shipments, setShipments] = useState<any[]>([])
  const [stats, setStats] = useState({ total: 0, inTransit: 0, delivered: 0, revenue: 0 })
  const [editOpen, setEditOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" })

  useEffect(() => {
    if (!id) return
    db<any>("profiles", "select", { eq: { id }, single: true }).then(d => {
      if (d) { setMerchant(d); setForm({ name: d.name || d.full_name || "", email: d.email || "", phone: d.phone || "", address: d.address || "" }) }
    })
    db<any[]>("parcels", "select", { eq: { merchant_id: id } }).then(d => {
      if (d) {
        setShipments(d)
        setStats({
          total: d.length,
          inTransit: d.filter(s => s.status === "in_transit" || s.status === "out_for_delivery").length,
          delivered: d.filter(s => s.status === "delivered").length,
          revenue: d.reduce((sum, s) => sum + Number(s.declared_value || 0), 0),
        })
      }
    })
  }, [id])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch("/api/admin/edit-merchant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: id, ...form }),
      })
      if (!res.ok) throw new Error((await res.json()).error || "Failed to update")
      toast({ title: "Merchant updated" })
      setEditOpen(false)
      setMerchant((prev: any) => ({ ...prev, name: form.name, email: form.email, phone: form.phone, address: form.address }))
    } catch (e: any) {
      toast({ title: e.message, variant: "destructive" })
    } finally { setSaving(false) }
  }

  if (!merchant) return <div className="flex h-40 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" style={{ color: 'var(--text-muted)' }} /></div>

  return (
    <div>
      <button onClick={() => router.back()} className="mb-4 flex items-center gap-1.5 text-sm transition-colors hover:text-[#FF3E41]" style={{ color: 'var(--text-muted)' }}>
        <ArrowLeft size={14} /> Back
      </button>

      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{merchant.name || merchant.full_name || "Merchant"}</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{merchant.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" style={merchant.banned ? {backgroundColor:'var(--badge-error-bg)',color:'var(--badge-error-text)'} : {backgroundColor:'var(--badge-success-bg)',color:'var(--badge-success-text)'}}>
            {merchant.banned ? "Banned" : "Active"}
          </Badge>
          <Button variant="outline" size="sm" onClick={() => setEditOpen(true)} style={{ borderColor: 'var(--card-border)', color: 'var(--text-muted)' }}>
            <Edit3 size={14} className="mr-1" /> Edit
          </Button>
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)' }}>
          <CardContent className="p-4">
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Total Shipments</p>
            <p className="mt-1 text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{stats.total}</p>
          </CardContent>
        </Card>
        <Card style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)' }}>
          <CardContent className="p-4">
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>In Transit</p>
            <p className="mt-1 text-2xl font-bold" style={{ color: '#f97316' }}>{stats.inTransit}</p>
          </CardContent>
        </Card>
        <Card style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)' }}>
          <CardContent className="p-4">
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Delivered</p>
            <p className="mt-1 text-2xl font-bold" style={{ color: '#22c55e' }}>{stats.delivered}</p>
          </CardContent>
        </Card>
        <Card style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)' }}>
          <CardContent className="p-4">
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Total Revenue</p>
            <p className="mt-1 text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>${stats.revenue.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <Card style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)' }}>
          <CardHeader><CardTitle className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Contact Info</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <Mail size={14} style={{ color: 'var(--text-muted)' }} /> {merchant.email}
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <Phone size={14} style={{ color: 'var(--text-muted)' }} /> {merchant.phone || "—"}
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <MapPin size={14} style={{ color: 'var(--text-muted)' }} /> {merchant.address || "—"}
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <Calendar size={14} style={{ color: 'var(--text-muted)' }} /> Joined {merchant.created_at ? new Date(merchant.created_at).toLocaleDateString() : "—"}
            </div>
          </CardContent>
        </Card>

        <Card style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)' }}>
          <CardHeader><CardTitle className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Recent Shipments</CardTitle></CardHeader>
          <CardContent>
            {shipments.length === 0 ? (
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No shipments yet</p>
            ) : (
              <div className="space-y-2">
                {shipments.slice(0, 5).map((s: any) => (
                  <div key={s.id} className="flex items-center justify-between rounded-lg border px-3 py-2" style={{ borderColor: 'var(--card-border)' }}>
                    <div>
                      <p className="text-sm font-mono" style={{ color: 'var(--text-primary)' }}>{s.tracking_number}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.destination_city || "—"}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px]" style={s.status === "delivered" ? {backgroundColor:'var(--badge-success-bg)',color:'var(--badge-success-text)'} : s.status === "in_transit" || s.status === "out_for_delivery" ? {backgroundColor:'var(--badge-info-bg)',color:'var(--badge-info-text)'} : {backgroundColor:'var(--badge-warning-bg)',color:'var(--badge-warning-text)'}}>
                      {s.status?.replace(/_/g, " ")}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md" style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>
          <DialogHeader>
            <DialogTitle style={{ color: 'var(--text-primary)' }}>Edit Merchant</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label style={{ color: 'var(--text-secondary)' }}>Name</Label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }} />
            </div>
            <div className="space-y-2">
              <Label style={{ color: 'var(--text-secondary)' }}>Email</Label>
              <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }} />
            </div>
            <div className="space-y-2">
              <Label style={{ color: 'var(--text-secondary)' }}>Phone</Label>
              <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }} />
            </div>
            <div className="space-y-2">
              <Label style={{ color: 'var(--text-secondary)' }}>Address</Label>
              <Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }} />
            </div>
            <Button type="submit" className="w-full bg-[#FF3E41] hover:bg-[#d92e31]" disabled={saving}>
              {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Changes"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
