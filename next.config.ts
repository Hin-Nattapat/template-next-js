import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // ❌ ห้ามใส่ eslint ตรงนี้แล้วใน Next 16

  // ถ้าอยาก strict เรื่อง TS build error จะใส่ส่วนนี้หรือไม่ใส่ก็ได้ (default = false)
  typescript: {
    ignoreBuildErrors: false,
  },

  experimental: {
    typedRoutes: true,
    optimizePackageImports: ["zustand", "lucide-react", "@radix-ui/react-slot"],
  },
};

export default nextConfig;
