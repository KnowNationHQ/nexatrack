"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase-browser"
import { db } from "@/lib/db-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/hooks/use-toast"

export default function MerchantTickets() {
  const [tickets, setTickets] = useState<any[]>([])
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      db<any[]>("support_tickets", "select", { eq: { user_id: user.id }, order: { column: "created_at", ascending: false } }).then((data) => {
        if (data) setTickets(data)
      })
    })
  }, [])

  const submitTicket = async () => {
    if (!subject.trim()) return
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    try {
      await db("support_tickets", "insert", { data: { user_id: user.id, subject, status: "open" } })
      toast({ title: "Ticket created" })
      setSubject(""); setMessage(""); setShowForm(false)
      const data = await db("support_tickets", "select", { eq: { user_id: user.id }, order: { column: "created_at", ascending: false } })
      if (data) setTickets(data)
    } catch (e: any) {
      toast({ title: "Error", variant: "destructive" })
    }
    setLoading(false)
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Support Tickets</h1>
        <Button onClick={() => setShowForm(!showForm)} className="bg-[#FF3E41] hover:bg-[#d92e31]">New Ticket</Button>
      </div>

      {showForm && (
        <Card className="mb-4" style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)' }}>
          <CardHeader><CardTitle style={{ color: 'var(--text-primary)' }}>New Ticket</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }} />
            <Input placeholder="Message (optional)" value={message} onChange={(e) => setMessage(e.target.value)} style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }} />
            <Button onClick={submitTicket} disabled={loading} className="bg-[#FF3E41] hover:bg-[#d92e31]">{loading ? "Submitting..." : "Submit"}</Button>
          </CardContent>
        </Card>
      )}

      <Card style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)' }}>
        <CardContent className="pt-6">
          {tickets.map((t) => (
            <div key={t.id} className="flex items-center justify-between border-b py-3" style={{ borderBottomColor: 'var(--card-border)', color: 'var(--text-primary)' }}>
              <div><p className="font-medium">{t.subject}</p><p className="text-xs" style={{ color: 'var(--text-muted)' }}>{new Date(t.created_at).toLocaleDateString()}</p></div>
              <Badge variant="outline" style={t.status === "open" ? {backgroundColor:'var(--badge-success-bg)',color:'var(--badge-success-text)'} : t.status === "in_progress" ? {backgroundColor:'var(--badge-info-bg)',color:'var(--badge-info-text)'} : {backgroundColor:'var(--badge-neutral-bg)',color:'var(--badge-neutral-text)'}}>{t.status}</Badge>
            </div>
          ))}
          {tickets.length === 0 && <p className="py-4 text-center" style={{ color: 'var(--text-muted)' }}>No tickets yet</p>}
        </CardContent>
      </Card>
    </div>
  )
}
