"use client"

import { useEffect, useState, useRef } from "react"
import { createClient } from "@/lib/supabase-browser"
import { db } from "@/lib/db-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Loader2 } from "lucide-react"

const PORTAL_CHAT_ID = "00000000-0000-0000-0000-000000000001"

export default function LiveChat({ role }: { role: "admin" | "merchant" | "driver" }) {
  const [messages, setMessages] = useState<any[]>([])
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      const data = await db("livechat_messages", "select", {
        columns: "id,content,created_at,sender_type",
        eq: { chat_id: PORTAL_CHAT_ID },
        order: { column: "created_at", ascending: true },
        limit: 50,
      })
      if (data) setMessages(data)
      setLoading(false)
    })()
    const channel = supabase
      .channel(`portal-chat-${PORTAL_CHAT_ID}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "livechat_messages", filter: `chat_id=eq.${PORTAL_CHAT_ID}` }, (payload) => {
        setMessages((prev) => [...prev, payload.new])
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function sendMessage() {
    if (!text.trim() || sending) return
    setSending(true)
    const { error } = await supabase.rpc("send_chat_message", {
      p_chat_id: PORTAL_CHAT_ID,
      p_content: text,
      p_sender_type: role,
    })
    if (!error) setText("")
    setSending(false)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-var(--header-h,9rem))]">
      <div className="flex-1 overflow-y-auto space-y-2 px-1">
        {loading ? (
          <div className="flex items-center justify-center h-full text-[var(--text-muted)] text-sm gap-2">
            <Loader2 size={14} className="animate-spin" />
            <span>Loading messages...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-[var(--text-muted)] text-sm">
            <p className="text-base font-medium" style={{ color: 'var(--text-secondary)' }}>No messages yet</p>
            <p className="mt-1">Start the conversation</p>
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={m.id || i} className={`flex ${m.sender_type === role ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] rounded-xl px-3 py-2 text-sm ${
                m.sender_type === role ? "rounded-br-sm" : "rounded-bl-sm"
              }`}
                style={{
                  backgroundColor: m.sender_type === role ? 'var(--accent)' : 'var(--input-bg)',
                  color: m.sender_type === role ? '#fff' : 'var(--text-primary)',
                }}
              >
                {m.sender_type !== role && (
                  <p className="text-[10px] font-medium mb-0.5 opacity-60 capitalize">{m.sender_type}</p>
                )}
                <p className="whitespace-pre-wrap break-words">{m.content}</p>
                <p className="mt-1 text-[10px] opacity-50 text-right">
                  {m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
      <div className="flex gap-2 pt-3 border-t sticky bottom-0" style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)' }}>
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
          placeholder="Type a message..."
          className="border text-sm flex-1"
          style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }}
        />
        <Button onClick={sendMessage} disabled={!text.trim() || sending} size="icon" className="shrink-0"
          style={{ backgroundColor: 'var(--accent)' }}>
          <Send size={16} />
        </Button>
      </div>
    </div>
  )
}
