/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {protocol: 'https', hostname: 'pbs.twimg.com'},
      {protocol: 'https', hostname: 'abs.twimg.com'},
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['mysql2'],
  },
}

module.exports = nextConfig
