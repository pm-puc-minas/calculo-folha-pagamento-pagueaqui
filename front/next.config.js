/** @type {import('next').NextConfig} */
const path = require('path')
const nextConfig = {
  // Silence multi-lockfile workspace root inference warning
  outputFileTracingRoot: path.join(__dirname, '..'),
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig