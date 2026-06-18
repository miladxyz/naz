import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'http',  hostname: 'localhost' },
      { protocol: 'https', hostname: '**' },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  turbopack: {}
}

// devBundleServerPackages: false is required for Next.js 16.2+ compatibility
export default withPayload(nextConfig, { devBundleServerPackages: false })
