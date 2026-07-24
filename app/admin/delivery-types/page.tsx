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

const blank = { name: "" }

export default function DeliveryTypesPage() {
  const [items, setItems] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [dialog, setDialog] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editing, setEditing] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(blank)

  const { toast } = useToast()
  const [pageLoading, setPageLoading] = useState(true)
  const load = () => db<any[]>("delivery_types", "select", { order: { column: "created_at", ascending: false } }).then((d) => { if (d) setItems(d) }).finally(() => setPageLoading(false))
  useEffect(() => { load() }, [])

  const openAdd = () => { setEditing(null); setForm(blank); setDialog(true) }
  const openEdit = (b: any) => { setEditing(b); setForm({ name: b.name }); setDialog(true) }

  const save = async () => {
    setSaving(true)
    if (editing) {
      await db("delivery_types", "update", { data: form, eq: { id: editing.id } })
    } else {
      await db("delivery_types", "insert", { data: form })
    }
    setSaving(false)
    setDialog(false)
    toast({ title: editing ? "Delivery type updated" : "Delivery type created" })
    load()
  }

  const remove = async () => {
    if (!deleteId) return
    await db("delivery_types", "delete", { eq: { id: deleteId } })
    setDeleteId(null)
    toast({ title: "Delivery type deleted" })
    load()
  }

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [field]: e.target.type === "number" ? Number(e.target.value) : e.target.value }))

  const filtered = items.filter((i) => i.name?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Delivery Types</h1>
        <Button onClick={openAdd} className="bg-[#FF3E41] hover:bg-[#d92e31]"><Plus size={16} className="mr-1" /> Add</Button>
      </div>
      {pageLoading ? (
        <div className="rounded-xl border p-5" style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)' }}>
          <TableSkeleton rows={5} />
        </div>
      ) : (
      <Card style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)' }}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search size={16} style={{ color: 'var(--text-muted)' }} />
            <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }} />
          </div>
        </CardHeader>
        <CardContent>
          <MobileTable
            cols={[
              { label: "Name", key: "name" },
              { label: "Actions", key: "actions", render: (i) => <div className="flex gap-2"><button onClick={() => openEdit(i)} className="text-blue-400 hover:text-[#FF3E41]"><Pencil size={14} /></button><button onClick={() => setDeleteId(i.id)} className="text-red-400 hover:text-[#d92e31]"><Trash2 size={14} /></button></div> },
            ]}
            data={filtered}
          />
        </CardContent>
      </Card>
      )}

      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>
          <DialogHeader><DialogTitle>{editing ? "Edit Delivery Type" : "Add Delivery Type"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><label className="mb-1 block text-sm" style={{ color: 'var(--text-muted)' }}>Name</label><Input value={form.name} onChange={set("name")} style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }} /></div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialog(false)} style={{ color: 'var(--text-muted)' }} onMouseEnter={e => e.currentTarget.style.color = '#FF3E41'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>Cancel</Button>
            <Button onClick={save} disabled={saving} className="bg-[#FF3E41] hover:bg-[#d92e31]">{saving ? "Saving..." : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={(o) => { if (!o) setDeleteId(null) }}>
        <DialogContent style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>
          <DialogHeader><DialogTitle>Delete Delivery Type</DialogTitle></DialogHeader>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Are you sure? This cannot be undone.</p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteId(null)} style={{ color: 'var(--text-muted)' }} onMouseEnter={e => e.currentTarget.style.color = '#FF3E41'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>Cancel</Button>
            <Button onClick={remove} className="bg-red-600 hover:bg-[#d92e31]">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
