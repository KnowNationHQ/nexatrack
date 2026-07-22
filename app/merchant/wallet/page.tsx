"use client"

import { useCallback, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase-browser"
import { db } from "@/lib/db-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/hooks/use-toast"

const PRESETS = [20, 50, 100, 200]

export default function WalletPage() {
  const [wallet, setWallet] = useState<any>(null)
  const [amount, setAmount] = useState(50)
  const [loading, setLoading] = useState(false)
  const [txns, setTxns] = useState<any[]>([])
  const { toast } = useToast()
  const supabase = createClient()

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const w = await db<any>("wallets", "select", { eq: { merchant_id: user.id }, single: true })
    if (w) { setWallet(w); loadTxns(w.id) }
  }, [])

  const loadTxns = async (walletId: string) => {
    const data = await db<any[]>("transactions", "select", { eq: { wallet_id: walletId }, order: { column: "created_at", ascending: false }, limit: 20 })
    if (data) setTxns(data)
  }

  useEffect(() => { load() }, [load])

  const topUp = async () => {
    if (amount < 1) return
    setLoading(true)
    try {
      const res = await fetch("/api/mock-top-up", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      setWallet((w: any) => ({ ...w, balance: json.balance }))
      toast({ title: "Top-up successful!", description: `$${amount} added to wallet` })
      if (wallet?.id) loadTxns(wallet.id)
    } catch (e: any) {
      toast({ title: "Top-up failed", description: e.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Wallet</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card style={{ borderColor: "var(--card-border)", backgroundColor: "var(--card-bg)" }}>
          <CardHeader><CardTitle style={{ color: "var(--text-primary)" }}>Balance</CardTitle></CardHeader>
          <CardContent>
            <div className="text-4xl font-bold" style={{ color: "var(--text-primary)" }}>
              ${Number(wallet?.balance || 0).toFixed(2)}
            </div>
            <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>Available for shipments</p>
          </CardContent>
        </Card>

        <Card style={{ borderColor: "var(--card-border)", backgroundColor: "var(--card-bg)" }}>
          <CardHeader><CardTitle style={{ color: "var(--text-primary)" }}>Top Up</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button key={p} onClick={() => setAmount(p)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    amount === p
                      ? "bg-[#FF3E41] text-white"
                      : "border border-[var(--card-border)] text-[var(--text-primary)] hover:bg-[var(--input-bg)]"
                  }`}
                >${p}</button>
              ))}
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Custom Amount</label>
              <input type="number" min="1" value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
                style={{ borderColor: "var(--card-border)", backgroundColor: "var(--input-bg)", color: "var(--text-primary)" }}
              />
            </div>
            <button onClick={topUp} disabled={loading || amount < 1}
              className="w-full rounded-lg bg-[#FF3E41] px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >{loading ? "Processing..." : `Top Up $${amount}`}</button>
          </CardContent>
        </Card>
      </div>

      {txns.length > 0 && (
        <Card className="mt-6" style={{ borderColor: "var(--card-border)", backgroundColor: "var(--card-bg)" }}>
          <CardHeader><CardTitle style={{ color: "var(--text-primary)" }}>Transaction History</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {txns.map((t: any) => (
                <div key={t.id} className="flex items-center justify-between rounded-lg px-4 py-3" style={{ backgroundColor: "var(--input-bg)" }}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{t.description || "Top-up"}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{new Date(t.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className="text-sm font-semibold text-green-500">+${Number(t.amount).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
