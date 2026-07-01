'use client'

import { useState } from 'react'
import { Briefcase, GraduationCap, Star, Upload, CheckCircle2 } from 'lucide-react'

const positions = [
  {
    id: 'secretary',
    icon: Briefcase,
    title: 'منشی و دستیار حقوقی',
    type: 'تمام وقت',
    description: 'مدیریت امور اداری دفتر، هماهنگی جلسات، پاسخگویی به تماس‌ها و پیگیری پرونده‌ها.',
    requirements: ['آشنایی با نرم‌افزارهای اداری', 'توانایی مدیریت زمان', 'مهارت ارتباطی قوی' ,'دانشجوی حقوق'],
  },
  {
    id: 'intern',
    icon: GraduationCap,
    title: 'کارآموز حقوقی',
    type: 'همکاری پروژه‌ای',
    description: 'همکاری در پرونده‌های تخصصی حقوقی، کیفری و خانواده ...',
    requirements: ['پروانه وکالت معتبر', 'تخصص در یک حوزه', 'آشنایی با دادگاه‌های شیراز'],
  },
]

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  position: '',
  experience: '',
  location: '',
  currentlyEmployed: '',
  resumeSentBefore: '',
  preferredShift: '',
  fieldOfStudy: '',
  message: '',
}

export default function CareersPage() {
  const [form, setForm]         = useState(initialForm)
  const [status, setStatus]     = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [selected, setSelected] = useState<string | null>(null)

  function set(field: string, value: string) {
    setForm(p => ({ ...p, [field]: value }))
  }

  function selectPosition(id: string) {
    setSelected(id)
    set('position', positions.find(p => p.id === id)?.title ?? '')
    document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' })
  }

  async function handleSubmit() {
    if (!form.fullName || !form.email || !form.phone || !form.position) return
    setStatus('loading')
    try {
      const res = await fetch('/api/careers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('failed')
      setStatus('success')
      setForm(initialForm)
      setSelected(null)
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="pt-20">

      {/* Header */}
      <section className="section-py bg-navy relative overflow-hidden noise-overlay">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(0deg,rgba(255,255,255,1) 0,rgba(255,255,255,1) 1px,transparent 1px,transparent 80px),repeating-linear-gradient(90deg,rgba(255,255,255,1) 0,rgba(255,255,255,1) 1px,transparent 1px,transparent 80px)' }} />
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-teal to-transparent opacity-60" />
        <div className="container-site">
          <p className="text-teal text-xs tracking-widest uppercase mb-4">فرصت‌های شغلی</p>
          <h1 className="text-4xl md:text-6xl font-bold text-ivory mb-4">همکاری با ما</h1>
          <p className="text-ivory/60 text-lg max-w-xl leading-relaxed">
            دفتر وکالت علیرضا نظری به دنبال افراد متعهد و متخصص برای پیوستن به تیم حقوقی خود است.
          </p>
        </div>
      </section>

      {/* Position cards */}
      <section className="container-site section-py">
        <div className="mb-10">
          <span className="gold-line" />
          <h2 className="section-heading mb-2">موقعیت‌های شغلی</h2>
          <p className="text-silver text-sm">برای درخواست، روی هر موقعیت کلیک کنید تا فرم ثبت درخواست باز شود.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {positions.map((pos) => {
            const Icon = pos.icon
            const isActive = selected === pos.id
            return (
              <button
                key={pos.id}
                onClick={() => selectPosition(pos.id)}
                className={`card text-right transition-all duration-300 hover:border-teal/40 hover:shadow-teal-glow cursor-pointer w-full ${
                  isActive ? 'border-teal shadow-teal-glow' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full border ${
                    isActive ? 'bg-teal/10 border-teal/40 text-teal' : 'border-bone text-silver'
                  }`}>
                    {pos.type}
                  </span>
                  <div className="w-10 h-10 flex items-center justify-center"
                    style={{ background: 'rgba(76,180,201,0.08)', border: '1px solid rgba(76,180,201,0.2)' }}>
                    <Icon size={18} style={{ color: '#4cb4c9' }} />
                  </div>
                </div>
                <h3 className="font-bold text-navy text-lg mb-2">{pos.title}</h3>
                <p className="text-silver text-sm leading-relaxed mb-4">{pos.description}</p>
                <ul className="space-y-1.5">
                  {pos.requirements.map(r => (
                    <li key={r} className="flex items-center gap-2 text-xs text-graphite">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal flex-shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
                {isActive && (
                  <div className="mt-4 pt-4 border-t border-teal/20 text-xs text-teal font-medium">
                    ✓ انتخاب شده — فرم را تکمیل کنید
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Application form */}
        <div id="apply-form" className="max-w-2xl mx-auto">
          <span className="gold-line" />
          <h2 className="section-heading mb-2">فرم درخواست همکاری</h2>
          <p className="text-silver text-sm mb-8">اطلاعات خود را وارد کنید. کارشناسان ما ظرف ۴۸ ساعت با شما تماس می‌گیرند.</p>

          {status === 'success' ? (
            <div className="bg-emerald-50 border border-emerald-200 text-center py-12 animate-scale-in">
              <CheckCircle2 className="mx-auto mb-4 text-emerald-600" size={48} />
              <h3 className="font-bold text-emerald-800 mb-2">درخواست شما ثبت شد!</h3>
              <p className="text-emerald-600 text-sm mb-6">به زودی با شما تماس خواهیم گرفت.</p>
              <button onClick={() => setStatus('idle')} className="btn-outline text-sm px-4 py-2">
                ثبت درخواست جدید
              </button>
            </div>
          ) : (
            <div className="space-y-4">

              {/* Personal info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-silver block mb-1.5">نام کامل *</label>
                  <input className="input" placeholder="نام و نام خانوادگی"
                    value={form.fullName} onChange={e => set('fullName', e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-medium text-silver block mb-1.5">ایمیل *</label>
                  <input type="email" dir="ltr" className="input" placeholder="email@example.com"
                    value={form.email} onChange={e => set('email', e.target.value)} />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-silver block mb-1.5">شماره تماس *</label>
                  <input type="tel" dir="ltr" className="input" placeholder="۰۹۱۲۰۰۰۰۰۰۰"
                    value={form.phone} onChange={e => set('phone', e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-medium text-silver block mb-1.5">محل سکونت</label>
                  <input className="input" placeholder="شهر و استان"
                    value={form.location} onChange={e => set('location', e.target.value)} />
                </div>
              </div>

              {/* Job position */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-silver block mb-1.5">موقعیت درخواستی *</label>
                  <select className="select" value={form.position} onChange={e => set('position', e.target.value)}>
                    <option value="">انتخاب کنید</option>
                    {positions.map(p => (
                      <option key={p.id} value={p.title}>{p.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-silver block mb-1.5">سابقه کاری</label>
                  <select className="select" value={form.experience} onChange={e => set('experience', e.target.value)}>
                    <option value="">انتخاب کنید</option>
                    <option value="student">دانشجو / بدون سابقه</option>
                    <option value="1-2">۱ تا ۲ سال</option>
                    <option value="3-5">۳ تا ۵ سال</option>
                    <option value="5+">بیش از ۵ سال</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-silver block mb-1.5">رشته تحصیلی</label>
                  <input className="input" placeholder="مثلاً: حقوق، مدیریت، ..."
                    value={form.fieldOfStudy} onChange={e => set('fieldOfStudy', e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-medium text-silver block mb-1.5">ساعات کاری ترجیحی</label>
                  <select className="select" value={form.preferredShift} onChange={e => set('preferredShift', e.target.value)}>
                    <option value="">انتخاب کنید</option>
                    <option value="morning">صبح</option>
                    <option value="afternoon">بعد از ظهر</option>
                    <option value="both">هر دو</option>
                  </select>
                </div>
              </div>

              {/* Yes/No questions */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-silver block mb-1.5">آیا در حال حاضر شاغل هستید؟</label>
                  <select className="select" value={form.currentlyEmployed} onChange={e => set('currentlyEmployed', e.target.value)}>
                    <option value="">انتخاب کنید</option>
                    <option value="yes">بله</option>
                    <option value="no">خیر</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-silver block mb-1.5">آیا تاکنون به دفتر وکالت علیرضا نظری مراجعه داشته اید؟</label>
                  <select className="select" value={form.resumeSentBefore} onChange={e => set('resumeSentBefore', e.target.value)}>
                    <option value="">انتخاب کنید</option>
                    <option value="yes">بله</option>
                    <option value="no">خیر</option>
                  </select>
                </div>
              </div>

              {/* Motivation */}
              <div>
                <label className="text-xs font-medium text-silver block mb-1.5">معرفی کوتاه / انگیزه همکاری</label>
                <textarea rows={5} className="textarea"
                  placeholder="خودتان را معرفی کنید و دلیل علاقه‌تان به همکاری با این دفتر را بنویسید..."
                  value={form.message} onChange={e => set('message', e.target.value)} />
              </div>

              {status === 'error' && (
                <p className="text-red-600 text-sm">خطا در ارسال درخواست. لطفاً دوباره تلاش کنید.</p>
              )}

              <button
                onClick={handleSubmit}
                disabled={status === 'loading' || !form.fullName || !form.email || !form.phone || !form.position}
                className="btn-primary w-full justify-center py-3 disabled:opacity-50"
              >
                {status === 'loading' ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-ivory/30 border-t-ivory rounded-full animate-spin" />
                    در حال ارسال...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Upload size={16} />
                    ارسال درخواست
                  </span>
                )}
              </button>

              <p className="text-xs text-silver text-center">اطلاعات شما محرمانه نگه داشته می‌شود</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
