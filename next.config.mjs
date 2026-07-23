import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: { bodySizeLimit: "10mb" },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "ujcokrzjvjdrcrdhcnjy.supabase.co" },
    ],
  },
  webpack: (config) => {
    config.watchOptions = {
      ignored: ["**/supabase/functions/**"],
    }
    return config
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self), interest-cohort=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
"script-src 'self' 'unsafe-inline' https://*.smartsuppchat.com https://*.smartsuppcdn.com https://*.supabase.co https://code.jquery.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com",
"style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://*.smartsuppcdn.com",
              "img-src 'self' data: blob: https://*.supabase.co https://cdnjs.cloudflare.com https://*.smartsuppcdn.com https://widget-v3.smartsuppcdn.com",
              "font-src 'self' data: https://cdnjs.cloudflare.com https://fonts.gstatic.com https://cdn.jsdelivr.net",
              "connect-src 'self' https://*.supabase.co wss://*.smartsuppchat.com https://*.smartsuppchat.com wss://*.smartsupp.com https://*.smartsuppcdn.com https://cdn.jsdelivr.net",
              "frame-src 'self' https://*.smartsuppchat.com",
              "worker-src 'self' blob:",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
    ]
  },
}

export default withNextIntl(nextConfig)
