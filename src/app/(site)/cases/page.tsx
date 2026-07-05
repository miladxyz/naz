import { getPayloadClient, safeFind } from '@/lib/payload'
import CaseCards from '@/components/CaseCards'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'تجربیات',
  description: 'نمونه پرونده‌های موفق تیم حقوقی علیرضا نظری',
}

async function getExperiences() {
  try {
    const payload = await getPayloadClient()
    const res = await payload.find({ collection: 'experiences', limit: 50, sort: '-year' })
    return res.docs
  } catch { return [] }
}

export default async function ExperiencesPage() {
  const experiences = await getExperiences()

  return (
    <div className="pt-24">
      {/* Header */}
      <section className="section-py bg-navy relative overflow-hidden noise-overlay">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-teal to-transparent opacity-60" />
        <div className="container-site">
          <p className="text-teal text-xs tracking-widest uppercase mb-4">سوابق ما</p>
          <h1 className="text-4xl md:text-6xl font-bold text-ivory mb-4">تجربیات</h1>
          <p className="text-silver text-lg max-w-xl leading-relaxed">
            نمونه‌هایی از پرونده‌های موفق ما که نشان‌دهنده توانایی و تعهد تیم ماست.
          </p>
        </div>
      </section>

      <div className="container-site section-py">
        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {[
            { value: experiences.filter((e: any) => e.outcome === 'successful').length, label: 'پرونده موفق' },
            { value: experiences.filter((e: any) => e.outcome === 'settled').length,    label: 'توافق مسالمت‌آمیز' },
            { value: experiences.length, label: 'پرونده مستند' },
          ].map((s) => (
            <div key={s.label} className="card text-center">
              <div className="text-3xl font-bold text-ink mb-1">{s.value}</div>
              <div className="text-xs text-silver">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Cases with accordion */}
        {experiences.length > 0 ? (
          <CaseCards experiences={experiences} />
        ) : (
          <div className="card text-center py-16 text-silver">
            <p className="text-2xl mb-2">📁</p>
            <p>تجربه‌ای ثبت نشده است.</p>
          </div>
        )}
      </div>
    </div>
  )
}
