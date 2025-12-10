/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://financeocr.com',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://financeocr.com',
  },
  webpack: (config, { isServer }) => {
    return config;
  },
  // Disable static optimization for error pages to avoid Html import issues
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

module.exports = nextConfig;
