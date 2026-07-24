"use client"

import { useEffect, useState, useRef } from "react"
import { createClient } from "@/lib/supabase-browser"
import { db } from "@/lib/db-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Send, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface Reply {
  id: string
  sender_id: string
  message: string
  created_at: string
  profiles?: { full_name?: string; email?: string; role?: string }
}

interface Ticket {
  id: string
  subject: string
  status: string
  created_at: string
  user_id: string
  profiles?: { full_name?: string; email?: string }
}

export default function TicketConversation({ ticketId, isAdmin }: { ticketId: string; isAdmin?: boolean }) {
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [replies, setReplies] = useState<Reply[]>([])
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()
  const pathname = usePathname()

  useEffect(() => {
    Promise.all([
      db<any>("support_tickets", "select", { columns: "*, profiles:user_id(full_name, email)", eq: { id: ticketId }, single: true }),
      db<any[]>("ticket_replies", "select", { columns: "*, profiles:sender_id(full_name, email, role)", eq: { ticket_id: ticketId }, order: { column: "created_at", ascending: true } }),
    ]).then(([t, r]) => {
      setTicket(t)
      setReplies(r || [])
    }).finally(() => setLoading(false))
  }, [ticketId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [replies])

  const sendReply = async () => {
    if (!message.trim()) return
    setSending(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    try {
      const [reply] = await db<any[]>("ticket_replies", "insert", {
        data: { ticket_id: ticketId, sender_id: user.id, message: message.trim() },
      })
      if (ticket?.status === "open") {
        await db("support_tickets", "update", {
          data: { status: "in_progress" },
          eq: { id: ticketId },
        })
        setTicket({ ...ticket, status: "in_progress" } as Ticket)
      }
      const updated = await db<any[]>("ticket_replies", "select", {
        columns: "*, profiles:sender_id(full_name, email, role)",
        eq: { ticket_id: ticketId },
        order: { column: "created_at", ascending: true },
      })
      setReplies(updated || [])
      setMessage("")
    } catch { }
    setSending(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20" style={{ color: "var(--text-muted)" }}>
        Loading conversation...
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col rounded-xl border" style={{ borderColor: "var(--card-border)", backgroundColor: "var(--card-bg)" }}>
      <div className="flex items-center gap-3 border-b px-4 py-3" style={{ borderColor: "var(--card-border)" }}>
        <Link href={isAdmin ? "/admin/tickets" : pathname.includes("/driver/") ? "/driver/tickets" : "/merchant/tickets"}>
          <Button variant="ghost" size="icon"><ArrowLeft size={18} /></Button>
        </Link>
        <div className="flex-1">
          <h2 className="font-semibold" style={{ color: "var(--text-primary)" }}>{ticket?.subject}</h2>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            {ticket?.profiles?.full_name || ticket?.profiles?.email || "Unknown"} &middot; {ticket?.created_at ? new Date(ticket.created_at).toLocaleDateString() : ""}
          </p>
        </div>
        <Badge variant="outline" style={ticket?.status === "open" ? { backgroundColor: "var(--badge-success-bg)", color: "var(--badge-success-text)" } : ticket?.status === "in_progress" ? { backgroundColor: "var(--badge-info-bg)", color: "var(--badge-info-text)" } : { backgroundColor: "var(--badge-neutral-bg)", color: "var(--badge-neutral-text)" }}>
          {ticket?.status}
        </Badge>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex flex-col items-start">
          <div className="rounded-lg px-3 py-2 text-sm max-w-[80%]" style={{ backgroundColor: "var(--accent-bg)", color: "var(--text-primary)" }}>
            <p className="text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>{ticket?.profiles?.full_name || "User"} &middot; opened</p>
            <p>{ticket?.subject}</p>
          </div>
        </div>
        {replies.map((r) => {
          const isOwn = r.profiles?.role === "admin" || r.profiles?.role === "moderator"
          return (
            <div key={r.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
              <div className={`rounded-lg px-3 py-2 text-sm max-w-[80%] ${isOwn ? "bg-[#FF3E41] text-white" : ""}`} style={!isOwn ? { backgroundColor: "var(--accent-bg)", color: "var(--text-primary)" } : {}}>
                <p className="text-xs font-medium mb-1 opacity-80">{r.profiles?.full_name || "Support"}</p>
                <p>{r.message}</p>
                <p className="text-xs mt-1 opacity-60">{new Date(r.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 border-t px-4 py-3" style={{ borderColor: "var(--card-border)" }}>
        <Input
          placeholder="Type your reply..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendReply() } }}
          style={{ borderColor: "var(--card-border)", backgroundColor: "var(--input-bg)", color: "var(--text-primary)" }}
        />
        <Button onClick={sendReply} disabled={sending || !message.trim()} className="bg-[#FF3E41] hover:bg-[#d92e31]">
          <Send size={16} />
        </Button>
      </div>
    </div>
  )
}
