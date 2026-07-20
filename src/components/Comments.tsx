'use client'
// src/components/Comments.tsx

import { useEffect, useState } from 'react'
import { MessageCircle, Send, CheckCircle2, Loader2 } from 'lucide-react'
import { CommentSkeleton } from './Skeleton'

interface Comment {
  id: string
  authorName: string
  body: string
  createdAt: string
}

interface Props {
  postId: string
}

export default function Comments({ postId }: Props) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading]   = useState(true)
  const [form, setForm]         = useState({ authorName: '', authorEmail: '', body: '' })
  const [status, setStatus]     = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  useEffect(() => {
    fetch(`/api/comments?postId=${postId}`)
      .then(r => r.json())
      .then(d => setComments(d.docs ?? []))
      .finally(() => setLoading(false))
  }, [postId])

  function set(field: string, value: string) {
    setForm(p => ({ ...p, [field]: value }))
  }

  async function handleSubmit() {
    if (!form.authorName.trim() || !form.body.trim()) return
    setStatus('sending')
    try {
      const res = await fetch('/api/comments', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ postId, ...form }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
      setForm({ authorName: '', authorEmail: '', body: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="mt-12 pt-10 border-t border-bone">

      {/* Heading */}
      <div className="flex items-center gap-2 mb-8">
        <MessageCircle size={20} className="text-teal" />
        <h3 className="font-bold text-ink text-lg">
          نظرات
          {!loading && comments.length > 0 && (
            <span className="text-sm font-normal text-silver mr-2">({comments.length})</span>
          )}
        </h3>
      </div>

      {/* Comments list */}
      {loading ? (
        <div className="space-y-3 mb-10">
          <CommentSkeleton />
          <CommentSkeleton />
          <CommentSkeleton />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-silver text-sm mb-8">هنوز نظری ثبت نشده. اولین نفر باشید!</p>
      ) : (
        <div className="space-y-4 mb-10">
          {comments.map((c) => (
            <div key={c.id} className="card bg-navy border-bone/30 flex gap-4">
              <div className="w-9 h-9 flex-shrink-0 bg-teal/10 border border-teal/20 flex items-center justify-center text-sm font-bold text-teal">
                {c.authorName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-medium text-bone text-sm">{c.authorName}</span>
                  <span className="text-xs text-silver flex-shrink-0">
                    {new Date(c.createdAt).toLocaleDateString('fa-IR')}
                  </span>
                </div>
                <p className="text-sm text-silver leading-relaxed whitespace-pre-line">{c.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submit form */}
      <div className="card bg-navy">
        <h4 className="font-bold text-bone mb-5 text-sm">نظر خود را بنویسید</h4>

        {status === 'success' ? (
          <div className="text-center py-6">
            <CheckCircle2 className="mx-auto mb-3 text-teal" size={36} />
            <p className="font-medium text-bone mb-1">نظر شما ثبت شد</p>
            <p className="text-sm text-silver mb-4">بعد از بررسی توسط تیم ما نمایش داده می‌شود.</p>
            <button onClick={() => setStatus('idle')} className="text-xs text-teal hover:underline">
              ثبت نظر جدید
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-silver block mb-1.5">نام *</label>
                <input className="input" placeholder="نام شما"
                  value={form.authorName} onChange={e => set('authorName', e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-silver block mb-1.5">ایمیل (اختیاری)</label>
                <input type="email" dir="ltr" className="input" placeholder="email@example.com"
                  value={form.authorEmail} onChange={e => set('authorEmail', e.target.value)} />
              </div>
            </div>
            <div>
              <label className="text-xs text-silver block mb-1.5">نظر *</label>
              <textarea rows={4} className="textarea" placeholder="نظر خود را بنویسید..."
                value={form.body} onChange={e => set('body', e.target.value)} />
            </div>
            {status === 'error' && (
              <p className="text-red-500 text-xs">خطا در ثبت نظر. لطفاً دوباره تلاش کنید.</p>
            )}
            <button onClick={handleSubmit}
              disabled={status === 'sending' || !form.authorName.trim() || !form.body.trim()}
              className="btn-primary py-2.5 disabled:opacity-50">
              {status === 'sending' ? (
                <span className="flex items-center gap-2"><Loader2 size={14} className="animate-spin" /> در حال ارسال...</span>
              ) : (
                <span className="flex items-center gap-2"><Send size={14} /> ارسال نظر</span>
              )}
            </button>
            <p className="text-xs text-silver/60">نظرات بعد از تأیید نمایش داده می‌شوند.</p>
          </div>
        )}
      </div>
    </div>
  )
}