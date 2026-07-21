"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase-browser"
import { db } from "@/lib/db-client"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/hooks/use-toast"
import DriverLocationSender from "@/components/driver-location-sender"

export default function ShipmentDetail() {
  const { id } = useParams<{ id: string }>()
  const [shipment, setShipment] = useState<any>(null)
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    db("parcels", "select", { eq: { id }, single: true }).then((data) => {
      if (data) { setShipment(data); checkAssigned(data) }
    })
  }, [id])

  function checkAssigned(shipment: any) {
    supabase.auth.getUser().then(({ data }) => setIsAssignedToMe(shipment.driver_id === data.user?.id))
  }

  const updateStatus = async (status: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const updates: any = { status }
    if (status === "picked_up" || status === "in_transit") {
      updates.driver_id = user.id
    }

    try {
      await db("parcels", "update", { data: updates, eq: { id } })
      toast({ title: `Status updated to ${status.replace(/_/g, " ")}` })
      const data = await db("parcels", "select", { eq: { id }, single: true })
      if (data) setShipment(data)
    } catch (e: any) {
      toast({ title: "Error", variant: "destructive" })
    }
  }

  const [isAssignedToMe, setIsAssignedToMe] = useState(false)

  if (!shipment) return <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
  const statusActions: Record<string, string[]> = {
    pending: ["picked_up"],
    delivery_man_assign: ["picked_up"],
    picked_up: ["in_transit"],
    in_transit: ["delivered"],
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Shipment Detail</h1>
      <Card style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)' }}>
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center justify-between">
            <span className="font-mono text-lg" style={{ color: 'var(--text-primary)' }}>{shipment.tracking_number}</span>
            <Badge variant="outline" style={{color:'var(--badge-info-text)',borderColor:'var(--badge-info-bg)',backgroundColor:'var(--badge-info-bg)'}}>{shipment.status?.replace(/_/g, " ")}</Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Sender</p>
              <p style={{ color: 'var(--text-primary)' }}>{shipment.sender_name}</p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{shipment.sender_phone}</p>
            </div>
            <div>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Receiver</p>
              <p style={{ color: 'var(--text-primary)' }}>{shipment.receiver_name}</p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{shipment.receiver_phone}</p>
            </div>
          </div>
          <div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>From</p>
            <p style={{ color: 'var(--text-primary)' }}>{shipment.origin_city}{shipment.sender_address ? ` - ${shipment.sender_address}` : ""}</p>
          </div>
          <div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>To</p>
            <p style={{ color: 'var(--text-primary)' }}>{shipment.destination_city}{shipment.receiver_address ? ` - ${shipment.receiver_address}` : ""}</p>
          </div>
          <div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Weight: {shipment.weight}kg</p>
          </div>
          {isAssignedToMe && <DriverLocationSender shipmentId={id} />}

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
