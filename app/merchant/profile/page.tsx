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
      db("profiles", "select", { eq: { id: user.id }, single: true }).then((data) => {
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
      <h1 className="mb-6 text-2xl font-bold text-white">Profile</h1>
      <Card className="border-[#1a1725] bg-[#0a0715]">
        <CardHeader><CardTitle className="text-white">Account Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><label className="mb-1 block text-sm text-gray-400">Business Name</label><Input value={profile.full_name || ""} onChange={(e) => setProfile((p: any) => ({ ...p, full_name: e.target.value }))} className="border-[#1a1725] bg-[#1a1725] text-white" /></div>
          <div><label className="mb-1 block text-sm text-gray-400">Email</label><Input value={profile.email || ""} disabled className="border-[#1a1725] bg-[#1a1725] text-gray-400" /></div>
          <Button onClick={handleSave} disabled={loading} className="bg-[#FF3E41] hover:bg-[#d92e31]">{loading ? "Saving..." : "Save Changes"}</Button>
        </CardContent>
      </Card>
    </div>
  )
}
