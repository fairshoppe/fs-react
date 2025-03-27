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
};

module.exports = nextConfig; 