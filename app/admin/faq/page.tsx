"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/db-client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { MobileTable } from "@/components/mobile-table"
import { Search, Plus, Pencil, Trash2 } from "lucide-react"

const blank = { question: "", answer: "", sort_order: 0 }

export default function FAQPage() {
  const [items, setItems] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [dialog, setDialog] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editing, setEditing] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(blank)

  const load = () => db<any[]>("faqs", "select", { order: { column: "sort_order", ascending: true } }).then((d) => { if (d) setItems(d) })
  useEffect(() => { load() }, [])

  const openAdd = () => { setEditing(null); setForm(blank); setDialog(true) }
  const openEdit = (b: any) => { setEditing(b); setForm({ question: b.question, answer: b.answer || "", sort_order: b.sort_order || 0 }); setDialog(true) }

  const save = async () => {
    setSaving(true)
    if (editing) {
      await db("faqs", "update", { data: form, eq: { id: editing.id } })
    } else {
      await db("faqs", "insert", { data: form })
    }
    setSaving(false)
    setDialog(false)
    load()
  }

  const remove = async () => {
    if (!deleteId) return
    await db("faqs", "delete", { eq: { id: deleteId } })
    setDeleteId(null)
    load()
  }

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [field]: e.target.type === "number" ? Number(e.target.value) : e.target.value }))

  const filtered = items.filter((i) => i.question?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">FAQ</h1>
        <Button onClick={openAdd} className="bg-[#FF3E41] hover:bg-[#d92e31]"><Plus size={16} className="mr-1" /> Add</Button>
      </div>
      <Card className="border-[#1a1725] bg-[#0a0715]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search size={16} className="text-gray-400" />
            <Input placeholder="Search FAQ..." value={search} onChange={(e) => setSearch(e.target.value)} className="border-[#1a1725] bg-[#1a1725] text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <MobileTable
            cols={[
              { label: "Question", key: "question" },
              { label: "Answer", key: "answer", render: (i) => <span className="text-gray-400 max-w-xs truncate block">{i.answer || "—"}</span> },
              { label: "Sort Order", key: "sort_order", render: (i) => <span className="text-gray-400">{i.sort_order || 0}</span> },
              { label: "Actions", key: "actions", render: (i) => <div className="flex gap-2"><button onClick={() => openEdit(i)} className="text-blue-400 hover:text-blue-300"><Pencil size={14} /></button><button onClick={() => setDeleteId(i.id)} className="text-red-400 hover:text-red-300"><Trash2 size={14} /></button></div> },
            ]}
            data={filtered}
          />
        </CardContent>
      </Card>

      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent className="border-[#1a1725] bg-[#0a0715] text-white">
          <DialogHeader><DialogTitle>{editing ? "Edit FAQ" : "Add FAQ"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><label className="mb-1 block text-sm text-gray-400">Question</label><Input value={form.question} onChange={set("question")} className="border-[#1a1725] bg-[#1a1725] text-white" /></div>
            <div><label className="mb-1 block text-sm text-gray-400">Answer</label><Input value={form.answer} onChange={set("answer")} className="border-[#1a1725] bg-[#1a1725] text-white" /></div>
            <div><label className="mb-1 block text-sm text-gray-400">Sort Order</label><Input type="number" value={form.sort_order} onChange={set("sort_order")} className="border-[#1a1725] bg-[#1a1725] text-white" /></div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialog(false)} className="text-gray-400">Cancel</Button>
            <Button onClick={save} disabled={saving} className="bg-[#FF3E41] hover:bg-[#d92e31]">{saving ? "Saving..." : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={(o) => { if (!o) setDeleteId(null) }}>
        <DialogContent className="border-[#1a1725] bg-[#0a0715] text-white">
          <DialogHeader><DialogTitle>Delete FAQ</DialogTitle></DialogHeader>
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
