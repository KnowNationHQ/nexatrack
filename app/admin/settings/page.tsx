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
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Manage application configuration</p>
      </div>

      {entries.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
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
            <Card key={category} className="overflow-hidden border-[#1a1725]/60 bg-gradient-to-b from-[#0a0715] to-[#0d0a1a] shadow-lg shadow-black/20">
              <div className="flex items-center gap-3 border-b border-[#1a1725]/40 bg-gradient-to-r from-[#1a1725]/30 to-transparent px-5 py-4">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${meta.color} shadow-lg`}>
                  <Icon size={16} className="text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-white capitalize">{category}</h2>
                  <p className="text-xs text-gray-500">{fieldEntries.length} setting{fieldEntries.length !== 1 ? "s" : ""}</p>
                </div>
              </div>
              <CardContent className="p-5">
                <div className="space-y-4">
                  {fieldEntries.map(([name, value]) => (
                    <div key={name}>
                      <label className="mb-1.5 block text-xs font-medium text-gray-400 uppercase tracking-wider">{name.replace(/_/g, " ")}</label>
                      <Input
                        value={value || ''}
                        onChange={(e) => update(category, name, e.target.value)}
                        className="border-[#1a1725] bg-[#1a1725]/50 text-white placeholder:text-gray-600 focus:border-[#FF3E41]/50 focus:ring-1 focus:ring-[#FF3E41]/30 transition-all"
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex justify-end border-t border-[#1a1725]/30 pt-4">
                  <Button
                    onClick={() => handleSave(category)}
                    disabled={saving === category}
                    className="bg-gradient-to-r from-[#FF3E41] to-[#d92e31] px-6 text-sm font-medium text-white shadow-lg shadow-[#FF3E41]/20 hover:shadow-[#FF3E41]/30 transition-all disabled:opacity-50"
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
