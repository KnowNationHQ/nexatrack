"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/db-client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/hooks/use-toast"
import { Settings, Globe, DollarSign, Mail, Bell, Shield, Truck, Clock, Palette, Building2 } from "lucide-react"

const categoryIcons: Record<string, { icon: typeof Settings; color: string }> = {
  general: { icon: Settings, color: "from-blue-500 to-blue-600" },
  shipping: { icon: Truck, color: "from-orange-500 to-orange-600" },
  delivery: { icon: Truck, color: "from-orange-500 to-orange-600" },
  payment: { icon: DollarSign, color: "from-emerald-500 to-emerald-600" },
  email: { icon: Mail, color: "from-purple-500 to-purple-600" },
  notification: { icon: Bell, color: "from-yellow-500 to-yellow-600" },
  security: { icon: Shield, color: "from-red-500 to-red-600" },
  scheduling: { icon: Clock, color: "from-cyan-500 to-cyan-600" },
  appearance: { icon: Palette, color: "from-pink-500 to-pink-600" },
  company: { icon: Building2, color: "from-indigo-500 to-indigo-600" },
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, Record<string, string>>>({})
  const [saving, setSaving] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => { loadSettings() }, [])

  async function loadSettings() {
    const data = await db("settings", "select")
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
    setSaving(category)
    const entries = settings[category]
    for (const [name, value] of Object.entries(entries)) {
      await db("settings", "upsert", { data: { category, name, value: { value } }, onConflict: "category,name" })
    }
    toast({ title: `${category} settings saved` })
    setSaving(null)
  }

  function update(category: string, name: string, value: string) {
    setSettings((prev) => ({
      ...prev,
      [category]: { ...prev[category], [name]: value },
    }))
  }

  const entries = Object.entries(settings)

  return (
    <div>
      <div className="mb-8">
        <h1 style={{color:'var(--text-primary)'}} className="text-2xl font-bold">Settings</h1>
      </div>

      {entries.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16" style={{color:'var(--text-muted)'}}>
          <Settings size={40} className="mb-3 opacity-30" />
          <p className="text-sm">No settings found</p>
        </div>
      )}

      <div className="grid gap-5">
        {entries.map(([category, fields]) => {
          const meta = categoryIcons[category] || { icon: Settings, color: "from-gray-500 to-gray-600" }
          const Icon = meta.icon
          const fieldEntries = Object.entries(fields)
          return (
            <Card key={category} style={{borderColor:'var(--card-border)',backgroundColor:'var(--card-bg)'}} className="overflow-hidden">
              <div style={{borderColor:'var(--card-border)',backgroundColor:'var(--card-bg)'}} className="flex items-center gap-3 border-b px-5 py-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{backgroundColor:'var(--accent-bg)'}}>
                  <Icon size={16} style={{color:'var(--accent)'}} />
                </div>
                <div>
                  <h2 style={{color:'var(--text-primary)'}} className="text-sm font-semibold capitalize">{category}</h2>
                  <p style={{color:'var(--text-muted)'}} className="text-xs">{fieldEntries.length} setting{fieldEntries.length !== 1 ? "s" : ""}</p>
                </div>
              </div>
              <CardContent className="p-5">
                <div className="space-y-4">
                  {fieldEntries.map(([name, value]) => (
                    <div key={name}>
                      <label style={{color:'var(--text-muted)'}} className="mb-1.5 block text-xs font-medium uppercase tracking-wider">{name.replace(/_/g, " ")}</label>
                      <Input
                        value={value || ''}
                        onChange={(e) => update(category, name, e.target.value)}
                        style={{borderColor:'var(--card-border)',backgroundColor:'var(--input-bg)',color:'var(--text-primary)'}}
                        className="transition-all"
                      />
                    </div>
                  ))}
                </div>
                <div style={{borderColor:'var(--card-border)'}} className="mt-5 flex justify-end border-t pt-4">
                  <Button
                    onClick={() => handleSave(category)}
                    disabled={saving === category}
                    className="px-6 text-sm font-medium transition-all disabled:opacity-50" style={{backgroundColor:'var(--accent)',color:'var(--text-primary)'}}
                  >
                    {saving === category ? (
                      <span className="flex items-center gap-2"><span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />Saving...</span>
                    ) : (
                      `Save ${category}`
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
