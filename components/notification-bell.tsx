"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase-browser"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"

export default function NotificationBell() {
  const [unread, setUnread] = useState(0)
  const [role, setRole] = useState("")
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const supabase = createClient()
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const r = user.app_metadata?.role || "merchant"
      setRole(r)
      const { count } = await supabase.from("notifications").select("*", { count: "exact", head: true }).eq("user_id", user.id).eq("read", false)
      setUnread(count ?? 0)
    }
    load()
    const sub = supabase.channel("notif-count")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications" }, () => {
        load()
      })
      .subscribe()
    return () => { sub.unsubscribe() }
  }, [])

  return (
    <Button variant="ghost" size="icon" onClick={() => router.push(`/${role}/notifications`)} className="relative">
      <Bell size={18} />
      {unread > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#FF3E41] px-1 text-[10px] font-bold text-white">
          {unread > 99 ? "99+" : unread}
        </span>
      )}
    </Button>
  )
}
