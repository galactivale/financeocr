/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://financeocr.com',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://financeocr.com',
  },
  transpilePackages: [
    '@mui/icons-material',
    '@mui/material',
    '@mui/system',
    '@emotion/react',
    '@emotion/styled',
  ],
  webpack: (config, { isServer }) => {
    // Fix for MUI icons-material v7 compatibility
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@mui/icons-material': require.resolve('@mui/icons-material'),
      };
    }
    
    // Handle ES modules in node_modules
    config.module.rules.push({
      test: /\.m?js$/,
      include: /node_modules\/@mui/,
      resolve: {
        fullySpecified: false,
      },
    });

    return config;
  },
};

module.exports = nextConfig;
