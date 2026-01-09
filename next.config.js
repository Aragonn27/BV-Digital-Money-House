/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Enable for Docker deployment
  images: {
    domains: ['digitalmoney.digitalhouse.com'],
  },
}

module.exports = nextConfig
