/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["encrypted-tbn0.gstatic.com", "eoxrihspempkfnxziwzd.supabase.co", "www.animal.go.kr"],
    remotePatterns: [
      {
        hostname: "eoxrihspempkfnxziwzd.supabase.co",
        protocol: "https"
      }
    ]
  },
  async headers() {
    return [
      {
        source: "/api/message",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0"
          }
        ]
      }
    ];
  }
};

export default nextConfig;
