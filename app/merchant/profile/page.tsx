"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase-browser"
import { db } from "@/lib/db-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/hooks/use-toast"

export default function MerchantProfile() {
  const [profile, setProfile] = useState<any>({ full_name: "", email: "" })
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      db<any[]>("profiles", "select", { eq: { id: user.id }, single: true }).then((data) => {
        if (data) setProfile(data)
      })
    })
  }, [])

  const handleSave = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await db("profiles", "update", { data: { full_name: profile.full_name }, eq: { id: user.id } })
    toast({ title: "Profile updated" })
    setLoading(false)
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Profile</h1>
      <Card style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)' }}>
        <CardHeader><CardTitle style={{ color: 'var(--text-primary)' }}>Account Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><label className="mb-1 block text-sm" style={{ color: 'var(--text-muted)' }}>Business Name</label><Input value={profile.full_name || ""} onChange={(e) => setProfile((p: any) => ({ ...p, full_name: e.target.value }))} style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }} /></div>
          <div><label className="mb-1 block text-sm" style={{ color: 'var(--text-muted)' }}>Email</label><Input value={profile.email || ""} disabled style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-muted)' }} /></div>
          <Button onClick={handleSave} disabled={loading} className="bg-[#FF3E41] hover:bg-[#d92e31]">{loading ? "Saving..." : "Save Changes"}</Button>
        </CardContent>
      </Card>
    </div>
  )
}
