"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, Plug, Loader2, X } from "lucide-react"

export default function SmartsuppPage() {
  const [config, setConfig] = useState({ key: "", enabled: false })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showDialog, setShowDialog] = useState(false)

  useEffect(() => {
    fetch("/api/smartsupp-config")
      .then((r) => r.json())
      .then((data) => { if (data.key !== undefined) setConfig(data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function handleSave() {
    setSaving(true)
    try {
      const r = await fetch("/api/smartsupp-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      })
      const data = await r.json()
      if (data.success) setShowDialog(true)
    } catch {}
    setSaving(false)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>LiveChat — Smartsupp</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>Manage your visitor live chat from the Smartsupp dashboard</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2" style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              <Plug size={16} className="text-[#FF3E41]" />
              Connection Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {loading ? (
              <div className="flex items-center justify-center py-8"><Loader2 size={24} className="animate-spin text-[#FF3E41]" /></div>
            ) : (
              <>
                <div>
                  <label className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Smartsupp API Key</label>
                  <input
                    type="text"
                    className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-[#FF3E41]/30"
                    style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }}
                    placeholder="Enter your Smartsupp key"
                    value={config.key}
                    onChange={(e) => setConfig({ ...config, key: e.target.value })}
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg px-4 py-3" style={{ backgroundColor: 'var(--badge-bg)' }}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Enable Live Chat</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Show the Smartsupp widget on your website</p>
                  </div>
                  <button
                    onClick={() => setConfig({ ...config, enabled: !config.enabled })}
                    className={`relative h-6 w-11 rounded-full transition-colors ${config.enabled ? 'bg-green-500' : 'bg-gray-600'}`}
                  >
                    <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${config.enabled ? 'translate-x-5' : ''}`} />
                  </button>
                </div>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#FF3E41] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#e63538] disabled:opacity-50"
                >
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  {saving ? "Saving..." : "Save Settings"}
                </button>
              </>
            )}
          </CardContent>
        </Card>

        <Card style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              <Plug size={16} className="text-[#FF3E41]" />
              Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-4"><Loader2 size={20} className="animate-spin text-[#FF3E41]" /></div>
            ) : (
              <>
                <div className="flex items-center gap-3 rounded-lg px-4 py-3" style={{ backgroundColor: config.enabled && config.key ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)' }}>
                  <div className={`flex h-3 w-3 rounded-full ${config.enabled && config.key ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: config.enabled && config.key ? '#22c55e' : '#ef4444' }}>
                      {config.enabled && config.key ? "Connected" : "Disconnected"}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {config.enabled && config.key ? "Chat widget is active on all pages" : "Chat widget is not visible to visitors"}
                    </p>
                  </div>
                </div>

                {config.key && (
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    <span className="font-medium">Key:</span> {config.key.slice(0, 10)}...{config.key.slice(-4)}
                  </div>
                )}

                <div className="pt-2">
                  <a
                    href="https://app.smartsupp.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all hover:bg-[#FF3E41] hover:text-white"
                    style={{ borderColor: 'var(--card-border)', color: 'var(--text-secondary)' }}
                  >
                    Open Smartsupp Dashboard
                    <ExternalLink size={14} />
                  </a>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {showDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
          onClick={() => setShowDialog(false)}
        >
          <div
            className="relative w-full max-w-sm rounded-2xl p-8 text-center shadow-2xl animate-in zoom-in-95"
            style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowDialog(false)}
              className="absolute right-3 top-3 rounded-lg p-1.5 transition-colors hover:bg-white/10"
              style={{ color: 'var(--text-muted)' }}
            >
              <X size={18} />
            </button>

            <svg className="mx-auto mb-4 h-20 w-20" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="40" r="36" stroke="#22c55e" strokeWidth="4" fill="none" strokeDasharray="226" strokeDashoffset="226">
                <animate attributeName="strokeDashoffset" from="226" to="0" dur="0.5s" fill="freeze" />
              </circle>
              <path d="M26 40l10 10 18-18" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="50" strokeDashoffset="50">
                <animate attributeName="strokeDashoffset" from="50" to="0" dur="0.35s" begin="0.5s" fill="freeze" />
              </path>
            </svg>

            <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Connected!</h2>
            <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
              Your Smartsupp live chat is now active. Visitors can reach you directly from the website.
            </p>

            <button
              onClick={() => setShowDialog(false)}
              className="mx-auto mt-6 inline-flex items-center gap-2 rounded-lg bg-[#FF3E41] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#e63538]"
            >
              Done
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes animate-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes zoom-in-95 {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-in.fade-in { animation: animate-in 0.2s ease-out; }
        .animate-in.zoom-in-95 { animation: zoom-in-95 0.25s ease-out; }
      `}</style>
    </div>
  )
}
