import withPWA from "next-pwa";

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

const pwaConfig = {
  dest: "public"
  // disable: process.env.NODE_ENV === 'development',  // 개발 환경에서 PWA를 테스트하려면 이 줄을 주석 처리하세요
};

export default withPWA(pwaConfig)(nextConfig);
