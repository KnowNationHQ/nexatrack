import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Nexatrack — Florida's Fastest Courier"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #07050f 0%, #1a1725 50%, #0a0715 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: '"Inter", sans-serif',
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(255, 62, 65, 0.08)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(255, 62, 65, 0.05)",
          }}
        />
        <span
          style={{
            fontSize: 80,
            fontWeight: 700,
            color: "#ff3e41",
            letterSpacing: -2,
            marginBottom: 8,
          }}
        >
          NEXATRACK
        </span>
        <span
          style={{
            fontSize: 28,
            color: "#9ca3af",
            letterSpacing: 1,
          }}
        >
          Florida's Fastest Courier
        </span>
        <span
          style={{
            fontSize: 16,
            color: "#6b7280",
            marginTop: 24,
            letterSpacing: 0.5,
          }}
        >
          Same-Day Delivery Across the Sunshine State
        </span>
      </div>
    ),
    { ...size }
  )
}
