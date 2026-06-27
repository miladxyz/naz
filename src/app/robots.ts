// src/app/robots.ts
import { MetadataRoute } from 'next'

const BASE_URL = 'https://www.alirezanazari.com' // ← همون دامنه

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/', '/dashboard', '/auth'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
