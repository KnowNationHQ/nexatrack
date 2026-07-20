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
}

export default nextConfig;
