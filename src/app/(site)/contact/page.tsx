'use client'

import { CheckCircle2, Clock, Mail, MapPin, Phone } from 'lucide-react'

import { useState } from 'react'
import Link from 'next/link'

const contactMethods = [
  { Icon: Phone,  label: 'تلفن اول',   value: '۰۹۱۲۰۳۱۰۸۰۶',          href: 'tel:+989120310806',                dir: 'ltr' as const },
  { Icon: Phone,  label: 'تلفن دوم',   value: '۰۹۱۲۰۳۱۰۸۰۵',          href: 'tel:+989120310805',                dir: 'ltr' as const },
  { Icon: Mail,   label: 'ایمیل',      value: 'info@alirezanazari.com', href: 'mailto:info@alirezanazari.com',  dir: 'ltr' as const },
  { Icon: null,   label: 'اینستاگرام', value: '@alireza.nazari.law',           href: 'https://instagram.com/alireza.nazari.law', dir: 'ltr' as const },
]

const practiceAreas = [
  { label: 'کیفری',               href: '/qa?category=criminal' },
  { label: 'حقوقی',               href: '/qa?category=civil' },
  { label: 'داوری و حل اختلاف',   href: '/qa?category=arbitration' },
  { label: 'امور حسبی',           href: '/qa?category=probate' },
  { label: 'دعاوی ارث و ترکه',    href: '/qa?category=inheritance' },
  { label: 'حقوق کار',            href: '/qa?category=labor' },
  { label: 'حقوق خانواده',        href: '/qa?category=family' },
  { label: 'حقوق بانکی',          href: '/qa?category=banking' },
  { label: 'حقوق بیمه',           href: '/qa?category=insurance' },
]

