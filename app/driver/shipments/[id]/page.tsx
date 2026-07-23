"use client"

import { useEffect, useState, useRef } from "react"
import { createClient } from "@/lib/supabase-browser"
import { db } from "@/lib/db-client"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DetailSkeleton } from "@/components/ui/skeleton-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/hooks/use-toast"
import DriverLocationSender from "@/components/driver-location-sender"
import SignaturePad from "@/components/signature-pad"

export default function ShipmentDetail() {
  const { id } = useParams<{ id: string }>()
  const [shipment, setShipment] = useState<any>(null)
  const [isAssignedToMe, setIsAssignedToMe] = useState(false)
  const [deliveryPhoto, setDeliveryPhoto] = useState<File | null>(null)
  const [deliveryPhotoPreview, setDeliveryPhotoPreview] = useState<string | null>(null)
  const [deliverySignature, setDeliverySignature] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [deliveryPhotos, setDeliveryPhotos] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
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

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setDeliveryPhoto(file)
    setDeliveryPhotoPreview(URL.createObjectURL(file))
  }

  const uploadFile = async (file: Blob, fileName: string, type: string): Promise<string | null> => {
    const formData = new FormData()
    formData.append("shipment_id", id)
    formData.append("file", file, fileName)
    formData.append("type", type)
    try {
      const res = await fetch("/api/upload-delivery-proof", { method: "POST", body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      return data.url
    } catch (e: any) {
      toast({ title: `Failed to upload ${type}`, variant: "destructive" })
      return null
    }
  }

  const uploadSignature = async (dataUrl: string): Promise<string | null> => {
    const blob = await (await fetch(dataUrl)).blob()
    return uploadFile(blob, "signature.png", "signature")
  }

  const completeDelivery = async () => {
    if (!deliveryPhoto) {
      toast({ title: "Please take a delivery photo", variant: "destructive" })
      return
    }

    setUploading(true)

    const photoUrl = await uploadFile(deliveryPhoto, deliveryPhoto.name, "photo")
    if (!photoUrl) { setUploading(false); return }

    setDeliveryPhotos((prev) => [...prev, photoUrl])

    let signatureUrl: string | null = null
    if (deliverySignature) {
      signatureUrl = await uploadSignature(deliverySignature)
    }

    try {
      const updates: any = { status: "delivered", pod_photo_url: photoUrl }
      if (signatureUrl) updates.pod_signature_url = signatureUrl
      await db("parcels", "update", { data: updates, eq: { id } })
      toast({ title: "Delivery completed!" })
      const data = await db("parcels", "select", { eq: { id }, single: true })
      if (data) setShipment(data)
    } catch (e: any) {
      toast({ title: "Error completing delivery", variant: "destructive" })
    }
    setUploading(false)
  }

  if (!shipment) return <DetailSkeleton />
  const statusActions: Record<string, string[]> = {
    pending: ["picked_up"],
    delivery_man_assign: ["picked_up"],
    picked_up: ["in_transit"],
    in_transit: [],
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

          {shipment.status === "in_transit" && (
            <div className="space-y-4 pt-4 border-t" style={{ borderColor: "var(--card-border)" }}>
              <div>
                <p className="text-sm mb-2" style={{ color: "var(--text-muted)" }}>Delivery Photo</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoChange}
                  className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#FF3E41] file:text-white hover:file:bg-[#d92e31]"
                  style={{ color: "var(--text-primary)" }}
                />
                {deliveryPhotoPreview && (
                  <div className="mt-2">
                    <img src={deliveryPhotoPreview} alt="Delivery preview" className="h-24 w-24 rounded-lg object-cover border" style={{ borderColor: "var(--card-border)" }} />
                  </div>
                )}
              </div>

              <SignaturePad onSave={(dataUrl) => setDeliverySignature(dataUrl)} />

              <Button onClick={completeDelivery} disabled={uploading} className="w-full bg-[#FF3E41] hover:bg-[#d92e31]">
                {uploading ? "Uploading..." : "Complete Delivery"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
