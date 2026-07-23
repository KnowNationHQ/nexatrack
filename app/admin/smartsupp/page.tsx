"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, ExternalLink, CheckCircle } from "lucide-react"

export default function SmartsuppPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Smartsupp Login</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>Manage your live chat from the Smartsupp dashboard</p>
      </div>

      <Card className="max-w-2xl" style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            <MessageSquare size={16} className="text-[#FF3E41]" />
            Connected Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-3 rounded-lg bg-green-500/10 px-4 py-3 text-sm">
            <CheckCircle size={18} className="text-green-500" />
            <span style={{ color: 'var(--text-secondary)' }}>
              Smartsupp is live on your website — key: <code className="rounded bg-black/20 px-2 py-0.5 text-xs font-mono">4e3b26ee...31b5</code>
            </span>
          </div>

          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Click below to open the Smartsupp dashboard where you can view conversations, respond to visitors, and configure your chat widget.
          </p>

          <a
            href="https://app.smartsupp.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-[#FF3E41] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#e63538]"
          >
            Open Smartsupp Dashboard
            <ExternalLink size={16} />
          </a>
        </CardContent>
      </Card>
    </div>
  )
}
