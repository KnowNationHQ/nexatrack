"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/db-client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Search, Plus, Pencil, Trash2 } from "lucide-react"

const blank = { delivery_category_id: "", origin_city: "", destination_city: "", base_price: 0, price_per_kg: 0 }

export default function PricingPage() {
  const [items, setItems] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [dialog, setDialog] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editing, setEditing] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(blank)

  const load = () => {
    db<any[]>("delivery_charges", "select", { columns: "*, delivery_categories(name)", order: { column: "created_at", ascending: false } }).then((d) => { if (d) setItems(d) })
    db<any[]>("delivery_categories", "select", { order: { column: "name", ascending: true } }).then((d) => { if (d) setCategories(d) })
  }
  useEffect(() => { load() }, [])

  const openAdd = () => { setEditing(null); setForm(blank); setDialog(true) }
  const openEdit = (b: any) => { setEditing(b); setForm({ delivery_category_id: b.delivery_category_id || "", origin_city: b.origin_city || "", destination_city: b.destination_city || "", base_price: b.base_price || 0, price_per_kg: b.price_per_kg || 0 }); setDialog(true) }

  const save = async () => {
    setSaving(true)
    const data = { ...form, delivery_category_id: form.delivery_category_id ? Number(form.delivery_category_id) : null }
    if (editing) {
      await db("delivery_charges", "update", { data, eq: { id: editing.id } })
    } else {
      await db("delivery_charges", "insert", { data })
    }
    setSaving(false)
    setDialog(false)
    load()
  }

  const remove = async () => {
    if (!deleteId) return
    await db("delivery_charges", "delete", { eq: { id: deleteId } })
    setDeleteId(null)
    load()
  }

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm((f) => ({ ...f, [field]: e.target.type === "number" ? Number(e.target.value) : e.target.value }))

  const filtered = items.filter((i) =>
    !search || i.delivery_categories?.name?.toLowerCase().includes(search.toLowerCase()) ||
    i.origin_city?.toLowerCase().includes(search.toLowerCase()) ||
    i.destination_city?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Pricing</h1>
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
          <div className="overflow-x-auto">
            <table className="min-w-[600px] w-full text-sm">
              <thead>
                <tr className="border-b border-[#1a1725] text-left text-gray-400">
                  <th className="pb-3 pr-4 font-medium">Category</th>
                  <th className="pb-3 pr-4 font-medium">Origin</th>
                  <th className="pb-3 pr-4 font-medium">Destination</th>
                  <th className="pb-3 pr-4 font-medium">Base Price</th>
                  <th className="pb-3 pr-4 font-medium">Price/kg</th>
                  <th className="pb-3 pr-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((i) => (
                  <tr key={i.id} className="border-b border-[#1a1725] text-white hover:bg-[#1a1725]/50">
                    <td className="py-3 pr-4">{i.delivery_categories?.name || "—"}</td>
                    <td className="py-3 pr-4 text-gray-400">{i.origin_city || "—"}</td>
                    <td className="py-3 pr-4 text-gray-400">{i.destination_city || "—"}</td>
                    <td className="py-3 pr-4">${Number(i.base_price || 0).toFixed(2)}</td>
                    <td className="py-3 pr-4">${Number(i.price_per_kg || 0).toFixed(2)}</td>
                    <td className="py-3 pr-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(i)} className="text-blue-400 hover:text-blue-300"><Pencil size={14} /></button>
                        <button onClick={() => setDeleteId(i.id)} className="text-red-400 hover:text-red-300"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent className="border-[#1a1725] bg-[#0a0715] text-white">
          <DialogHeader><DialogTitle>{editing ? "Edit Pricing" : "Add Pricing"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-gray-400">Category</label>
              <select value={form.delivery_category_id} onChange={set("delivery_category_id")} className="w-full rounded-md border border-[#1a1725] bg-[#1a1725] p-2 text-sm text-white">
                <option value="">Select category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div><label className="mb-1 block text-sm text-gray-400">Origin City</label><Input value={form.origin_city} onChange={set("origin_city")} className="border-[#1a1725] bg-[#1a1725] text-white" /></div>
            <div><label className="mb-1 block text-sm text-gray-400">Destination City</label><Input value={form.destination_city} onChange={set("destination_city")} className="border-[#1a1725] bg-[#1a1725] text-white" /></div>
            <div><label className="mb-1 block text-sm text-gray-400">Base Price</label><Input type="number" step="0.01" value={form.base_price} onChange={set("base_price")} className="border-[#1a1725] bg-[#1a1725] text-white" /></div>
            <div><label className="mb-1 block text-sm text-gray-400">Price per kg</label><Input type="number" step="0.01" value={form.price_per_kg} onChange={set("price_per_kg")} className="border-[#1a1725] bg-[#1a1725] text-white" /></div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialog(false)} className="text-gray-400">Cancel</Button>
            <Button onClick={save} disabled={saving} className="bg-[#FF3E41] hover:bg-[#d92e31]">{saving ? "Saving..." : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={(o) => { if (!o) setDeleteId(null) }}>
        <DialogContent className="border-[#1a1725] bg-[#0a0715] text-white">
          <DialogHeader><DialogTitle>Delete Pricing</DialogTitle></DialogHeader>
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
