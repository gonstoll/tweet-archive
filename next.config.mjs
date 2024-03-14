/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {protocol: 'https', hostname: 'pbs.twimg.com'},
      {protocol: 'https', hostname: 'abs.twimg.com'},
    ],
  },
}

export default nextConfig
