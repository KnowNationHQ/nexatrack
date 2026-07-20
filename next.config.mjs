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
};

export default nextConfig;
