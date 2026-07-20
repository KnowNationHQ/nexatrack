"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase-browser"
import { db } from "@/lib/db-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function WalletPage() {
  const [wallet, setWallet] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      db<any[]>("wallets", "select", { eq: { merchant_id: user.id }, single: true }).then((data) => {
        if (data) setWallet(data)
      })
    })
  }, [])

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-white">Wallet</h1>
      <Card className="border-[#1a1725] bg-[#0a0715]">
        <CardHeader><CardTitle className="text-white">Balance</CardTitle></CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-white">${Number(wallet?.balance || 0).toFixed(2)}</div>
          <p className="mt-2 text-sm text-gray-400">Available for shipments and withdrawals</p>
        </CardContent>
      </Card>
    </div>
  )
}

