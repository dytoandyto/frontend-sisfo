import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/storage/images/',
      },
    ],
  },
};

export default nextConfig;
