// src/app/sitemap.ts
import { MetadataRoute } from 'next'
import { safeFind } from '@/lib/payload'

const BASE_URL = 'https://www.alirezanazari.com' // ← دامنه سایت رو اینجا عوض کن

// صفحات ثابت سایت
const staticPages = [
  { url: '/',         priority: 1.0,  changeFrequency: 'weekly'  },
  { url: '/about',    priority: 0.8,  changeFrequency: 'monthly' },
  { url: '/blog',     priority: 0.8,  changeFrequency: 'weekly'  },
  { url: '/qa',       priority: 0.7,  changeFrequency: 'weekly'  },
  { url: '/contact',  priority: 0.7,  changeFrequency: 'monthly' },
  { url: '/faq',      priority: 0.6,  changeFrequency: 'monthly' },
  { url: '/cases',    priority: 0.6,  changeFrequency: 'monthly' },
  { url: '/help',     priority: 0.5,  changeFrequency: 'monthly' },
] as const

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // صفحات ثابت
  const static_: MetadataRoute.Sitemap = staticPages.map(({ url, priority, changeFrequency }) => ({
    url: `${BASE_URL}${url}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }))

  // پست‌های بلاگ (dynamic)
  const posts = await safeFind('posts', {
    limit: 1000,
    where: { _status: { equals: 'published' } },
  })

  const blogPages: MetadataRoute.Sitemap = posts.map((post: any) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...static_, ...blogPages]
}
