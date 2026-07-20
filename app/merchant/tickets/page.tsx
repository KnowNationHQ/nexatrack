"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase-browser"
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
      supabase.from("support_tickets").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).then(({ data }) => {
        if (data) setTickets(data)
      })
    })
  }, [])

  const submitTicket = async () => {
    if (!subject.trim()) return
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase.from("support_tickets").insert({ user_id: user.id, subject, status: "open" })
    setLoading(false)
    if (error) { toast({ title: "Error", variant: "destructive" }) }
    else {
      toast({ title: "Ticket created" })
      setSubject(""); setMessage(""); setShowForm(false)
      const { data } = await supabase.from("support_tickets").select("*").eq("user_id", user.id).order("created_at", { ascending: false })
      if (data) setTickets(data)
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Support Tickets</h1>
        <Button onClick={() => setShowForm(!showForm)} className="bg-[#FF3E41] hover:bg-[#d92e31]">New Ticket</Button>
      </div>

      {showForm && (
        <Card className="mb-4 border-[#1a1725] bg-[#0a0715]">
          <CardHeader><CardTitle className="text-white">New Ticket</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="border-[#1a1725] bg-[#1a1725] text-white" />
            <Input placeholder="Message (optional)" value={message} onChange={(e) => setMessage(e.target.value)} className="border-[#1a1725] bg-[#1a1725] text-white" />
            <Button onClick={submitTicket} disabled={loading} className="bg-[#FF3E41] hover:bg-[#d92e31]">{loading ? "Submitting..." : "Submit"}</Button>
          </CardContent>
        </Card>
      )}

      <Card className="border-[#1a1725] bg-[#0a0715]">
        <CardContent className="pt-6">
          {tickets.map((t) => (
            <div key={t.id} className="flex items-center justify-between border-b border-[#1a1725] py-3 text-white">
              <div><p className="font-medium">{t.subject}</p><p className="text-xs text-gray-400">{new Date(t.created_at).toLocaleDateString()}</p></div>
              <Badge variant="outline" className={t.status === "open" ? "bg-green-900/50 text-green-400" : t.status === "in_progress" ? "bg-blue-900/50 text-blue-400" : "bg-gray-900/50 text-gray-400"}>{t.status}</Badge>
            </div>
          ))}
          {tickets.length === 0 && <p className="py-4 text-center text-gray-500">No tickets yet</p>}
        </CardContent>
      </Card>
    </div>
  )
}
