import Image from 'next/image'
import Link from 'next/link'
import { safeFind } from '@/lib/payload'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'مقالات حقوقی',
  description: 'آخرین مقالات و راهنماهای حقوقی تیم حقوقی علیرضا نظری',
}

const categoryLabels: Record<string, string> = {
  criminal:    'کیفری',
  civil:       'حقوقی',
  arbitration: 'داوری و حل اختلاف',
  probate:     'امور حسبی',
  inheritance: 'دعاوی ارث و ترکه',
  labor:       'حقوق کار',
  family:      'حقوق خانواده',
  banking:     'حقوق بانکی',
  insurance:   'حقوق بیمه',
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const params = await searchParams
  const activeCategory = params.category

  const where: any = { _status: { equals: 'published' } }
  if (activeCategory) where.category = { equals: activeCategory }

  const posts = await safeFind('posts', { where, limit: 12, sort: '-publishedAt' })

  return (
    <div className="pt-24">
              <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(0deg,rgba(255,255,255,1) 0,rgba(255,255,255,1) 1px,transparent 1px,transparent 80px),repeating-linear-gradient(90deg,rgba(255,255,255,1) 0,rgba(255,255,255,1) 1px,transparent 1px,transparent 80px)' }} />

      <section className="section-py bg-navy relative overflow-hidden noise-overlay">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(0deg,rgba(255,255,255,1) 0,rgba(255,255,255,1) 1px,transparent 1px,transparent 80px),repeating-linear-gradient(90deg,rgba(255,255,255,1) 0,rgba(255,255,255,1) 1px,transparent 1px,transparent 80px)' }} />
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-teal to-transparent opacity-60" />
        <div className="container-site">
          <p className="text-teal text-xs tracking-widest uppercase mb-4">دانش حقوقی</p>
          <h1 className="text-4xl md:text-6xl font-bold text-ivory mb-4">مقالات</h1>
          <p className="text-ivory/60 text-lg max-w-xl">راهنماهای حقوقی به زبان ساده توسط متخصصان ما</p>
        </div>
      </section>

      <div className="container-site section-py">
        {/* Category Filter - all English slugs */}
        <div className="flex flex-wrap gap-2 mb-10">
          <Link href="/blog" className={`tag cursor-pointer transition-all ${!activeCategory ? 'bg-navy text-ivory border-navy' : 'hover:border-navy hover:text-navy'}`}>همه</Link>
          {Object.entries(categoryLabels).map(([v, l]) => (
            <Link key={v} href={`/blog?category=${v}`}
              className={`tag cursor-pointer transition-all ${activeCategory === v ? 'bg-navy text-ivory border-navy' : 'hover:border-navy hover:text-navy'}`}>
              {l}
            </Link>
          ))}
        </div>

        {posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post: any, i: number) => (
              <Link key={post.id}
                href={`/blog/${post.slug || post.id}`}
                className={`card group bg-white ${i === 0 ? 'md:col-span-2' : ''}`}
              >
                {post.coverImage?.url && (
                  <div className="relative overflow-hidden mb-4 -mx-6 -mt-6 aspect-video">
                    <Image src={post.coverImage.url} alt={post.title} fill
                      className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" />
                  </div>
                )}
                <div className="flex items-center gap-2 mb-3">
                  {post.category && <span className="tag">{categoryLabels[post.category]}</span>}
                  {post.readingTime && <span className="text-xs text-silver">{post.readingTime} دقیقه</span>}
                </div>
                <h2 className={`font-bold text-ink group-hover:text-navy mb-2 transition-colors ${i === 0 ? 'text-xl' : 'text-base'}`}>
                  {post.title}
                </h2>
                {post.excerpt && <p className="text-sm text-silver line-clamp-2 leading-relaxed">{post.excerpt}</p>}
                <div className="mt-4 pt-4 border-t border-bone flex items-center justify-between text-xs text-silver">
                  {post.author?.name && <span>{post.author.name}</span>}
                  {post.publishedAt && <span>{new Date(post.publishedAt).toLocaleDateString('fa-IR')}</span>}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="card text-center py-16 text-silver">
            <p className="text-3xl mb-3"></p>
            <p>مقاله‌ای در این دسته‌بندی یافت نشد.</p>
          </div>
        )}
      </div>
    </div>
  )
}
