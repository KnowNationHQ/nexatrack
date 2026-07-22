"use client"

import { useEffect, useState, useRef } from "react"
import { createClient } from "@/lib/supabase-browser"
import { db } from "@/lib/db-client"
import { MessageCircle, X, Send, Loader2 } from "lucide-react"

const CHAT_ID = "e837b78f-c5a5-46d7-8c7c-896ea7c00afe"

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    if (!open) return
    setLoading(true)
    db("livechat_messages", "select", {
      columns: "*",
      eq: { chat_id: CHAT_ID },
      order: { column: "created_at", ascending: true },
      limit: 50,
    }).then((data) => {
      if (data) setMessages(data)
      setLoading(false)
    })
    const channel = supabase
      .channel(`widget-chat-${CHAT_ID}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "livechat_messages", filter: `chat_id=eq.${CHAT_ID}` }, (payload) => {
        setMessages((prev) => [...prev, payload.new])
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function sendMessage() {
    if (!text.trim() || sending) return
    setSending(true)
    await db("livechat_messages", "insert", {
      data: { chat_id: CHAT_ID, content: text, sender_type: "visitor" },
    })
    setText("")
    setSending(false)
  }

  const isAgent = (m: any) => m.sender_type === "agent"

  return (
    <>
      {open && (
        <div style={{
          position: "fixed", bottom: "80px", right: "20px", zIndex: 9999,
          width: "360px", maxWidth: "calc(100vw - 40px)", height: "480px", maxHeight: "calc(100vh - 120px)",
          display: "flex", flexDirection: "column", borderRadius: "12px", overflow: "hidden",
          border: "1px solid var(--card-border)", boxShadow: "0 8px 32px rgba(255,62,65,0.15)",
          backgroundColor: "var(--card-bg)",
        }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "12px 16px",
            background: "linear-gradient(135deg, #FF3E41, #d92e31)", color: "#fff",
          }}>
            <div className="flex items-center gap-2">
              <div style={{width:8,height:8,borderRadius:4,backgroundColor:"#4ade80"}} />
              <span className="text-sm font-semibold">Live Chat</span>
            </div>
            <button onClick={() => setOpen(false)} className="p-0.5 rounded hover:bg-white/10 transition-colors">
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 p-3" style={{backgroundColor:'var(--main-bg)'}}>
            {loading ? (
              <div className="flex items-center justify-center h-full gap-2" style={{color:'var(--text-muted)'}}>
                <Loader2 size={14} className="animate-spin" />
                <span className="text-sm">Loading messages...</span>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4" style={{color:'var(--text-muted)'}}>
                <MessageCircle size={28} className="mb-2 opacity-40" />
                <p className="text-sm font-medium" style={{color:'var(--text-secondary)'}}>No messages yet</p>
                <p className="text-xs mt-1">Send us a message and we'll get back to you!</p>
              </div>
            ) : (
              messages.map((m, i) => (
                <div key={m.id || i} className={`flex ${isAgent(m) ? "justify-start" : "justify-end"}`}>
                  <div className="max-w-[85%] rounded-xl px-3 py-2 text-sm"
                    style={{
                      backgroundColor: isAgent(m) ? 'var(--card-border)' : 'var(--accent)',
                      color: isAgent(m) ? 'var(--text-primary)' : '#fff',
                      borderBottomLeftRadius: isAgent(m) ? '2px' : undefined,
                      borderBottomRightRadius: isAgent(m) ? undefined : '2px',
                    }}
                  >
                    {isAgent(m) && (
                      <p className="text-[10px] font-semibold mb-0.5" style={{color:'var(--accent)'}}>Support</p>
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

          <div className="flex gap-2 p-3" style={{
            borderTop: '1px solid var(--card-border)',
            backgroundColor: 'var(--card-bg)',
          }}>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage() }}}
              placeholder="Type a message..."
              className="flex-1 text-sm border rounded-lg px-3 py-2 outline-none transition-colors"
              style={{
                borderColor: 'var(--card-border)',
                backgroundColor: 'var(--input-bg)',
                color: 'var(--text-primary)',
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!text.trim() || sending}
              style={{
                backgroundColor: 'var(--accent)', color: '#fff', border: 'none',
                borderRadius: '8px', width: '38px', height: '38px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: !text.trim() || sending ? 'not-allowed' : 'pointer',
                opacity: !text.trim() || sending ? 0.5 : 1,
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed", bottom: "20px", right: "20px", zIndex: 9999,
          width: "56px", height: "56px", borderRadius: "50%",
          background: "linear-gradient(135deg, #FF3E41, #d92e31)",
          color: "#fff", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 20px rgba(255,62,65,0.35)",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.08)"; e.currentTarget.style.boxShadow = "0 6px 28px rgba(255,62,65,0.45)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(255,62,65,0.35)"; }}
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </>
  )
}
