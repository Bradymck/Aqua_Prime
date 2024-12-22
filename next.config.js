/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false }
    return config
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos'
      },
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com'
      }
    ],
    dangerouslyAllowSVG: true,
    unoptimized: true,
    domains: ['localhost'],
    disableStaticImages: false
  },
  productionBrowserSourceMaps: true,
  experimental: {
    outputFileTracingRoot: process.env.NODE_ENV === "development" ? "./app" : undefined,
    outputStandalone: true,
    images: {
      allowFutureImage: true
    }
  },
  distDir: 'app/.next'
}

module.exports = nextConfig
