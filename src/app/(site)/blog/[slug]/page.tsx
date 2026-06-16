import { getPayloadClient, safeFind } from '@/lib/payload'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

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
  others: 'سایر'
}
async function getPost(slug: string) {
  try {

    const decodedSlug = decodeURIComponent(slug);
    
    const payload = await getPayloadClient();
    if (!payload) return null;
    
    const res = await payload.find({
      collection: 'posts',
      where: {
        or: [
          { slug: { equals: decodedSlug } },   // use decoded slug
          { id: { equals: decodedSlug } }      // optional: if you ever use ID as slug
        ],
        _status: { equals: 'published' }
      },
      limit: 1,
    });
    return res.docs[0] || null;
  } catch (error) {
    // If decoding fails (malformed URI), fall back to the raw slug
    console.error('Error decoding slug:', error);
    return null;
  }
}


function extractContent(content: any): { html: string; isHtml: boolean } {
  if (!content) return { html: '', isHtml: false }
  try {
    // Get the first text node
    const firstChild = content?.root?.children?.[0]?.children?.[0]?.text || ''
    // If it starts with an HTML tag, it's rich HTML from Tiptap
    if (firstChild.trimStart().startsWith('<')) {
      return { html: firstChild, isHtml: true }
    }
    // Plain text — join all text nodes with newlines
    const plain = (content?.root?.children || [])
      .map((n: any) => (n.children || []).map((c: any) => c.text || '').join(''))
      .join('\n\n')
    return { html: plain, isHtml: false }
  } catch { return { html: '', isHtml: false } }
}

// Next 16 requires params to be a Promise
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: 'مقاله یافت نشد' }
  return { title: (post as any).title, description: (post as any).excerpt || '' }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const related = await safeFind('posts', {
    where: {
      category: { equals: (post as any).category },
      id: { not_equals: post.id },
      _status: { equals: 'published' },
    },
    limit: 3,
    sort: '-publishedAt',
  })

  const body = extractContent((post as any).content)

  return (
    <div className="pt-20 bg-navy">
      {/* Hero */}
      <section className="bg-navy relative overflow-hidden">
        {(post as any).coverImage?.url && (
          <div className="absolute inset-0">
            <Image src={(post as any).coverImage.url} alt={(post as any).title} fill className="object-cover opacity-15" />
          </div>
        )}

        <div className="container-site relative z-10 py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-5">
              {(post as any).category && <span className="tag-gold">{categoryLabels[(post as any).category]}</span>}
              {(post as any).readingTime && <span className="text-xs text-ivory/50">{(post as any).readingTime} دقیقه مطالعه</span>}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-ivory leading-tight mb-5">{(post as any).title}</h1>
            {(post as any).excerpt && <p className="text-ivory/60 text-lg leading-relaxed mb-6">{(post as any).excerpt}</p>}
            <div className="flex items-center gap-4 text-sm text-ivory/50">
              {(post as any).author?.name && (
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 bg-navy-light text-ivory text-xs font-bold flex items-center justify-center">
                    {(post as any).author.name.charAt(0)}
                  </span>
                  <span>{(post as any).author.name}</span>
                </div>
              )}
              {(post as any).publishedAt && <span>{new Date((post as any).publishedAt).toLocaleDateString('fa-IR')}</span>}
            </div>
          </div>
        </div>
      </section>

      <div className="container-site section-py">
        <div className="grid lg:grid-cols-3 gap-12">
          <article className="lg:col-span-2">
            {(post as any).coverImage?.url && (
              <div className="relative w-full aspect-video overflow-hidden mb-8">
                <Image src={(post as any).coverImage.url} alt={(post as any).title} fill className="object-cover" />
              </div>
            )}
            <div dangerouslySetInnerHTML={{ __html: body.html }} className="prose-rtl text-white leading-8 whitespace-pre-line text-base"/>
            {(post as any).author && (
              <div className="mt-8 pt-8 border-t border-bone">
                <div className="card bg-navy flex items-start gap-4">
                  <span className="w-12 h-12 bg-navy text-ivory text-lg font-bold flex items-center justify-center flex-shrink-0">
                    {(post as any).author.name?.charAt(0)}
                  </span>
                  <div>
                    <p className="font-bold text-ink">{(post as any).author.name}</p>
                    {(post as any).author.specialization && <p className="text-sm text-teal">{(post as any).author.specialization}</p>}
                  </div>
                </div>
              </div>
            )}
          </article>

          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="card bg-navy text-ivory">
                <span className="gold-line" />
                <h3 className="font-bold mb-2">سوال حقوقی دارید؟</h3>
                <p className="text-ivory/60 text-sm mb-4">وکیل ما آماده پاسخگویی هستند</p>
                <Link href="/qa" className="btn-gold w-full justify-center text-sm">ارسال سوال</Link>
              </div>
              {related.length > 0 && (
                <div>
                  <h3 className="font-bold text-bone mb-4 text-sm">مقالات مرتبط</h3>
                  <div className="space-y-3">
                    {related.map((r: any) => (
                      <Link key={r.id} href={`/blog/${r.slug || r.id}`} className="block card bg-white hover:border-navy p-4 group">
                        <h4 className="text-sm font-medium text-ink group-hover:text-navy leading-snug transition-colors">{r.title}</h4>
                        {r.publishedAt && <p className="text-xs text-silver mt-1">{new Date(r.publishedAt).toLocaleDateString('fa-IR')}</p>}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              <Link href="/blog" className="block text-sm text-silver hover:text-navy transition-colors text-center">← بازگشت به مقالات</Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
