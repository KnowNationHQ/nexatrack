"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase-browser"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/hooks/use-toast"

export default function ShipmentDetail() {
  const { id } = useParams<{ id: string }>()
  const [shipment, setShipment] = useState<any>(null)
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    supabase.from("parcels").select("*").eq("id", id).single().then(({ data }) => {
      if (data) setShipment(data)
    })
  }, [id])

  const updateStatus = async (status: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const updates: any = { status }
    if (status === "picked_up" || status === "in_transit") {
      updates.driver_id = user.id
    }

    const { error } = await supabase.from("parcels").update(updates).eq("id", id)
    if (error) { toast({ title: "Error", variant: "destructive" }) }
    else {
      toast({ title: `Status updated to ${status.replace(/_/g, " ")}` })
      const { data } = await supabase.from("parcels").select("*").eq("id", id).single()
      if (data) setShipment(data)
    }
  }

  if (!shipment) return <p className="text-gray-500">Loading...</p>

  const isAssignedToMe = shipment.driver_id === (async () => { const { data } = await supabase.auth.getUser(); return data.user?.id })()
  const statusActions: Record<string, string[]> = {
    pending: ["picked_up"],
    picked_up: ["in_transit"],
    in_transit: ["delivered"],
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-white">Shipment Detail</h1>
      <Card className="border-[#1a1725] bg-[#0a0715]">
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center justify-between">
            <span className="font-mono text-lg text-white">{shipment.tracking_number}</span>
            <Badge variant="outline" className="bg-blue-900/50 text-blue-400">{shipment.status?.replace(/_/g, " ")}</Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div><p className="text-sm text-gray-400">Sender</p><p className="text-white">{shipment.sender_name}</p><p className="text-sm text-gray-400">{shipment.sender_phone}</p></div>
            <div><p className="text-sm text-gray-400">Receiver</p><p className="text-white">{shipment.receiver_name}</p><p className="text-sm text-gray-400">{shipment.receiver_phone}</p></div>
          </div>
          <div><p className="text-sm text-gray-400">From</p><p className="text-white">{shipment.origin_city}{shipment.sender_address ? ` - ${shipment.sender_address}` : ""}</p></div>
          <div><p className="text-sm text-gray-400">To</p><p className="text-white">{shipment.destination_city}{shipment.receiver_address ? ` - ${shipment.receiver_address}` : ""}</p></div>
          <div><p className="text-sm text-gray-400">Weight: {shipment.weight}kg</p></div>

          <div className="flex flex-wrap gap-2 pt-4">
            {statusActions[shipment.status]?.map((nextStatus) => (
              <Button key={nextStatus} onClick={() => updateStatus(nextStatus)} className="bg-[#FF3E41] hover:bg-[#d92e31]">
                Mark as {nextStatus.replace(/_/g, " ")}
              </Button>
            ))}
            {!shipment.driver_id && (
              <Button onClick={() => updateStatus("picked_up")} variant="outline" className="border-[#FF3E41] text-[#FF3E41] hover:bg-[#FF3E41]/10">
                Accept Job
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
