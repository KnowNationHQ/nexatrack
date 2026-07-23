"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase-browser"
import { useRouter } from "next/navigation"
import { Loader2, Bell, CheckCheck, ExternalLink } from "lucide-react"

export default function NotificationsList() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50)
    if (data) setNotifications(data)
    setLoading(false)
  }

  async function markRead(id: string) {
    await fetch("/api/notifications/read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  async function markAllRead() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await fetch("/api/notifications/read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id }),
    })
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Notifications</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
            {unreadCount > 0 ? `${unreadCount} unread` : "No unread notifications"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all hover:bg-[#FF3E41] hover:text-white"
            style={{ borderColor: 'var(--card-border)', color: 'var(--text-secondary)' }}
          >
            <CheckCheck size={14} />
            Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-[#FF3E41]" /></div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Bell size={40} className="mb-3 opacity-20" style={{ color: 'var(--text-muted)' }} />
          <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>No notifications yet</p>
          <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>Notifications will appear here when something happens</p>
        </div>
      ) : (
        <div className="space-y-1">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => { if (!n.read) markRead(n.id); if (n.link) router.push(n.link) }}
              className="flex cursor-pointer items-start gap-3 rounded-xl px-4 py-3 transition-all hover:opacity-90"
              style={{
                backgroundColor: n.read ? 'transparent' : 'rgba(255,62,65,0.04)',
                borderLeft: n.read ? '2px solid transparent' : '2px solid #FF3E41',
              }}
            >
              <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${n.read ? 'bg-gray-700/20' : 'bg-[#FF3E41]/10'}`}>
                {n.type === "shipment" ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={n.read ? 'var(--text-muted)' : '#FF3E41'} strokeWidth="2"><path d="M5 17h14M5 17a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2M5 17l2 4h10l2-4M9 21h6"/></svg>
                ) : (
                  <Bell size={14} className={n.read ? '' : 'text-[#FF3E41]'} />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{n.title}</p>
                <p className="mt-0.5 text-xs line-clamp-2" style={{ color: 'var(--text-muted)' }}>{n.body}</p>
                <p className="mt-1 text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  {new Date(n.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              {n.link && <ExternalLink size={12} className="mt-1 shrink-0 opacity-30" style={{ color: 'var(--text-muted)' }} />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
