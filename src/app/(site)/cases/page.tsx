import { getPayloadClient, safeFind } from '@/lib/payload'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'تجربیات',
  description: 'نمونه پرونده‌های موفق تیم حقوقی علیرضا نظری',
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
  others:   'عمومی',
}
const outcomeConfig: Record<string, { label: string; color: string }> = {
  successful: { label: 'موفقیت‌آمیز', color: 'bg-green-50 text-green-700 border-green-200' },
  settled:    { label: 'توافقی',       color: 'bg-blue-50 text-blue-700 border-blue-200' },
  educational:{ label: 'آموزنده',      color: 'bg-gray-50 text-gray-700 border-gray-200' },
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

        {/* Experiences */}
        {experiences.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {experiences.map((exp: any) => {
              const outcome = outcomeConfig[exp.outcome] || outcomeConfig.educational
              return (
                <div key={exp.id} className="card group">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex flex-wrap gap-2">
                      <span className={`text-xs px-2 py-0.5 border ${outcome.color}`}>{outcome.label}</span>
                      {exp.category && <span className="tag text-ink">{categoryLabels[exp.category]}</span>}
                    </div>
                    {exp.year && <span className="text-xs text-silver flex-shrink-0">{exp.year}</span>}
                  </div>

                  <h3 className="font-bold text-ink text-lg mb-3 leading-snug group-hover:text-graphite transition-colors">
                    {exp.title}
                  </h3>
                  <p className="text-sm text-silver leading-relaxed">{exp.summary}</p>

                  {exp.relatedLawyer && (
                    <div className="mt-4 pt-4 border-t border-bone flex items-center gap-2 text-xs text-silver">
                      <span>وکیل:</span>
                      <span className="font-medium text-graphite">{exp.relatedLawyer?.name || ''}</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="card text-center py-16 text-silver">
            <p className="text-2xl mb-2"></p>
            <p>تجربه‌ای ثبت نشده است.</p>
          </div>
        )}
      </div>
    </div>
  )
}
