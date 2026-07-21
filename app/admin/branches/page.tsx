"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/db-client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { MobileTable } from "@/components/mobile-table"
import { Search, Plus, Pencil, Trash2 } from "lucide-react"

const blank = { name: "", city: "", phone: "", address: "", status: "active" }

export default function BranchesPage() {
  const [branches, setBranches] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [dialog, setDialog] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editing, setEditing] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(blank)

  const load = () => db<any[]>("branches", "select", { order: { column: "created_at", ascending: false } }).then((d) => { if (d) setBranches(d) })
  useEffect(() => { load() }, [])

  const openAdd = () => { setEditing(null); setForm(blank); setDialog(true) }
  const openEdit = (b: any) => { setEditing(b); setForm({ name: b.name, city: b.city || "", phone: b.phone || "", address: b.address || "", status: b.status }); setDialog(true) }

  const save = async () => {
    setSaving(true)
    if (editing) {
      await db("branches", "update", { data: form, eq: { id: editing.id } })
    } else {
      await db("branches", "insert", { data: form })
    }
    setSaving(false)
    setDialog(false)
    load()
  }

  const remove = async () => {
    if (!deleteId) return
    await db("branches", "delete", { eq: { id: deleteId } })
    setDeleteId(null)
    load()
  }

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const filtered = branches.filter((b) =>
    b.name?.toLowerCase().includes(search.toLowerCase()) ||
    b.city?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Branches</h1>
        <Button onClick={openAdd} className="bg-[#FF3E41] hover:bg-[#d92e31]"><Plus size={16} className="mr-1" /> Add</Button>
      </div>
      <Card style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)' }}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search size={16} style={{ color: 'var(--text-muted)' }} />
            <Input placeholder="Search branches..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }} />
          </div>
        </CardHeader>
        <CardContent>
          <MobileTable
            cols={[
              { label: "Name", key: "name" },
              { label: "City", key: "city", render: (b) => <span style={{ color: 'var(--text-muted)' }}>{b.city || "—"}</span> },
              { label: "Phone", key: "phone", render: (b) => <span style={{ color: 'var(--text-muted)' }}>{b.phone || "—"}</span> },
              { label: "Status", key: "status", render: (b) => <Badge variant="outline" className={b.status === "active" ? "bg-green-900/50 text-green-400" : "bg-yellow-900/50 text-yellow-400"}>{b.status || "active"}</Badge> },
              { label: "Actions", key: "actions", render: (b) => <div className="flex gap-2"><button onClick={() => openEdit(b)} className="text-blue-400 hover:text-blue-300"><Pencil size={14} /></button><button onClick={() => setDeleteId(b.id)} className="text-red-400 hover:text-red-300"><Trash2 size={14} /></button></div> },
            ]}
            data={filtered}
          />
        </CardContent>
      </Card>

      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>
          <DialogHeader><DialogTitle>{editing ? "Edit Branch" : "Add Branch"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><label className="mb-1 block text-sm" style={{ color: 'var(--text-muted)' }}>Name</label><Input value={form.name} onChange={set("name")} style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }} /></div>
            <div><label className="mb-1 block text-sm" style={{ color: 'var(--text-muted)' }}>City</label><Input value={form.city} onChange={set("city")} style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }} /></div>
            <div><label className="mb-1 block text-sm" style={{ color: 'var(--text-muted)' }}>Phone</label><Input value={form.phone} onChange={set("phone")} style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }} /></div>
            <div><label className="mb-1 block text-sm" style={{ color: 'var(--text-muted)' }}>Address</label><Input value={form.address} onChange={set("address")} style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }} /></div>
            <div>
              <label className="mb-1 block text-sm" style={{ color: 'var(--text-muted)' }}>Status</label>
              <select value={form.status} onChange={set("status")} className="w-full rounded-md border p-2 text-sm" style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialog(false)} style={{ color: 'var(--text-muted)' }}>Cancel</Button>
            <Button onClick={save} disabled={saving} className="bg-[#FF3E41] hover:bg-[#d92e31]">{saving ? "Saving..." : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={(o) => { if (!o) setDeleteId(null) }}>
        <DialogContent style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>
          <DialogHeader><DialogTitle>Delete Branch</DialogTitle></DialogHeader>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Are you sure? This cannot be undone.</p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteId(null)} style={{ color: 'var(--text-muted)' }}>Cancel</Button>
            <Button onClick={remove} className="bg-red-600 hover:bg-red-700">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
