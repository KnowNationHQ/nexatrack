"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/db-client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { MobileTable } from "@/components/mobile-table"
import { Search, Plus, Pencil, Trash2 } from "lucide-react"
import { TableSkeleton } from "@/components/ui/skeleton-table"
import { useToast } from "@/components/hooks/use-toast"

const blank = { category_id: "", weight: 0, same_day: 0, next_day: 0, sub_city: 0, outside_city: 0 }

export default function PricingPage() {
  const [items, setItems] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [dialog, setDialog] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editing, setEditing] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(blank)

  const { toast } = useToast()
  const [pageLoading, setPageLoading] = useState(true)
  const load = () => {
    Promise.all([
      db<any[]>("delivery_charges", "select", { columns: "*, delivery_categories(name)", order: { column: "created_at", ascending: false } }),
      db<any[]>("delivery_categories", "select", { order: { column: "name", ascending: true } }),
    ]).then(([d, c]) => {
      if (d) setItems(d)
      if (c) setCategories(c)
    }).finally(() => setPageLoading(false))
  }
  useEffect(() => { load() }, [])

  const openAdd = () => { setEditing(null); setForm(blank); setDialog(true) }
  const openEdit = (b: any) => {
    setEditing(b)
    setForm({
      category_id: b.category_id || "",
      weight: Number(b.weight || 0), same_day: Number(b.same_day || 0),
      next_day: Number(b.next_day || 0), sub_city: Number(b.sub_city || 0),
      outside_city: Number(b.outside_city || 0),
    })
    setDialog(true)
  }

  const save = async () => {
    setSaving(true)
    const data = { ...form, category_id: form.category_id || null }
    if (editing) {
      await db("delivery_charges", "update", { data, eq: { id: editing.id } })
    } else {
      await db("delivery_charges", "insert", { data })
    }
    setSaving(false)
    setDialog(false)
    toast({ title: editing ? "Pricing updated" : "Pricing created" })
    load()
  }

  const remove = async () => {
    if (!deleteId) return
    await db("delivery_charges", "delete", { eq: { id: deleteId } })
    setDeleteId(null)
    toast({ title: "Pricing deleted" })
    load()
  }

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const val = e.target.type === "number" ? Number(e.target.value) : e.target.value
    setForm((f) => ({ ...f, [field]: val }))
  }

  const filtered = items.filter((i) =>
    !search || i.delivery_categories?.name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 style={{color:'var(--text-primary)'}} className="text-2xl font-bold">Pricing</h1>
        <Button onClick={openAdd} className="bg-[#FF3E41] hover:bg-[#d92e31]"><Plus size={16} className="mr-1" /> Add</Button>
      </div>
      {pageLoading ? (
        <div className="rounded-xl border p-5" style={{borderColor:'var(--card-border)',backgroundColor:'var(--card-bg)'}}>
          <TableSkeleton rows={5} />
        </div>
      ) : (
      <Card style={{borderColor:'var(--card-border)',backgroundColor:'var(--card-bg)'}}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search size={16} style={{color:'var(--text-muted)'}} />
            <Input placeholder="Search by category..." value={search} onChange={(e) => setSearch(e.target.value)} style={{borderColor:'var(--card-border)',backgroundColor:'var(--input-bg)',color:'var(--text-primary)'}} />
          </div>
        </CardHeader>
        <CardContent>
          <MobileTable
            cols={[
              { label: "Category", key: "delivery_categories", render: (i) => i.delivery_categories?.name || "—" },
              { label: "Weight (kg)", key: "weight", render: (i) => Number(i.weight || 0) },
              { label: "Same Day", key: "same_day", render: (i) => `$${Number(i.same_day || 0).toFixed(2)}` },
              { label: "Next Day", key: "next_day", render: (i) => `$${Number(i.next_day || 0).toFixed(2)}` },
              { label: "Sub City", key: "sub_city", render: (i) => `$${Number(i.sub_city || 0).toFixed(2)}` },
              { label: "Outside", key: "outside_city", render: (i) => `$${Number(i.outside_city || 0).toFixed(2)}` },
              { label: "Actions", key: "actions", render: (i) => <div className="flex gap-2"><button onClick={() => openEdit(i)} className="text-blue-400 hover:text-blue-300"><Pencil size={14} /></button><button onClick={() => setDeleteId(i.id)} className="text-red-400 hover:text-red-300"><Trash2 size={14} /></button></div> },
            ]}
            data={filtered}
          />
        </CardContent>
      </Card>
      )}

      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent style={{borderColor:'var(--card-border)',backgroundColor:'var(--card-bg)',color:'var(--text-primary)'}}>
          <DialogHeader><DialogTitle>{editing ? "Edit Pricing" : "Add Pricing"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <label style={{color:'var(--text-muted)'}} className="mb-1 block text-sm">Category</label>
              <select value={form.category_id} onChange={set("category_id")} style={{borderColor:'var(--card-border)',backgroundColor:'var(--input-bg)',color:'var(--text-primary)'}} className="w-full rounded-md border p-2 text-sm">
                <option value="">Select category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div><label style={{color:'var(--text-muted)'}} className="mb-1 block text-sm">Weight (kg)</label><Input type="number" step="0.1" value={form.weight} onChange={set("weight")} style={{borderColor:'var(--card-border)',backgroundColor:'var(--input-bg)',color:'var(--text-primary)'}} /></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div><label style={{color:'var(--text-muted)'}} className="mb-1 block text-sm">Same Day ($)</label><Input type="number" step="0.01" value={form.same_day} onChange={set("same_day")} style={{borderColor:'var(--card-border)',backgroundColor:'var(--input-bg)',color:'var(--text-primary)'}} /></div>
              <div><label style={{color:'var(--text-muted)'}} className="mb-1 block text-sm">Next Day ($)</label><Input type="number" step="0.01" value={form.next_day} onChange={set("next_day")} style={{borderColor:'var(--card-border)',backgroundColor:'var(--input-bg)',color:'var(--text-primary)'}} /></div>
              <div><label style={{color:'var(--text-muted)'}} className="mb-1 block text-sm">Sub City ($)</label><Input type="number" step="0.01" value={form.sub_city} onChange={set("sub_city")} style={{borderColor:'var(--card-border)',backgroundColor:'var(--input-bg)',color:'var(--text-primary)'}} /></div>
              <div><label style={{color:'var(--text-muted)'}} className="mb-1 block text-sm">Outside City ($)</label><Input type="number" step="0.01" value={form.outside_city} onChange={set("outside_city")} style={{borderColor:'var(--card-border)',backgroundColor:'var(--input-bg)',color:'var(--text-primary)'}} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialog(false)} style={{color:'var(--text-muted)'}}>Cancel</Button>
            <Button onClick={save} disabled={saving} className="bg-[#FF3E41] hover:bg-[#d92e31]">{saving ? "Saving..." : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={(o) => { if (!o) setDeleteId(null) }}>
        <DialogContent style={{borderColor:'var(--card-border)',backgroundColor:'var(--card-bg)',color:'var(--text-primary)'}}>
          <DialogHeader><DialogTitle>Delete Pricing</DialogTitle></DialogHeader>
          <p style={{color:'var(--text-muted)'}} className="text-sm">Are you sure? This cannot be undone.</p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteId(null)} style={{color:'var(--text-muted)'}}>Cancel</Button>
            <Button onClick={remove} className="bg-red-600 hover:bg-red-700">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
