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

const blank = { question: "", answer: "", sort_order: 0 }

export default function FAQPage() {
  const [items, setItems] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [dialog, setDialog] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editing, setEditing] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(blank)

  const { toast } = useToast()
  const [pageLoading, setPageLoading] = useState(true)
  const load = () => db<any[]>("faqs", "select", { order: { column: "sort_order", ascending: true } }).then((d) => { if (d) setItems(d) }).finally(() => setPageLoading(false))
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
    toast({ title: editing ? "FAQ updated" : "FAQ created" })
    load()
  }

  const remove = async () => {
    if (!deleteId) return
    await db("faqs", "delete", { eq: { id: deleteId } })
    setDeleteId(null)
    toast({ title: "FAQ deleted" })
    load()
  }

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [field]: e.target.type === "number" ? Number(e.target.value) : e.target.value }))

  const filtered = items.filter((i) => i.question?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 style={{color:'var(--text-primary)'}} className="text-2xl font-bold">FAQ</h1>
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
            <Input placeholder="Search FAQ..." value={search} onChange={(e) => setSearch(e.target.value)} style={{borderColor:'var(--card-border)',backgroundColor:'var(--input-bg)',color:'var(--text-primary)'}} />
          </div>
        </CardHeader>
        <CardContent>
          <MobileTable
            cols={[
              { label: "Question", key: "question" },
              { label: "Answer", key: "answer", render: (i) => <span style={{color:'var(--text-muted)'}} className="max-w-xs truncate block">{i.answer || "—"}</span> },
              { label: "Sort Order", key: "sort_order", render: (i) => <span style={{color:'var(--text-muted)'}}>{i.sort_order || 0}</span> },
              { label: "Actions", key: "actions", render: (i) => <div className="flex gap-2"><button onClick={() => openEdit(i)} className="text-blue-400 hover:text-[#FF3E41]"><Pencil size={14} /></button><button onClick={() => setDeleteId(i.id)} className="text-red-400 hover:text-[#d92e31]"><Trash2 size={14} /></button></div> },
            ]}
            data={filtered}
          />
        </CardContent>
      </Card>
      )}

      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent style={{borderColor:'var(--card-border)',backgroundColor:'var(--card-bg)',color:'var(--text-primary)'}}>
          <DialogHeader><DialogTitle>{editing ? "Edit FAQ" : "Add FAQ"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><label style={{color:'var(--text-muted)'}} className="mb-1 block text-sm">Question</label><Input value={form.question} onChange={set("question")} style={{borderColor:'var(--card-border)',backgroundColor:'var(--input-bg)',color:'var(--text-primary)'}} /></div>
            <div><label style={{color:'var(--text-muted)'}} className="mb-1 block text-sm">Answer</label><Input value={form.answer} onChange={set("answer")} style={{borderColor:'var(--card-border)',backgroundColor:'var(--input-bg)',color:'var(--text-primary)'}} /></div>
            <div><label style={{color:'var(--text-muted)'}} className="mb-1 block text-sm">Sort Order</label><Input type="number" value={form.sort_order} onChange={set("sort_order")} style={{borderColor:'var(--card-border)',backgroundColor:'var(--input-bg)',color:'var(--text-primary)'}} /></div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialog(false)} style={{color:'var(--text-muted)'}} onMouseEnter={e => e.currentTarget.style.color = '#FF3E41'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>Cancel</Button>
            <Button onClick={save} disabled={saving} className="bg-[#FF3E41] hover:bg-[#d92e31]">{saving ? "Saving..." : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={(o) => { if (!o) setDeleteId(null) }}>
        <DialogContent style={{borderColor:'var(--card-border)',backgroundColor:'var(--card-bg)',color:'var(--text-primary)'}}>
          <DialogHeader><DialogTitle>Delete FAQ</DialogTitle></DialogHeader>
          <p style={{color:'var(--text-muted)'}} className="text-sm">Are you sure? This cannot be undone.</p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteId(null)} style={{color:'var(--text-muted)'}} onMouseEnter={e => e.currentTarget.style.color = '#FF3E41'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>Cancel</Button>
            <Button onClick={remove} className="bg-red-600 hover:bg-[#d92e31]">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
