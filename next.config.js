/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // Optimize for Docker builds (swcMinify is default in Next.js 15, removed)
  compress: true,
  poweredByHeader: false,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://financeocr.com',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://financeocr.com',
  },
  webpack: (config, { isServer }) => {
    // Ensure path aliases work correctly
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname),
    };
    return config;
  },
  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

module.exports = nextConfig;
