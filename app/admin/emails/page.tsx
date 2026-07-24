"use client"

import { useState, useEffect, useRef } from "react"
import { Mail, Send, Reply, Trash2, Search, RefreshCw, ChevronDown, Paperclip, X, AlertCircle, Loader2 } from "lucide-react"

type Email = {
  id: string
  subject: string
  from: { name: string; address: string }
  date: string
  text: string
  html: string
  seen: boolean
}

export default function EmailsPage() {
  const [emails, setEmails] = useState<Email[]>([])
  const [selected, setSelected] = useState<Email | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [showCompose, setShowCompose] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendStatus, setSendStatus] = useState<"idle" | "ok" | "err">("idle")
  const composeRef = useRef<HTMLDivElement>(null)

  const fetchEmails = async () => {
    setLoading(true)
    try {
      const r = await fetch("/api/emails/inbox")
      const d = await r.json()
      if (d.emails) setEmails(d.emails)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  useEffect(() => { fetchEmails() }, [])

  const filtered = emails.filter(e =>
    !search || e.subject.toLowerCase().includes(search.toLowerCase()) ||
    e.from.name.toLowerCase().includes(search.toLowerCase()) ||
    e.from.address.toLowerCase().includes(search.toLowerCase())
  )

  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSending(true)
    setSendStatus("idle")
    const fd = new FormData(e.currentTarget)
    const r = await fetch("/api/emails/send", {
      method: "POST",
      body: JSON.stringify({ to: fd.get("to"), subject: fd.get("subject"), text: fd.get("text") }),
    })
    if (r.ok) { setSendStatus("ok"); setTimeout(() => { setShowCompose(false); setSendStatus("idle") }, 1500) }
    else setSendStatus("err")
    setSending(false)
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-0 rounded-xl overflow-hidden" style={{ border: "1px solid var(--card-border)", backgroundColor: "var(--card-bg)" }}>
      {/* left panel */}
      <div className="w-96 flex-shrink-0 flex flex-col" style={{ borderRight: "1px solid var(--card-border)" }}>
        <div className="flex items-center gap-2 p-3" style={{ borderBottom: "1px solid var(--card-border)" }}>
          <button onClick={fetchEmails} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all" style={{ backgroundColor: "var(--accent-bg)", color: "var(--accent)" }}>
            <Mail size={15} /> Inbox
          </button>
          <button onClick={() => setShowCompose(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all" style={{ color: "var(--text-primary)", backgroundColor: "var(--input-bg)" }}>
            <Send size={14} /> Compose
          </button>
          <div className="flex-1" />
          <button onClick={fetchEmails} className="p-1.5 rounded-lg transition-all" style={{ color: "var(--text-muted)" }}>
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
        <div className="p-2" style={{ borderBottom: "1px solid var(--card-border)" }}>
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
            <input
              placeholder="Search emails..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-lg py-1.5 pl-8 pr-3 text-sm outline-none"
              style={{ backgroundColor: "var(--input-bg)", color: "var(--text-primary)", border: "1px solid transparent" }}
              onFocus={e => e.target.style.borderColor = "var(--accent)"}
              onBlur={e => e.target.style.borderColor = "transparent"}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading && <div className="flex items-center justify-center py-12"><Loader2 size={24} className="animate-spin" style={{ color: "var(--text-muted)" }} /></div>}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-12" style={{ color: "var(--text-muted)" }}>
              <Mail size={32} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">{search ? "No matches" : "No emails"}</p>
            </div>
          )}
          {filtered.map(email => (
            <button
              key={email.id}
              onClick={() => setSelected(email)}
              className="w-full text-left px-3 py-2.5 transition-all border-b"
              style={{
                borderColor: "var(--card-border)",
                backgroundColor: selected?.id === email.id ? "var(--accent-bg)" : email.seen ? "transparent" : "rgba(255,62,65,0.03)",
              }}
            >
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-medium truncate flex-1" style={{ color: "var(--text-primary)", fontWeight: email.seen ? 400 : 600 }}>{email.from.name}</span>
                <span className="text-xs whitespace-nowrap" style={{ color: "var(--text-muted)" }}>{new Date(email.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
              </div>
              <p className="text-sm truncate" style={{ color: "var(--text-secondary)", fontWeight: email.seen ? 400 : 500 }}>{email.subject}</p>
              <p className="text-xs truncate mt-0.5" style={{ color: "var(--text-muted)" }}>{email.text?.substring(0, 80)}</p>
            </button>
          ))}
        </div>
      </div>

      {/* right panel */}
      <div className="flex-1 flex flex-col">
        {!selected ? (
          <div className="flex-1 flex items-center justify-center" style={{ color: "var(--text-muted)" }}>
            <div className="text-center">
              <Mail size={48} className="mx-auto mb-3 opacity-20" />
              <p className="text-sm">Select an email to read</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 p-4" style={{ borderBottom: "1px solid var(--card-border)" }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: "var(--accent-bg)", color: "var(--accent)" }}>
                {selected.from.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>{selected.from.name}</p>
                <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{selected.from.address} — {new Date(selected.date).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-2 rounded-lg text-sm transition-all" style={{ color: "var(--text-muted)" }} title="Reply">
                  <Reply size={15} />
                </button>
                <button className="p-2 rounded-lg text-sm transition-all" style={{ color: "var(--text-muted)" }} title="Delete">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text-primary)" }}>{selected.subject}</h2>
              {selected.html ? (
                <iframe srcDoc={selected.html} className="w-full border-0" style={{ height: "calc(100vh - 20rem)", backgroundColor: "#fff", borderRadius: "8px" }} title="email content" />
              ) : (
                <p className="text-sm whitespace-pre-wrap leading-relaxed" style={{ color: "var(--text-secondary)" }}>{selected.text || "(no content)"}</p>
              )}
            </div>
            <div className="p-3" style={{ borderTop: "1px solid var(--card-border)" }}>
              <button
                onClick={() => setShowCompose(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{ backgroundColor: "var(--accent)", color: "#fff" }}
              >
                <Reply size={14} /> Reply
              </button>
            </div>
          </>
        )}
      </div>

      {/* compose modal */}
      {showCompose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => { if (!sending) setShowCompose(false) }}>
          <div ref={composeRef} className="w-full max-w-lg rounded-xl shadow-2xl" style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--card-border)" }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4" style={{ borderBottom: "1px solid var(--card-border)" }}>
              <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>New Message</span>
              <button onClick={() => setShowCompose(false)} className="p-1 rounded" style={{ color: "var(--text-muted)" }}><X size={18} /></button>
            </div>
            <form onSubmit={handleSend} className="p-4 space-y-3">
              <input name="to" type="email" placeholder="To" defaultValue={selected?.from.address || ""} required className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={{ backgroundColor: "var(--input-bg)", color: "var(--text-primary)", border: "1px solid var(--card-border)" }} />
              <input name="subject" type="text" placeholder="Subject" defaultValue={selected ? `Re: ${selected.subject}` : ""} required className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={{ backgroundColor: "var(--input-bg)", color: "var(--text-primary)", border: "1px solid var(--card-border)" }} />
              <textarea name="text" rows={6} placeholder="Write your message..." required className="w-full rounded-lg px-3 py-2 text-sm outline-none resize-none" style={{ backgroundColor: "var(--input-bg)", color: "var(--text-primary)", border: "1px solid var(--card-border)" }} />
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>Sends via Hostinger SMTP</span>
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
                  style={{ backgroundColor: "var(--accent)", color: "#fff" }}
                >
                  {sending ? <><Loader2 size={14} className="animate-spin" /> Sending...</> : <><Send size={14} /> Send</>}
                </button>
              </div>
              {sendStatus === "ok" && <p className="text-xs text-green-500">Sent successfully</p>}
              {sendStatus === "err" && <p className="text-xs text-red-500">Failed to send</p>}
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
