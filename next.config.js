/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Optimizes for production deployment
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false
      };
    }
    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ['firebase-admin']
  },
  images: {
    domains: [
      'firebasestorage.googleapis.com', // For Firebase Storage images
      'lh3.googleusercontent.com',      // For Google user profile images
    ],
    unoptimized: true // Required for static exports
  },
  // Strict mode helps identify potential problems
  reactStrictMode: true,
  // Improve production performance
  swcMinify: true,
  // Trailing slashes configuration
  trailingSlash: false,
  // Configure powered by header
  poweredByHeader: false,
  // Enable compression
  compress: true
};

module.exports = nextConfig; 