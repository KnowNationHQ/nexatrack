"use client"

import { useEffect, useState, useRef } from "react"
import { createClient } from "@/lib/supabase-browser"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"

export default function ChatPage() {
  const [messages, setMessages] = useState<any[]>([])
  const [text, setText] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    loadMessages()
    const sub = supabase.channel("admin-chat")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "livechat_messages" }, (payload) => {
        setMessages((prev) => [...prev, payload.new])
      })
      .subscribe()
    return () => { supabase.removeChannel(sub) }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function loadMessages() {
    const { data } = await supabase
      .from("livechat_messages")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(50)
    if (data) setMessages(data)
  }

  async function sendMessage() {
    if (!text.trim()) return
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from("livechat_messages").insert({
      sender_role: "admin",
      sender_id: user?.id,
      message: text,
    })
    setText("")
  }

  return (
    <div className="flex h-[calc(100vh-5rem)] flex-col">
      <h1 className="mb-4 text-2xl font-bold text-white">Live Chat</h1>
      <Card className="flex flex-1 flex-col border-[#1a1725] bg-[#0a0715]">
        <CardHeader><CardTitle className="text-white">Messages</CardTitle></CardHeader>
        <CardContent className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-2 mb-4">
            {messages.map((m, i) => (
              <div key={m.id || i} className={`flex ${m.sender_role === "admin" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] rounded-lg px-3 py-2 text-sm ${
                  m.sender_role === "admin" ? "bg-[#FF3E41] text-white" : "bg-[#1a1725] text-gray-200"
                }`}>
                  <p>{m.message}</p>
                  <p className="mt-1 text-xs opacity-60">{m.created_at ? new Date(m.created_at).toLocaleTimeString() : ""}</p>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          <div className="flex gap-2">
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              className="border-[#1a1725] bg-[#1a1725] text-white"
            />
            <Button onClick={sendMessage} className="bg-[#FF3E41] hover:bg-[#d92e31]">
              <Send size={16} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
