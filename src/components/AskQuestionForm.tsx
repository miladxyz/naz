'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { Scale, LayoutDashboard, FileEdit, LogIn, UserPlus, Send, CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react'

export function AskQuestionForm({ categories }: { categories: Record<string, string> }) {
  const { user, loading, isStaff } = useAuth()
  const [form, setForm]   = useState({ category: '', title: '', body: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit() {
    if (!form.title || !form.body || !form.category || !user) return
    setStatus('loading')
    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, name: user.name, email: user.email })})
      if (!res.ok) throw new Error()
      setStatus('success')
      setForm({ category: '', title: '', body: '' })
      window.dispatchEvent(new CustomEvent('question-submitted'))
    } catch {
      setStatus('error')
    }
  }

  /* ── Loading ──────────────────────────────────── */
  if (loading) {
    return (
      <div className="p-6 animate-pulse" style={{ background: '#0d1f3c', border: '1px solid rgba(22,45,82,0.8)' }}>
        <div className="h-0.5 -mx-6 -mt-6 mb-6" style={{ background: 'linear-gradient(90deg, #4cb4c9, #a8dde8)' }} />
        <div className="space-y-3">
          {[5, 3, 10, 10, 24, 10].map((h, i) => (
            <div key={i} className="rounded" style={{ height: `${h * 4}px`, background: 'rgba(22,45,82,0.8)' }} />
          ))}
        </div>
      </div>
    )
  }

  /* ── Staff panel ──────────────────────────────── */
  if (user && isStaff) {
    const cfg: Record<string, { title: string; desc: string; links: { href: string; label: string; icon: any; primary?: boolean }[] }> = {
      founder: {
        title: 'پنل بنیان‌گذار',
        desc: 'دسترسی کامل به تمام بخش‌های مدیریتی.',
        links: [
          { href: '/dashboard', label: 'سوالات بی‌پاسخ', icon: LayoutDashboard, primary: true },
          { href: '/admin/collections/posts', label: 'مدیریت مقالات', icon: FileEdit },
        ]},
      lawyer: {
        title: 'پنل وکیل',
        desc: 'سوالات حوزه تخصصی شما در انتظارند.',
        links: [
          { href: '/dashboard', label: 'پاسخ به سوالات', icon: LayoutDashboard, primary: true },
          { href: '/dashboard', label: 'نوشتن مقاله', icon: FileEdit },
        ]},
      it_manager: {
        title: 'پنل مدیریت IT',
        desc: 'مدیریت محتوا و اینستاگرام.',
        links: [
          { href: '/admin/collections/instagram-posts', label: 'پست‌های اینستاگرام', icon: LayoutDashboard, primary: true },
        ]},
      financial_manager: {
        title: 'پنل مالی',
        desc: 'دسترسی به پنل مدیریت.',
        links: [
          { href: '/admin', label: 'پنل Payload', icon: LayoutDashboard, primary: true },
        ]}}

    const c = cfg[user.role] || cfg.founder

    return (
      <div className="overflow-hidden" style={{ background: '#0d1f3c', border: '1px solid rgba(22,45,82,0.8)' }}>
        <div className="h-0.5" style={{ background: 'linear-gradient(90deg, #4cb4c9, #a8dde8)' }} />
        <div className="p-5 border-b" style={{ borderColor: 'rgba(22,45,82,0.6)' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 flex items-center justify-center text-white text-base font-bold flex-shrink-0"
              style={{ background: '#4cb4c9' }}>{user.name.charAt(0)}</div>
            <div>
              <p className="text-ivory font-semibold text-sm">{user.name}</p>
              <p className="text-xs font-medium" style={{ color: '#4cb4c9' }}>
                {user.role === 'founder' ? 'بنیان‌گذار' : user.role === 'lawyer' ? 'وکیل' : user.role === 'it_manager' ? 'مدیر IT' : 'مدیر مالی'}
              </p>
            </div>
          </div>
          <h3 className="text-ivory font-bold text-sm">{c.title}</h3>
          <p className="text-xs mt-1" style={{ color: 'rgba(246,248,250,0.45)' }}>{c.desc}</p>
        </div>
        <div className="p-4 space-y-2">
          {c.links.map(link => {
            const Icon = link.icon
            return link.primary ? (
              <Link key={link.href} href={link.href}
                className="flex items-center justify-between w-full px-4 py-2.5 text-sm font-semibold text-white transition-all"
                style={{ background: '#4cb4c9' }}
                onMouseOver={e => (e.currentTarget as HTMLElement).style.background = '#2a8fa3'}
                onMouseOut={e  => (e.currentTarget as HTMLElement).style.background = '#4cb4c9'}>
                <span className="flex items-center gap-2"><Icon size={15} />{link.label}</span>
                <ChevronRight size={14} />
              </Link>
            ) : (
              <Link key={link.href} href={link.href}
                className="flex items-center justify-between w-full px-4 py-2.5 text-sm transition-all"
                style={{ color: 'rgba(246,248,250,0.6)', border: '1px solid rgba(36,61,106,0.8)' }}
                onMouseOver={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(76,180,201,0.4)'; (e.currentTarget as HTMLElement).style.color = '#f6f8fa' }}
                onMouseOut={e  => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(36,61,106,0.8)'; (e.currentTarget as HTMLElement).style.color = 'rgba(246,248,250,0.6)' }}>
                <span className="flex items-center gap-2"><Icon size={15} />{link.label}</span>
                <ChevronRight size={14} />
              </Link>
            )
          })}
        </div>
        <div className="px-4 pb-4">
          <p className="text-xs text-center" style={{ color: 'rgba(246,248,250,0.2)' }}>این فرم برای کاربران عمومی است</p>
        </div>
      </div>
    )
  }

  /* ── Not logged in ────────────────────────────── */
  if (!user) {
    return (
      <div className="p-6" style={{ background: '#0d1f3c', border: '1px solid rgba(22,45,82,0.8)' }}>
        <div className="h-0.5 -mx-6 -mt-6 mb-6" style={{ background: 'linear-gradient(90deg, #4cb4c9, #a8dde8)' }} />
        <div className="text-center py-6">
          <div className="w-16 h-16 flex items-center justify-center mx-auto mb-5"
            style={{ background: 'rgba(76,180,201,0.1)', border: '1px solid rgba(76,180,201,0.25)' }}>
            <Scale size={28} style={{ color: '#4cb4c9' }} />
          </div>
          <h3 className="font-bold text-lg text-ivory mb-2">سوال حقوقی دارید؟</h3>
          <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(246,248,250,0.45)' }}>
            برای ارسال سوال و دریافت پاسخ از وکلای متخصص، ابتدا وارد حساب کاربری خود شوید.
          </p>
          <div className="space-y-3">
            <Link href="/auth"
              className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white transition-all"
              style={{ background: '#4cb4c9', boxShadow: '0 4px 16px rgba(76,180,201,0.3)' }}
              onMouseOver={e => (e.currentTarget as HTMLElement).style.background = '#2a8fa3'}
              onMouseOut={e  => (e.currentTarget as HTMLElement).style.background = '#4cb4c9'}>
              <LogIn size={16} /> ورود به حساب
            </Link>
            <Link href="/auth"
              className="w-full flex items-center justify-center gap-2 py-3 text-sm transition-all"
              style={{ border: '1px solid rgba(246,248,250,0.15)', color: 'rgba(246,248,250,0.6)' }}
              onMouseOver={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(246,248,250,0.08)'; (e.currentTarget as HTMLElement).style.color = '#f6f8fa' }}
              onMouseOut={e  => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'rgba(246,248,250,0.6)' }}>
              <UserPlus size={16} /> ثبت‌نام رایگان
            </Link>
          </div>
          <p className="text-xs mt-4" style={{ color: 'rgba(246,248,250,0.25)' }}>پاسخ توسط وکلای متخصص ارائه می‌شود</p>
        </div>
      </div>
    )
  }

  /* ── Logged-in client ─────────────────────────── */
  return (
    <div className="p-6" style={{ background: '#0d1f3c', border: '1px solid rgba(22,45,82,0.8)' }}>
      <div className="h-0.5 -mx-6 -mt-6 mb-6" style={{ background: 'linear-gradient(90deg, #4cb4c9, #a8dde8)' }} />
      <h3 className="font-bold text-lg text-ivory mb-1">سوال خود را بپرسید</h3>
      <p className="text-sm mb-5" style={{ color: 'rgba(246,248,250,0.45)' }}>پس از ثبت، وکیل متخصص پاسخ می‌دهد</p>

      {/* User badge */}
      <div className="flex items-center gap-3 px-3 py-2.5 mb-5"
        style={{ background: 'rgba(22,45,82,0.6)', border: '1px solid rgba(36,61,106,0.8)' }}>
        <div className="w-8 h-8 text-white text-sm font-bold flex items-center justify-center flex-shrink-0"
          style={{ background: '#4cb4c9' }}>{user.name.charAt(0)}</div>
        <div className="flex-1 min-w-0">
          <p className="text-ivory text-sm font-medium truncate">{user.name}</p>
          <p className="text-xs truncate" style={{ color: 'rgba(246,248,250,0.35)' }} dir="ltr">{user.email}</p>
        </div>
        <span className="text-xs flex items-center gap-1 text-emerald-400 flex-shrink-0">
          <CheckCircle2 size={12} /> وارد شده
        </span>
      </div>

      {status === 'success' ? (
        <div className="text-center py-8 animate-scale-in">
          <div className="w-14 h-14 flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}>
            <CheckCircle2 size={28} className="text-emerald-400" />
          </div>
          <p className="text-ivory font-semibold mb-1">سوال شما ثبت شد</p>
          <p className="text-sm mb-5" style={{ color: 'rgba(246,248,250,0.45)' }}>وکیل متخصص به زودی پاسخ خواهد داد.</p>
          <div className="space-y-2">
            <Link href="/dashboard"
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white"
              style={{ background: '#4cb4c9' }}>
              <LayoutDashboard size={15} /> مشاهده سوالات من
            </Link>
            <button onClick={() => setStatus('idle')}
              className="w-full text-sm py-1.5 transition-colors"
              style={{ color: 'rgba(246,248,250,0.4)' }}
              onMouseOver={e => (e.currentTarget as HTMLElement).style.color = '#4cb4c9'}
              onMouseOut={e  => (e.currentTarget as HTMLElement).style.color = 'rgba(246,248,250,0.4)'}>
              ارسال سوال جدید
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="text-xs block mb-1" style={{ color: 'rgba(246,248,250,0.45)' }}>دسته‌بندی *</label>
            <select className="w-full px-3 py-2.5 text-sm text-ivory appearance-none cursor-pointer focus:outline-none transition-all"
              style={{ background: 'rgba(22,45,82,0.6)', border: '1px solid rgba(36,61,106,0.8)' }}
              value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
              <option value="">انتخاب کنید</option>
              {Object.entries(categories).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs block mb-1" style={{ color: 'rgba(246,248,250,0.45)' }}>عنوان سوال *</label>
            <input className="w-full px-3 py-2.5 text-sm text-ivory focus:outline-none transition-all"
              style={{ background: 'rgba(22,45,82,0.6)', border: '1px solid rgba(36,61,106,0.8)' }}
              placeholder="سوال خود را خلاصه بنویسید"
              value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs block mb-1" style={{ color: 'rgba(246,248,250,0.45)' }}>شرح سوال *</label>
            <textarea rows={4} className="w-full px-3 py-2.5 text-sm text-ivory focus:outline-none transition-all resize-none"
              style={{ background: 'rgba(22,45,82,0.6)', border: '1px solid rgba(36,61,106,0.8)' }}
              placeholder="جزئیات سوال حقوقی خود را بنویسید..."
              value={form.body} onChange={e => setForm(p => ({ ...p, body: e.target.value }))} />
          </div>

          {status === 'error' && (
            <p className="text-red-400 text-xs flex items-center gap-1.5">
              <AlertCircle size={13} /> خطا در ارسال. لطفاً دوباره تلاش کنید.
            </p>
          )}

          <button onClick={handleSubmit}
            disabled={status === 'loading' || !form.title || !form.body || !form.category}
            className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white transition-all disabled:opacity-50"
            style={{ background: '#4cb4c9', boxShadow: '0 4px 16px rgba(76,180,201,0.3)' }}>
            {status === 'loading' ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> در حال ارسال...</>
            ) : (
              <><Send size={15} /> ارسال سوال</>
            )}
          </button>

          <p className="text-xs text-center" style={{ color: 'rgba(246,248,250,0.25)' }}>
            با ارسال سوال، <a href="/terms" style={{ color: '#4cb4c9' }} className="hover:underline">شرایط استفاده</a> را می‌پذیرید
          </p>
        </div>
      )}
    </div>
  )
}
