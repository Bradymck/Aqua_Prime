/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false }
    return config
  },
  images: {
    domains: ['picsum.photos', 'hebbkx1anhila5yf.public.blob.vercel-storage.com'],
    dangerouslyAllowSVG: true,
    unoptimized: true
  }
}

module.exports = nextConfig
