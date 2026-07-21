"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/db-client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { MobileTable } from "@/components/mobile-table"
import { Search, Plus, Pencil, Trash2 } from "lucide-react"

const blank = { name: "", price: 0, description: "" }

export default function PackagingPage() {
  const [items, setItems] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [dialog, setDialog] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editing, setEditing] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(blank)

  const load = () => db<any[]>("packaging_options", "select", { order: { column: "created_at", ascending: false } }).then((d) => { if (d) setItems(d) })
  useEffect(() => { load() }, [])

  const openAdd = () => { setEditing(null); setForm(blank); setDialog(true) }
  const openEdit = (b: any) => { setEditing(b); setForm({ name: b.name, price: b.price || 0, description: b.description || "" }); setDialog(true) }

  const save = async () => {
    setSaving(true)
    if (editing) {
      await db("packaging_options", "update", { data: form, eq: { id: editing.id } })
    } else {
      await db("packaging_options", "insert", { data: form })
    }
    setSaving(false)
    setDialog(false)
    load()
  }

  const remove = async () => {
    if (!deleteId) return
    await db("packaging_options", "delete", { eq: { id: deleteId } })
    setDeleteId(null)
    load()
  }

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [field]: e.target.type === "number" ? Number(e.target.value) : e.target.value }))

  const filtered = items.filter((i) => i.name?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Packaging Options</h1>
        <Button onClick={openAdd} className="bg-[#FF3E41] hover:bg-[#d92e31]"><Plus size={16} className="mr-1" /> Add</Button>
      </div>
      <Card className="border-[#1a1725] bg-[#0a0715]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search size={16} className="text-gray-400" />
            <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="border-[#1a1725] bg-[#1a1725] text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <MobileTable
            cols={[
              { label: "Name", key: "name" },
              { label: "Price", key: "price", render: (i) => `$${Number(i.price || 0).toFixed(2)}` },
              { label: "Description", key: "description", render: (i) => <span className="text-gray-400">{i.description || "—"}</span> },
              { label: "Actions", key: "actions", render: (i) => <div className="flex gap-2"><button onClick={() => openEdit(i)} className="text-blue-400 hover:text-blue-300"><Pencil size={14} /></button><button onClick={() => setDeleteId(i.id)} className="text-red-400 hover:text-red-300"><Trash2 size={14} /></button></div> },
            ]}
            data={filtered}
          />
        </CardContent>
      </Card>

      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent className="border-[#1a1725] bg-[#0a0715] text-white">
          <DialogHeader><DialogTitle>{editing ? "Edit Packaging Option" : "Add Packaging Option"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><label className="mb-1 block text-sm text-gray-400">Name</label><Input value={form.name} onChange={set("name")} className="border-[#1a1725] bg-[#1a1725] text-white" /></div>
            <div><label className="mb-1 block text-sm text-gray-400">Price</label><Input type="number" step="0.01" value={form.price} onChange={set("price")} className="border-[#1a1725] bg-[#1a1725] text-white" /></div>
            <div><label className="mb-1 block text-sm text-gray-400">Description</label><Input value={form.description} onChange={set("description")} className="border-[#1a1725] bg-[#1a1725] text-white" /></div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialog(false)} className="text-gray-400">Cancel</Button>
            <Button onClick={save} disabled={saving} className="bg-[#FF3E41] hover:bg-[#d92e31]">{saving ? "Saving..." : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={(o) => { if (!o) setDeleteId(null) }}>
        <DialogContent className="border-[#1a1725] bg-[#0a0715] text-white">
          <DialogHeader><DialogTitle>Delete Packaging Option</DialogTitle></DialogHeader>
          <p className="text-sm text-gray-400">Are you sure? This cannot be undone.</p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteId(null)} className="text-gray-400">Cancel</Button>
            <Button onClick={remove} className="bg-red-600 hover:bg-red-700">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
