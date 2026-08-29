/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/institutional-research-platform',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://firs-backend-9jfa.onrender.com',
  },
};

export default nextConfig;
