'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { RichEditor } from '@/components/RichEditor'
import { CoverImageUpload } from '@/components/CoverImageUpload'

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
  others:      'سایر',
}

export default function EditPostPage() {
  const { user, isStaff, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [fetching, setFetching] = useState(true)
  const [saving, setSaving]     = useState(false)
  const [success, setSuccess]   = useState(false)
  const [error, setError]       = useState('')

  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    readingTime: '',
    publishNow: true,
    coverImageBase64: '',
  })

  // Auth guard
  useEffect(() => {
    if (!loading && !user) router.replace('/auth')
    if (!loading && user && !isStaff) router.replace('/dashboard')
  }, [user, isStaff, loading, router])

  // Fetch post data
  useEffect(() => {
    if (!id) return
    fetch(`/api/dashboard/posts/${id}`)
      .then(r => r.json())
      .then(data => {
        setForm(f => ({
          ...f,
          title:       data.title       ?? '',
          excerpt:     data.excerpt     ?? '',
          content:     data.content     ?? '',
          category:    data.category    ?? '',
          readingTime: data.readingTime ? String(data.readingTime) : '',
          publishNow:  data._status === 'published',
        }))
        setFetching(false)
      })
      .catch(() => { setError('خطا در بارگذاری مقاله'); setFetching(false) })
  }, [id])

  async function handleSave() {
    if (!form.title || !form.content) return
    setSaving(true)
    setError('')
    const res = await fetch(`/api/dashboard/posts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setSuccess(true)
      setTimeout(() => router.push('/dashboard'), 1800)
    } else {
      const d = await res.json()
      setError(d.error || 'خطا در ذخیره‌سازی')
    }
    setSaving(false)
  }

  if (loading || fetching) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-teal border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="text-center animate-scale-in">
          <div className="text-5xl mb-4">✅</div>
          <p className="font-bold text-emerald-400 text-lg mb-1">مقاله با موفقیت ذخیره شد!</p>
          <p className="text-sm text-silver">در حال بازگشت به داشبورد...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy pt-20" dir="rtl">
      {/* Header */}
      <div className="bg-navy border-b" style={{ borderColor: 'rgba(22,45,82,0.8)' }}>
        <div className="container-site py-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-ivory">ویرایش مقاله</h1>
            <p className="text-ivory/40 text-xs mt-0.5">تغییرات را اعمال کنید و ذخیره کنید</p>
          </div>
          <button onClick={() => router.push('/dashboard')}
            className="text-sm text-silver hover:text-ivory transition-colors">
            ← بازگشت به داشبورد
          </button>
        </div>
      </div>

      <div className="container-site py-8 max-w-3xl">
        <div className="space-y-5">
          {/* Title */}
          <div>
            <label className="text-xs text-ivory/50 block mb-1.5">عنوان مقاله *</label>
            <input
              className="w-full px-4 py-3 text-base font-semibold text-ivory focus:outline-none"
              style={{ background: 'rgba(22,45,82,0.5)', border: '1px solid rgba(36,61,106,0.8)' }}
              placeholder="عنوان مقاله"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            />
          </div>

          {/* Category + Reading time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-ivory/50 block mb-1.5">دسته‌بندی</label>
              <select
                className="w-full px-3 py-2.5 text-sm text-ivory appearance-none cursor-pointer focus:outline-none"
                style={{ background: 'rgba(22,45,82,0.5)', border: '1px solid rgba(36,61,106,0.8)' }}
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                <option value="">انتخاب کنید</option>
                {Object.entries(categoryLabels).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-ivory/50 block mb-1.5">زمان مطالعه (دقیقه)</label>
              <input type="number" min="1" max="60"
                className="w-full px-3 py-2.5 text-sm text-ivory focus:outline-none"
                style={{ background: 'rgba(22,45,82,0.5)', border: '1px solid rgba(36,61,106,0.8)' }}
                placeholder="۵"
                value={form.readingTime}
                onChange={e => setForm(f => ({ ...f, readingTime: e.target.value }))}
              />
            </div>
          </div>

          {/* Cover image */}
          <div>
            <label className="text-xs text-ivory/50 block mb-1.5">تصویر شاخص</label>
            <CoverImageUpload
              value={form.coverImageBase64}
              onChange={(v: string) => setForm(f => ({ ...f, coverImageBase64: v }))}
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="text-xs text-ivory/50 block mb-1.5">خلاصه مقاله</label>
            <textarea rows={2}
              className="w-full px-3 py-2.5 text-sm text-ivory focus:outline-none resize-none"
              style={{ background: 'rgba(22,45,82,0.5)', border: '1px solid rgba(36,61,106,0.8)' }}
              placeholder="یک یا دو جمله خلاصه..."
              value={form.excerpt}
              onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
            />
          </div>

          {/* Rich text editor */}
          <div>
            <label className="text-xs text-ivory/50 block mb-1.5">محتوای مقاله *</label>
            <RichEditor
              value={form.content}
              onChange={v => setForm(f => ({ ...f, content: v }))}
              placeholder="محتوای مقاله را اینجا بنویسید..."
            />
          </div>

          {/* Publish toggle */}
          <div className="flex items-center justify-between p-4"
            style={{ background: 'rgba(22,45,82,0.3)', border: '1px solid rgba(36,61,106,0.6)' }}>
            <div>
              <p className="text-sm font-medium text-ivory">وضعیت انتشار</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(246,248,250,0.4)' }}>
                {form.publishNow ? 'منتشر شده' : 'پیش‌نویس'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer"
                checked={form.publishNow}
                onChange={e => setForm(f => ({ ...f, publishNow: e.target.checked }))} />
              <div className="w-12 h-6 rounded-full transition-colors"
                style={{ background: form.publishNow ? '#4cb4c9' : 'rgba(36,61,106,0.8)' }} />
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"
                style={{ transform: form.publishNow ? 'translateX(-24px)' : 'none' }} />
            </label>
          </div>

          {error && (
            <div className="px-4 py-3 text-sm text-red-400"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={handleSave}
              disabled={saving || !form.title || !form.content}
              className="flex-1 py-3 text-sm font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: '#4cb4c9', color: '#070f1e' }}>
              {saving
                ? <><span className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />در حال ذخیره...</>
                : form.publishNow ? 'ذخیره و انتشار' : 'ذخیره پیش‌نویس'}
            </button>
            <button onClick={() => router.push('/dashboard')}
              className="px-6 py-3 text-sm font-medium transition-colors"
              style={{ border: '1px solid rgba(22,45,82,0.8)', color: 'rgba(246,248,250,0.6)' }}>
              انصراف
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
