'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'


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
  successful:  { label: 'موفقیت‌آمیز', color: 'bg-green-50 text-green-700 border-green-200' },
  settled:     { label: 'توافقی',       color: 'bg-blue-50 text-blue-700 border-blue-200' },
  educational: { label: 'آموزنده',      color: 'bg-gray-50 text-gray-700 border-gray-200' },
}

export default function CaseCards({ experiences }: { experiences: any[] }) {
  const [openId, setOpenId] = useState<string | null>(null)

  function toggle(id: string) {
    setOpenId(prev => (prev === id ? null : id))
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {experiences.map((exp: any) => {
        const outcome  = outcomeConfig[exp.outcome] || outcomeConfig.educational
        const isOpen   = openId === exp.id
        const hasStory = !!exp.story?.trim()

        return (
          <div
            key={exp.id}
            className={`card group transition-all duration-300 ${isOpen ? 'border-teal/40 shadow-teal-glow' : ''}`}
          >
            {/* Header row */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex flex-wrap gap-2">
                <span className={`text-xs px-2 py-0.5 border ${outcome.color}`}>{outcome.label}</span>
                {exp.category && <span className="tag text-ink">{categoryLabels[exp.category]}</span>}
              </div>
              {exp.year && <span className="text-xs text-silver flex-shrink-0">{exp.year}</span>}
            </div>

            {/* Title */}
            <h3 className="font-bold text-ink text-lg mb-3 leading-snug group-hover:text-graphite transition-colors">
              {exp.title}
            </h3>

            {/* Summary */}
            <p className="text-sm text-silver leading-relaxed">{exp.summary}</p>

            {/* Accordion story */}
            {hasStory && (
              <>
                <button
                  onClick={() => toggle(exp.id)}
                  className="mt-4 flex items-center gap-1.5 text-xs font-medium text-teal hover:text-teal/80 transition-colors"
                >
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                  />
                  {isOpen ? 'بستن شرح کامل' : 'مشاهده شرح کامل'}
                </button>

                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="mt-4 pt-4 border-t border-bone">
                    <p className="text-sm text-graphite leading-[2] whitespace-pre-line">
                      {exp.story}
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Lawyer footer */}
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
  )
}
