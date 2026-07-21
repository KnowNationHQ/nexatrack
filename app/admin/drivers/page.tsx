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
import { Search, Plus, Loader2 } from "lucide-react"

export default function DriversPage() {
  const [drivers, setDrivers] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", nid: "", address: "", location: "" })
  const { toast } = useToast()

  const load = () => {
    db<any[]>("profiles", "select", { eq: { role: "driver" }, order: { column: "created_at", ascending: false } }).then((data) => {
      if (data) setDrivers(data)
    })
  }
  useEffect(() => { load() }, [])

  const filtered = drivers.filter((d) =>
    (d.name || d.full_name || "")?.toLowerCase().includes(search.toLowerCase()) ||
    d.email?.toLowerCase().includes(search.toLowerCase()) ||
    d.phone?.includes(search)
  )

  const addDriver = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/admin/add-driver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error((await res.json()).error || "Failed to add driver")
      toast({ title: "Driver added" })
      setOpen(false)
      setForm({ name: "", email: "", phone: "", password: "", nid: "", address: "", location: "" })
      load()
    } catch (e: any) {
      toast({ title: e.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Drivers</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#FF3E41] hover:bg-[#d92e31]">
              <Plus className="mr-2 h-4 w-4" /> Add Driver
            </Button>
          </DialogTrigger>
          <DialogContent className="border-[#1a1725] bg-[#0a0715] text-white sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white">Add Driver</DialogTitle>
            </DialogHeader>
            <form onSubmit={addDriver} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Name *</Label>
                <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="border-[#1a1725] bg-[#0f0a1e] text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Email *</Label>
                <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required className="border-[#1a1725] bg-[#0f0a1e] text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Phone</Label>
                <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="border-[#1a1725] bg-[#0f0a1e] text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Password *</Label>
                <Input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required className="border-[#1a1725] bg-[#0f0a1e] text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">NID / License</Label>
                <Input value={form.nid} onChange={e => setForm({ ...form, nid: e.target.value })} className="border-[#1a1725] bg-[#0f0a1e] text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Address</Label>
                <Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="border-[#1a1725] bg-[#0f0a1e] text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Location / City</Label>
                <Input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="border-[#1a1725] bg-[#0f0a1e] text-white" />
              </div>
              <Button type="submit" className="w-full bg-[#FF3E41] hover:bg-[#d92e31]" disabled={loading}>
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...</> : "Add Driver"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-[#1a1725] bg-[#0a0715]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search size={16} className="text-gray-400" />
            <Input
              placeholder="Search drivers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-[#1a1725] bg-[#1a1725] text-white"
            />
          </div>
        </CardHeader>
        <CardContent>
          <MobileTable
            cols={[
              { label: "Name", key: "name", render: (d) => d.name || d.full_name || "—" },
              { label: "Email", key: "email", render: (d) => <span className="text-gray-400">{d.email}</span> },
              { label: "Phone", key: "phone", render: (d) => <span className="text-gray-400">{d.phone || "—"}</span> },
              { label: "Location", key: "location", render: (d) => <span className="text-gray-400">{d.location || "—"}</span> },
              { label: "Status", key: "status", render: (d) => <Badge variant="outline" className={(d.status === "active" ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400")}>{d.status === "active" ? "Active" : "Inactive"}</Badge> },
              { label: "Joined", key: "created_at", render: (d) => <span className="text-gray-400">{d.created_at ? new Date(d.created_at).toLocaleDateString() : "—"}</span> },
            ]}
            data={filtered}
          />
        </CardContent>
      </Card>
    </div>
  )
}


