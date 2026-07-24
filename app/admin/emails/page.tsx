"use client"

import { useState, useEffect } from "react"
import { Mail, Send, Search, RefreshCw, X, Loader2, Settings, ArrowLeft } from "lucide-react"
import { useToast } from "@/components/hooks/use-toast"

type Email = {
  id: string
  subject: string
  from: { name: string; address: string }
  date: string
  text: string
  html: string
  seen: boolean
}

type Tab = "inbox" | "settings"

export default function EmailsPage() {
  const { toast } = useToast()
  const [tab, setTab] = useState<Tab>("inbox")
  const [emails, setEmails] = useState<Email[]>([])
  const [selected, setSelected] = useState<Email | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [showDetail, setShowDetail] = useState(false)
  const [showCompose, setShowCompose] = useState(false)
  const [sending, setSending] = useState(false)
  const [to, setTo] = useState("")
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [imapHost, setImapHost] = useState("imap.hostinger.com")
  const [imapPort, setImapPort] = useState("993")
  const [imapUser, setImapUser] = useState("")
  const [imapPass, setImapPass] = useState("")
  const [saving, setSaving] = useState(false)

  const fetchEmails = async () => {
    setLoading(true)
    try {
      const r = await fetch("/api/emails/inbox")
      const d = await r.json()
      if (d.emails) setEmails(d.emails)
      if (d.error) console.error(d.error)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const loadSettings = async () => {
    try {
      const r = await fetch("/api/emails/settings")
      const d = await r.json()
      if (d.db) {
        setImapHost(d.db.imapHost)
        setImapPort(String(d.db.imapPort))
        setImapUser(d.db.imapUser)
        setImapPass(d.db.imapPass)
      }
    } catch (e) { console.error(e) }
  }

  useEffect(() => {
    if (tab === "inbox") fetchEmails()
    if (tab === "settings") loadSettings()
  }, [tab])

  const filtered = emails.filter(e =>
    !search || e.subject.toLowerCase().includes(search.toLowerCase()) ||
    e.from.name.toLowerCase().includes(search.toLowerCase()) ||
    e.from.address.toLowerCase().includes(search.toLowerCase())
  )

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    const r = await fetch("/api/emails/send", {
      method: "POST",
      body: JSON.stringify({ to, subject, text: body }),
    })
    if (r.ok) { toast({ title: "Email sent" }); setShowCompose(false); setTo(""); setSubject(""); setBody("") }
    else toast({ title: "Failed to send", variant: "destructive" })
    setSending(false)
  }

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      const r = await fetch("/api/emails/settings", {
        method: "POST",
        body: JSON.stringify({ imapHost, imapPort: Number(imapPort), imapUser, imapPass }),
      })
      const d = await r.json()
      if (d.success) toast({ title: "IMAP settings saved" })
    } catch (e) { console.error(e) }
    setSaving(false)
  }

  const openCompose = (replyTo?: string, replySubject?: string) => {
    setTo(replyTo || "")
    setSubject(replySubject ? `Re: ${replySubject}` : "")
    setBody("")
    setShowCompose(true)
  }

  return (
    <div>
      <div className="flex items-center gap-1 mb-4 p-1 rounded-lg w-full sm:w-auto overflow-x-auto" style={{ backgroundColor: "var(--input-bg)" }}>
        <button onClick={() => setTab("inbox")} className="flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-all" style={{ backgroundColor: tab === "inbox" ? "var(--accent-bg)" : "transparent", color: tab === "inbox" ? "var(--accent)" : "var(--text-muted)" }}>
          <Mail size={15} /> Inbox
        </button>
        <button onClick={() => setTab("settings")} className="flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-all" style={{ backgroundColor: tab === "settings" ? "var(--accent-bg)" : "transparent", color: tab === "settings" ? "var(--accent)" : "var(--text-muted)" }}>
          <Settings size={15} /> Settings
        </button>
      </div>

      {tab === "inbox" ? (
        <>
          {/* mobile: list view */}
          <div className={`flex flex-col sm:hidden ${showDetail ? "hidden" : ""}`} style={{ height: "calc(100vh - 12rem)" }}>
            <div className="flex items-center gap-2 px-3 py-2" style={{ borderBottom: "1px solid var(--card-border)" }}>
              <button onClick={() => openCompose()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium" style={{ backgroundColor: "var(--accent)", color: "#fff" }}>
                <Send size={14} /> Compose
              </button>
              <div className="flex-1" />
              <button onClick={fetchEmails} className="p-1.5 rounded-lg" style={{ color: "var(--text-muted)" }}>
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              </button>
            </div>
            <div className="px-2 py-1.5" style={{ borderBottom: "1px solid var(--card-border)" }}>
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="w-full rounded-lg py-1.5 pl-8 pr-3 text-sm outline-none" style={{ backgroundColor: "var(--input-bg)", color: "var(--text-primary)" }} />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto rounded-xl" style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
              {loading && <div className="flex items-center justify-center py-12"><Loader2 size={24} className="animate-spin" style={{ color: "var(--text-muted)" }} /></div>}
              {!loading && filtered.length === 0 && (
                <div className="text-center py-12" style={{ color: "var(--text-muted)" }}>
                  <Mail size={32} className="mx-auto mb-2 opacity-40" />
                  <p className="text-sm">{search ? "No matches" : "No emails"}</p>
                </div>
              )}
              {filtered.map(email => (
                <button key={email.id} onClick={() => { setSelected(email); setShowDetail(true) }} className="w-full text-left px-3 py-3 transition-all border-b" style={{ borderColor: "var(--card-border)", backgroundColor: email.seen ? "transparent" : "rgba(255,62,65,0.03)" }}>
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

          {/* mobile: detail view */}
          <div className={`sm:hidden ${showDetail ? "flex" : "hidden"} flex-col`} style={{ height: "calc(100vh - 12rem)" }}>
            {selected && (
              <>
                <div className="flex items-center gap-2 px-3 py-2" style={{ borderBottom: "1px solid var(--card-border)" }}>
                  <button onClick={() => setShowDetail(false)} className="p-1 rounded-lg" style={{ color: "var(--text-muted)" }}>
                    <ArrowLeft size={20} />
                  </button>
                  <div className="flex-1" />
                  <button onClick={() => openCompose(selected.from.address, selected.subject)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: "var(--accent)", color: "#fff" }}>
                    <Send size={14} /> Reply
                  </button>
                </div>
                <div className="flex items-center gap-3 px-3 py-3" style={{ borderBottom: "1px solid var(--card-border)" }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ backgroundColor: "var(--accent-bg)", color: "var(--accent)" }}>
                    {selected.from.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>{selected.from.name}</p>
                    <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{selected.from.address}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{new Date(selected.date).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto px-3 py-3">
                  <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text-primary)" }}>{selected.subject}</h2>
                  {selected.html ? (
                    <iframe srcDoc={selected.html} className="w-full border-0 rounded-lg" style={{ height: "60vh", backgroundColor: "#fff" }} title="email" />
                  ) : (
                    <p className="text-sm whitespace-pre-wrap leading-relaxed" style={{ color: "var(--text-secondary)" }}>{selected.text || "(no content)"}</p>
                  )}
                </div>
              </>
            )}
          </div>

          {/* desktop: split view */}
          <div className="hidden sm:flex" style={{ height: "calc(100vh - 12rem)" }}>
            <div className="w-80 lg:w-96 flex-shrink-0 flex flex-col rounded-l-xl" style={{ border: "1px solid var(--card-border)", backgroundColor: "var(--card-bg)" }}>
              <div className="flex items-center gap-2 p-3" style={{ borderBottom: "1px solid var(--card-border)" }}>
                <button onClick={() => openCompose()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium" style={{ backgroundColor: "var(--accent)", color: "#fff" }}>
                  <Send size={14} /> Compose
                </button>
                <div className="flex-1" />
                <button onClick={fetchEmails} className="p-1.5 rounded-lg" style={{ color: "var(--text-muted)" }}>
                  <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
                </button>
              </div>
              <div className="p-2" style={{ borderBottom: "1px solid var(--card-border)" }}>
                <div className="relative">
                  <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                  <input placeholder="Search emails..." value={search} onChange={e => setSearch(e.target.value)} className="w-full rounded-lg py-1.5 pl-8 pr-3 text-sm outline-none" style={{ backgroundColor: "var(--input-bg)", color: "var(--text-primary)", border: "1px solid transparent" }} onFocus={e => e.target.style.borderColor = "var(--accent)"} onBlur={e => e.target.style.borderColor = "transparent"} />
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
                  <button key={email.id} onClick={() => setSelected(email)} className="w-full text-left px-3 py-2.5 transition-all border-b" style={{ borderColor: "var(--card-border)", backgroundColor: selected?.id === email.id ? "var(--accent-bg)" : email.seen ? "transparent" : "rgba(255,62,65,0.03)" }}>
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

            <div className="flex-1 flex flex-col rounded-r-xl" style={{ border: "1px solid var(--card-border)", borderLeft: 0, backgroundColor: "var(--card-bg)" }}>
              {!selected ? (
                <div className="flex-1 flex items-center justify-center" style={{ color: "var(--text-muted)" }}>
                  <div className="text-center">
                    <Mail size={48} className="mx-auto mb-3 opacity-20" />
                    <p className="text-sm">Select an email to read</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: "1px solid var(--card-border)" }}>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ backgroundColor: "var(--accent-bg)", color: "var(--accent)" }}>
                      {selected.from.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>{selected.from.name}</p>
                      <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{selected.from.address} — {new Date(selected.date).toLocaleString()}</p>
                    </div>
                    <button onClick={() => openCompose(selected.from.address, selected.subject)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm" style={{ color: "var(--text-primary)", backgroundColor: "var(--input-bg)" }}>
                      <Send size={14} /> Reply
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4">
                    <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text-primary)" }}>{selected.subject}</h2>
                    {selected.html ? (
                      <iframe srcDoc={selected.html} className="w-full border-0" style={{ height: "calc(100vh - 20rem)", backgroundColor: "#fff", borderRadius: "8px" }} title="email" />
                    ) : (
                      <p className="text-sm whitespace-pre-wrap leading-relaxed" style={{ color: "var(--text-secondary)" }}>{selected.text || "(no content)"}</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="max-w-xl mx-auto mt-4 sm:mt-8 px-0 sm:px-4">
          <div className="rounded-xl p-4 sm:p-6" style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0" style={{ backgroundColor: "var(--accent-bg)" }}>
                <Settings size={18} style={{ color: "var(--accent)" }} />
              </div>
              <div>
                <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>Email Connection</h2>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: "var(--text-muted)" }}>IMAP Host</label>
                <input value={imapHost} onChange={e => setImapHost(e.target.value)} className="w-full rounded-lg px-3 py-2.5 text-sm outline-none" style={{ backgroundColor: "var(--input-bg)", color: "var(--text-primary)", border: "1px solid var(--card-border)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: "var(--text-muted)" }}>IMAP Port</label>
                <input value={imapPort} onChange={e => setImapPort(e.target.value)} className="w-full rounded-lg px-3 py-2.5 text-sm outline-none" style={{ backgroundColor: "var(--input-bg)", color: "var(--text-primary)", border: "1px solid var(--card-border)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: "var(--text-muted)" }}>IMAP Username</label>
                <input value={imapUser} onChange={e => setImapUser(e.target.value)} className="w-full rounded-lg px-3 py-2.5 text-sm outline-none" style={{ backgroundColor: "var(--input-bg)", color: "var(--text-primary)", border: "1px solid var(--card-border)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: "var(--text-muted)" }}>IMAP Password</label>
                <input type="password" value={imapPass} onChange={e => setImapPass(e.target.value)} className="w-full rounded-lg px-3 py-2.5 text-sm outline-none" style={{ backgroundColor: "var(--input-bg)", color: "var(--text-primary)", border: "1px solid var(--card-border)" }} />
              </div>
            </div>

            <div className="flex justify-end mt-6 pt-4" style={{ borderTop: "1px solid var(--card-border)" }}>
              <button onClick={handleSaveSettings} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50" style={{ backgroundColor: "var(--accent)", color: "#fff" }}>
                {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : <><RefreshCw size={14} /> Sync</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {showCompose && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => { if (!sending) setShowCompose(false) }}>
          <div className="w-full sm:max-w-lg rounded-t-xl sm:rounded-xl shadow-2xl" style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--card-border)", maxHeight: "90vh" }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4" style={{ borderBottom: "1px solid var(--card-border)" }}>
              <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>New Message</span>
              <button onClick={() => setShowCompose(false)} className="p-1 rounded" style={{ color: "var(--text-muted)" }}><X size={18} /></button>
            </div>
            <form onSubmit={handleSend} className="p-4 space-y-3 overflow-y-auto" style={{ maxHeight: "calc(90vh - 60px)" }}>
              <input type="email" placeholder="To" value={to} onChange={e => setTo(e.target.value)} required className="w-full rounded-lg px-3 py-2.5 text-sm outline-none" style={{ backgroundColor: "var(--input-bg)", color: "var(--text-primary)", border: "1px solid var(--card-border)" }} />
              <input type="text" placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} required className="w-full rounded-lg px-3 py-2.5 text-sm outline-none" style={{ backgroundColor: "var(--input-bg)", color: "var(--text-primary)", border: "1px solid var(--card-border)" }} />
              <textarea rows={6} placeholder="Write your message..." value={body} onChange={e => setBody(e.target.value)} required className="w-full rounded-lg px-3 py-2.5 text-sm outline-none resize-none" style={{ backgroundColor: "var(--input-bg)", color: "var(--text-primary)", border: "1px solid var(--card-border)" }} />
              <div className="flex justify-end pt-2">
                <button type="submit" disabled={sending} className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50 w-full sm:w-auto justify-center" style={{ backgroundColor: "var(--accent)", color: "#fff" }}>
                  {sending ? <><Loader2 size={14} className="animate-spin" /> Sending...</> : <><Send size={14} /> Send</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
