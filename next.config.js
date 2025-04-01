/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  serverExternalPackages: ['firebase-admin'],
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000']
    }
  },
  env: {
    SHIPPO_API_KEY: process.env.SHIPPO_API_KEY,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://apis.google.com https://*.stripe.com https://*.googletagmanager.com"
          }
        ]
      }
    ]
  }
};

module.exports = nextConfig 