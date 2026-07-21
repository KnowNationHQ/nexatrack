"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/db-client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { MobileTable } from "@/components/mobile-table"
import { useToast } from "@/components/hooks/use-toast"
import { Search, Plus, Trash2, Loader2 } from "lucide-react"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function MerchantsPage() {
  const [merchants, setMerchants] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", address: "" })
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const { toast } = useToast()

  const load = () => {
    db<any[]>("profiles", "select", { eq: { role: "merchant" }, order: { column: "created_at", ascending: false } }).then((data) => {
      if (data) setMerchants(data)
    })
  }
  useEffect(() => { load() }, [])

  const filtered = merchants.filter((m) =>
    m.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    m.email?.toLowerCase().includes(search.toLowerCase())
  )

  const addMerchant = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/admin/add-merchant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error((await res.json()).error || "Failed to add merchant")
      toast({ title: "Merchant added" })
      setOpen(false)
      setForm({ name: "", email: "", phone: "", password: "", address: "" })
      load()
    } catch (e: any) {
      toast({ title: e.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const deleteMerchant = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      const res = await fetch("/api/admin/delete-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: deleteId }),
      })
      if (!res.ok) throw new Error((await res.json()).error || "Failed to delete")
      toast({ title: "Merchant deleted" })
      setDeleteId(null)
      load()
    } catch (e: any) {
      toast({ title: e.message, variant: "destructive" })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Merchants</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#FF3E41] hover:bg-[#d92e31]">
              <Plus className="mr-2 h-4 w-4" /> Add Merchant
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md" style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>
            <DialogHeader>
              <DialogTitle style={{ color: 'var(--text-primary)' }}>Add Merchant</DialogTitle>
            </DialogHeader>
            <form onSubmit={addMerchant} className="space-y-4">
              <div className="space-y-2">
                <Label style={{ color: 'var(--text-secondary)' }}>Name *</Label>
                <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }} />
              </div>
              <div className="space-y-2">
                <Label style={{ color: 'var(--text-secondary)' }}>Email *</Label>
                <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }} />
              </div>
              <div className="space-y-2">
                <Label style={{ color: 'var(--text-secondary)' }}>Phone</Label>
                <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }} />
              </div>
              <div className="space-y-2">
                <Label style={{ color: 'var(--text-secondary)' }}>Password *</Label>
                <Input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }} />
              </div>
              <div className="space-y-2">
                <Label style={{ color: 'var(--text-secondary)' }}>Address</Label>
                <Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }} />
              </div>
              <Button type="submit" className="w-full bg-[#FF3E41] hover:bg-[#d92e31]" disabled={loading}>
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...</> : "Add Merchant"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)' }}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search size={16} style={{ color: 'var(--text-muted)' }} />
            <Input
              placeholder="Search merchants..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }}
            />
          </div>
        </CardHeader>
        <CardContent>
          <MobileTable
            cols={[
              { label: "Name", key: "full_name", render: (m) => m.full_name || "—" },
              { label: "Email", key: "email", render: (m) => <span style={{ color: 'var(--text-muted)' }}>{m.email}</span> },
              { label: "Status", key: "banned", render: (m) => <Badge variant="outline" className={m.banned ? "bg-red-900/50 text-red-400" : "bg-green-900/50 text-green-400"}>{m.banned ? "Banned" : "Active"}</Badge> },
              { label: "Joined", key: "created_at", render: (m) => <span style={{ color: 'var(--text-muted)' }}>{m.created_at ? new Date(m.created_at).toLocaleDateString() : "—"}</span> },
              { label: "", key: "actions", render: (m) => (
                <button onClick={(e) => { e.stopPropagation(); setDeleteId(m.id) }}
                  className="p-1.5 rounded-md transition-colors hover:bg-red-900/30"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#EF4444'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
                  <Trash2 size={14} />
                </button>
              )},
            ]}
            data={filtered}
          />
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)' }}>
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color: 'var(--text-primary)' }}>Delete Merchant?</AlertDialogTitle>
            <AlertDialogDescription style={{ color: 'var(--text-muted)' }}>
              This permanently deletes the merchant account, wallet, and unassigns their parcels. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel style={{ borderColor: 'var(--card-border)', color: 'var(--text-muted)' }}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteMerchant} disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white">
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
