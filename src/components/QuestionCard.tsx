'use client'

import { useState } from 'react'
import { ChevronDown, CheckCircle2, Tag, User, Calendar } from 'lucide-react'

const categoryLabels: Record<string, string> = {
  criminal: 'کیفری', civil: 'حقوقی', arbitration: 'داوری و حل اختلاف',
  probate: 'امور حسبی', inheritance: 'دعاوی ارث و ترکه', labor: 'حقوق کار',
  family: 'حقوق خانواده', banking: 'حقوق بانکی', insurance: 'حقوق بیمه',
}

export function QuestionCard({ question }: { question: any }) {
  const [open, setOpen] = useState(false)

  return (
    <div className={`bg-white border transition-all duration-300 ${
      open ? 'border-teal/30 shadow-card' : 'border-bone hover:border-teal/20'
    }`}>
      <button onClick={() => setOpen(!open)}
        className="w-full text-right flex items-start justify-between gap-4 p-5 group">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2.5">
            {question.category && (
              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-bone text-graphite border border-bone">
                <Tag size={10} />
                {categoryLabels[question.category]}
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 size={10} />
              پاسخ داده شده
            </span>
          </div>
          <h3 className="font-semibold text-ink text-sm leading-snug group-hover:text-navy transition-colors text-right">
            {question.title}
          </h3>
        </div>
        <div className={`w-7 h-7 border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200 ${
          open ? 'border-teal bg-teal text-white' : 'border-bone text-silver group-hover:border-teal/40'
        }`}>
          <ChevronDown size={14} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>

      <div className="px-5 pb-3">
        <p className="text-sm text-silver leading-relaxed text-right">{question.body}</p>
      </div>

      {open && question.answer && (
        <div className="mx-5 mb-5 animate-fade-in">
          <div className="p-4" style={{ background: 'rgba(76,180,201,0.05)', border: '1px solid rgba(76,180,201,0.15)' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 text-white text-sm font-bold flex items-center justify-center flex-shrink-0"
                style={{ background: '#4cb4c9' }}>
                {question.answeredBy?.name?.charAt(0) || 'و'}
              </div>
              <div>
                <p className="text-sm font-semibold text-navy">{question.answeredBy?.name || 'وکیل متخصص'}</p>
                {question.answeredAt && (
                  <p className="text-xs text-silver flex items-center gap-1">
                    <Calendar size={10} />
                    {new Date(question.answeredAt).toLocaleDateString('fa-IR')}
                  </p>
                )}
              </div>
            </div>
            <p className="text-sm text-ink leading-relaxed text-right">{question.answer}</p>
          </div>
        </div>
      )}
    </div>
  )
}
