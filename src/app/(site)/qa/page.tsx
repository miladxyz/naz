import { Inbox } from 'lucide-react'
import { safeFind } from '@/lib/payload'
import type { Metadata } from 'next'
import { AskQuestionForm } from '@/components/AskQuestionForm'
import { QuestionCard } from '@/components/QuestionCard'

export const metadata: Metadata = {
  title: 'پرسش و پاسخ',
  description: 'سوال حقوقی خود را از وکیل متخصص تیم حقوقی علیرضا نظری بپرسید',
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

export default async function QAPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const params = await searchParams
  const activeCategory = params.category
  
  const where: any = { status: { equals: 'answered' }, isPublic: { equals: true } }
  if (activeCategory && categoryLabels[activeCategory]) {
    where.category = { equals: activeCategory }
  }

  const questions = await safeFind('questions', {
    where,
    limit: 20,
    sort: '-answeredAt',
    depth: 1,
  })

  return (
    <div className="pt-24">
      {/* Header */}
      <section className="section-py bg-navy relative overflow-hidden noise-overlay">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-teal to-transparent opacity-60" />
        <div className="container-site">
          <p className="text-teal text-xs tracking-widest uppercase mb-4">راهنمای حقوقی</p>
          <h1 className="text-4xl md:text-6xl font-bold text-ivory mb-4">پرسش و پاسخ</h1>
          <p className="text-ivory/60 text-lg max-w-xl leading-relaxed">
            سوال حقوقی خود را مطرح کنید و از پاسخ وکیل متخصص بهره‌مند شوید.
          </p>
        </div>
      </section>

      <div className="container-site section-py">
        <div className="grid lg:grid-cols-3 gap-12">

          {/* Questions list */}
          <div className="lg:col-span-2">
            {/* Category filter — all English URL params */}
            <div className="flex flex-wrap gap-2 mb-8">
              <a href="/qa"
                className={`z-10 tag cursor-pointer transition-all ${!activeCategory ? 'bg-navy text-ivory border-navy' : 'hover:border-navy hover:text-navy'}`}>
                همه
              </a>
              {Object.entries(categoryLabels).map(([value, label]) => (
                <a key={value} href={`/qa?category=${value}`}
                  className={`tag cursor-pointer z-10 transition-all ${activeCategory === value ? 'bg-navy text-ivory border-navy' : 'hover:border-navy hover:text-silver'}`}>
                  {label}
                </a>
              ))}
            </div>

            {questions.length > 0 ? (
              <div className="space-y-4">
                {questions.map((q: any) => <QuestionCard key={q.id} question={q} />)}
              </div>
            ) : (
              <div className="card text-center py-16 text-silver">
                <p className="text-3xl mb-3"></p>
                <p>هنوز سوالی در این دسته‌بندی پاسخ داده نشده است.</p>
              </div>
            )}
          </div>

          {/* Ask form sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <AskQuestionForm categories={categoryLabels} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
