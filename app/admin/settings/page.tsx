"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase-browser"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/hooks/use-toast"

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, Record<string, string>>>({})
  const [saving, setSaving] = useState(false)
  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    const { data } = await supabase.from("settings").select("*")
    if (!data) return
    const grouped: Record<string, Record<string, string>> = {}
    data.forEach((s: any) => {
      if (!grouped[s.category]) grouped[s.category] = {}
      const val = s.value
      grouped[s.category][s.name] = typeof val === 'object' ? val?.value ?? '' : val ?? ''
    })
    setSettings(grouped)
  }

  async function handleSave(category: string) {
    setSaving(true)
    const entries = settings[category]
    for (const [name, value] of Object.entries(entries)) {
      await supabase.from("settings").upsert(
        { category, name, value: { value } },
        { onConflict: "category,name" }
      )
    }
    toast({ title: "Settings saved" })
    setSaving(false)
  }

  function update(category: string, name: string, value: string) {
    setSettings((prev) => ({
      ...prev,
      [category]: { ...prev[category], [name]: value },
    }))
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-white">Settings</h1>

      {Object.entries(settings).map(([category, fields]) => (
        <Card key={category} className="mb-4 border-[#1a1725] bg-[#0a0715]">
          <CardHeader>
            <CardTitle className="text-white capitalize">{category} Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(fields).map(([name, value]) => (
              <div key={name}>
                <label className="mb-1 block text-sm font-medium text-gray-400 capitalize">{name.replace(/_/g, " ")}</label>
                <Input
                  value={value || ''}
                  onChange={(e) => update(category, name, e.target.value)}
                  className="border-[#1a1725] bg-[#1a1725] text-white"
                />
              </div>
            ))}
            <Button onClick={() => handleSave(category)} disabled={saving} className="bg-[#FF3E41] hover:bg-[#d92e31]">
              {saving ? "Saving..." : `Save ${category} Settings`}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