export default function ContactPage() {
  const [form, setForm]     = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit() {
    if (!form.name || !form.email || !form.message) return
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      })
      if (!res.ok) throw new Error('failed')
      setStatus('success')
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
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
          <p className="text-teal text-xs tracking-widest uppercase mb-4">ارتباط با ما</p>
          <h1 className="text-4xl md:text-6xl font-bold text-ivory mb-4">تماس با ما</h1>
          <p className="text-ivory/60 text-lg max-w-xl leading-relaxed">
            برای مشاوره حقوقی، ارسال سوال یا هرگونه همکاری با دفتر وکالت علیرضا نظری در تماس باشید.
          </p>
        </div>
      </section>

      {/* Quick contact cards */}
      <section className="bg-navy border-b border-bone">
        <div className="container-site py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {contactMethods.map((m) => (
              <a key={m.label} href={m.href}
                target={m.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="border-none card bg-white/20 text-center group hover:border-teal/30 hover:shadow-teal-glow transition-all duration-300 shadow-sm ring-black/5 isolate aspect-video rounded-xl">
                <div className="w-10 h-10 flex items-center justify-center mx-auto mb-3" style={{ background: 'rgba(76,180,201,0.08)', border: '1px solid rgba(76,180,201,0.2)' }}>
                  {m.Icon ? <m.Icon size={18} style={{ color: '#4cb4c9' }} /> : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4cb4c9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="20" x="2" y="2" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                    </svg>
                  )}
                </div>
                <p className="text-xs text-white mb-1">{m.label}</p>
                <p className="text-sm font-medium text-gold group-hover:text-[#efdc5b] transition-colors" dir={m.dir}>{m.value}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="container-site section-py">
        <div className="grid lg:grid-cols-2 gap-16">

          {/* Contact form */}
          <div>
            <span className="gold-line" />
            <h2 className="section-heading mb-2">ارسال پیام</h2>
            <p className="text-silver text-sm mb-8">فرم زیر را تکمیل کنید. تیم ما ظرف ۲۴ ساعت کاری پاسخ می‌دهد.</p>

            {status === 'success' ? (
              <div className="bg-emerald-50 border border-emerald-200 text-center py-12 animate-scale-in">
                <span className="text-5xl block mb-4"></span>
                <h3 className="font-bold text-emerald-800 mb-2">پیام شما ارسال شد!</h3>
                <p className="text-emerald-600 text-sm mb-6">به زودی با شما تماس خواهیم گرفت.</p>
                <button onClick={() => setStatus('idle')} className="btn-outline text-sm px-4 py-2">ارسال پیام جدید</button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-silver block mb-1.5">نام کامل *</label>
                    <input className="input" placeholder="نام و نام خانوادگی"
                      value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-silver block mb-1.5">ایمیل *</label>
                    <input type="email" dir="ltr" className="input" placeholder="email@example.com"
                      value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-silver block mb-1.5">شماره تماس</label>
                    <input type="tel" dir="ltr" className="input" placeholder="۰۹۱۲۰۳۱۰۸۰۵"
                      value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-silver block mb-1.5">موضوع</label>
                    <select className="select" value={form.subject}
                      onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}>
                      <option value="">انتخاب کنید</option>
                      {practiceAreas.map(a => (
                        <option key={a.href} value={a.label}>{a.label}</option>
                      ))}
                      <option value="other">سایر موضوعات</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-silver block mb-1.5">پیام *</label>
                  <textarea rows={6} className="textarea" placeholder="پیام خود را اینجا بنویسید..."
                    value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} />
                </div>
                {status === 'error' && (
                  <p className="text-red-600 text-sm">خطا در ارسال پیام. لطفاً دوباره تلاش کنید.</p>
                )}
                <button onClick={handleSubmit}
                  disabled={status === 'loading' || !form.name || !form.email || !form.message}
                  className="btn-primary w-full justify-center py-3 disabled:opacity-50">
                  {status === 'loading' ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-ivory/30 border-t-ivory rounded-full animate-spin" />
                      در حال ارسال...
                    </span>
                  ) : 'ارسال پیام'}
                </button>
                <p className="text-xs text-silver text-center">اطلاعات شما محرمانه نگه داشته می‌شود</p>
              </div>
            )}
          </div>

          {/* Office info */}
          <div className="space-y-8">
            <div>
              <span className="gold-line" />
              <h2 className="section-heading mb-6">دفتر حقوقی</h2>

              <div className="space-y-5">
                {[
                  { Icon: MapPin, label: 'آدرس',      value: 'شیراز، خیابان معالی آباد، حد فاصل پزشکان و دوستان، مجتمع تجاری آوا، طبقه ۷، واحد ۷۱', href: null },
                  { Icon: Phone,  label: 'تلفن اول',  value: '۰۹۱۲۰۳۱۰۸۰۶', href: 'tel:+989120310806' },
                  { Icon: Phone,  label: 'تلفن دوم',  value: '۰۹۱۲۰۳۱۰۸۰۵', href: 'tel:+989120310805' },
                  { Icon: Mail,   label: 'ایمیل',      value: 'info@alirezanazari.com', href: 'mailto:info@alirezanazari.com' },
                  { Icon: Clock,   label: 'ساعات کاری', value: 'شنبه تا پنجشنبه — ۸ صبح تا ۸ عصر', href: null },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-0.5"><item.Icon size={18} style={{ color: '#4cb4c9' }} /></div>
                    <div>
                      <p className="text-xs text-silver mb-0.5">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="text-sm text-ivory hover:text-silver transition-colors font-medium" dir="ltr">{item.value}</a>
                      ) : (
                        <p className="text-sm text-ivory leading-relaxed">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Map */}
              <a href="https://maps.app.goo.gl/JB8GcW97qjPFRnXM6"
                target="_blank" rel="noopener noreferrer"
                className="mt-6 block relative w-full h-52 bg-bone border border-bone hover:border-navy/30 hover:shadow-navy-glow transition-all duration-300 overflow-hidden group">
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-silver group-hover:text-navy transition-colors z-10">
                  <span className="text-5xl"></span>
                  <span className="text-sm font-medium">مشاهده در Google Maps</span>
                  <span className="text-xs">شیراز، معالی‌آباد، مجتمع آوا</span>
                </div>
                <div className="absolute inset-0 opacity-5"
                  style={{ backgroundImage: 'repeating-linear-gradient(0deg,#000 0,#000 1px,transparent 1px,transparent 40px),repeating-linear-gradient(90deg,#000 0,#000 1px,transparent 1px,transparent 40px)' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full z-20">
                  <div className="w-4 h-4 bg-navy rounded-full border-2 border-white shadow-navy-glow" />
                </div>
              </a>
            </div>

            {/* Practice areas quick links */}
            <div className="card bg-navy text-ivory">
              <div className="h-0.5 bg-gradient-to-r from-teal to-teal-light -mx-6 -mt-6 mb-6" />
              <h3 className="font-bold mb-4">حوزه‌های تخصصی</h3>
              <div className="flex flex-wrap gap-2">
                {practiceAreas.map(a => (
                  <Link key={a.href} href={a.href}
                    className="text-xs px-3 py-1.5 border border-navy-muted text-ivory/70 hover:border-teal hover:text-teal transition-all duration-200">
                    {a.label}
                  </Link>
                ))}
              </div>
              <div className="mt-5 pt-5 border-t border-navy-light/40 flex gap-3">
                <Link href="/qa" className="btn-gold text-sm px-4 py-2 flex-1 justify-center">پرسش از وکیل</Link>
                <Link href="/faq" className="btn-ghost border border-ivory/20 text-ivory text-sm px-4 py-2 flex-1 justify-center hover:bg-ivory/10">سوالات متداول</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
