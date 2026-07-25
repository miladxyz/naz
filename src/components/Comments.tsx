'use client'

import { useEffect, useState } from 'react'
import { MessageCircle, Send, CheckCircle2, Loader2, CornerDownLeft } from 'lucide-react'

interface Comment {
  id: string
  authorName: string
  body: string
  createdAt: string
}

interface Props {
  postId: string
}

function CommentSkeleton() {
  return (
    <div className="flex gap-4 animate-pulse">
      <div className="w-9 h-9 flex-shrink-0 bg-bone/60 rounded-sm" />
      <div className="flex-1 space-y-2 py-1">
        <div className="flex justify-between">
          <div className="h-3 w-24 bg-bone/60 rounded-sm" />
          <div className="h-3 w-16 bg-bone/60 rounded-sm" />
        </div>
        <div className="h-4 w-full bg-bone/60 rounded-sm" />
        <div className="h-4 w-3/4 bg-bone/60 rounded-sm" />
      </div>
    </div>
  )
}

function emptyForm() {
  return { authorName: '', authorPhone: '', body: '' }
}

export default function Comments({ postId }: Props) {
  const [comments, setComments] = useState<Comment[]>([])
  const [replies, setReplies]   = useState<Record<string, Comment[]>>({})
  const [loading, setLoading]   = useState(true)
  const [form, setForm]         = useState(emptyForm())
  const [status, setStatus]     = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [replyingTo, setReplyingTo] = useState<{ id: string; name: string } | null>(null)
  const [replyForm, setReplyForm]   = useState(emptyForm())
  const [replyStatus, setReplyStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  async function load() {
    setLoading(true)
    const res  = await fetch(`/api/comments?postId=${postId}`)
    const data = await res.json()
    setComments(data.docs ?? [])
    // Group replies by parentComment id
    const grouped: Record<string, Comment[]> = {}
    for (const r of (data.replies ?? [])) {
      const parentId = typeof r.parentComment === 'string' ? r.parentComment : r.parentComment?.id
      if (parentId) {
        grouped[parentId] = [...(grouped[parentId] ?? []), r]
      }
    }
    setReplies(grouped)
    setLoading(false)
  }

  useEffect(() => { load() }, [postId])

  function setF(field: string, value: string) {
    setForm(p => ({ ...p, [field]: value }))
  }
  function setR(field: string, value: string) {
    setReplyForm(p => ({ ...p, [field]: value }))
  }

  async function handleSubmit() {
    if (!form.authorName.trim() || !form.authorPhone.trim() || !form.body.trim()) return
    setStatus('sending')
    try {
      const res = await fetch('/api/comments', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ postId, ...form }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
      setForm(emptyForm())
    } catch {
      setStatus('error')
    }
  }

  async function handleReply() {
    if (!replyingTo || !replyForm.authorName.trim() || !replyForm.authorPhone.trim() || !replyForm.body.trim()) return
    setReplyStatus('sending')
    try {
      const res = await fetch('/api/comments', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ postId, ...replyForm, parentCommentId: replyingTo.id }),
      })
      if (!res.ok) throw new Error()
      setReplyStatus('success')
      setReplyForm(emptyForm())
      setTimeout(() => {
        setReplyingTo(null)
        setReplyStatus('idle')
      }, 2500)
    } catch {
      setReplyStatus('error')
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
        <div className="space-y-5 mb-10">
          <CommentSkeleton />
          <CommentSkeleton />
          <CommentSkeleton />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-silver text-sm mb-8">هنوز نظری ثبت نشده. اولین نفر باشید!</p>
      ) : (
        <div className="space-y-4 mb-10">
          {comments.map((c) => (
            <div key={c.id}>
              {/* Main comment */}
              <div className="card bg-navy border-bone/30 flex gap-4">
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
                  <button
                    onClick={() => {
                      setReplyingTo(replyingTo?.id === c.id ? null : { id: c.id, name: c.authorName })
                      setReplyForm(emptyForm())
                      setReplyStatus('idle')
                    }}
                    className="mt-3 flex items-center gap-1.5 text-xs text-teal/70 hover:text-teal transition-colors"
                  >
                    <CornerDownLeft size={12} />
                    پاسخ
                  </button>
                </div>
              </div>

              {/* Replies */}
              {(replies[c.id] ?? []).length > 0 && (
                <div className="mr-8 mt-2 space-y-2 border-r-2 border-teal/20 pr-4">
                  {replies[c.id].map((r) => (
                    <div key={r.id} className="card bg-navy/60 border-bone/20 flex gap-3">
                      <div className="w-7 h-7 flex-shrink-0 bg-teal/5 border border-teal/10 flex items-center justify-center text-xs font-bold text-teal/70">
                        {r.authorName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-medium text-bone/80 text-xs">{r.authorName}</span>
                          <span className="text-xs text-silver/60">
                            {new Date(r.createdAt).toLocaleDateString('fa-IR')}
                          </span>
                        </div>
                        <p className="text-xs text-silver/80 leading-relaxed whitespace-pre-line">{r.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Inline reply form */}
              {replyingTo?.id === c.id && (
                <div className="mr-8 mt-2 border-r-2 border-teal/30 pr-4">
                  <div className="card bg-navy/60 border-teal/20">
                    <p className="text-xs text-teal mb-3 flex items-center gap-1">
                      <CornerDownLeft size={11} /> پاسخ به {replyingTo.name}
                    </p>

                    {replyStatus === 'success' ? (
                      <div className="text-center py-3">
                        <CheckCircle2 className="mx-auto mb-2 text-teal" size={24} />
                        <p className="text-xs text-bone">پاسخ شما ثبت شد و بعد از تأیید نمایش داده می‌شود.</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-silver block mb-1">نام *</label>
                            <input className="input text-sm py-1.5" placeholder="نام شما"
                              value={replyForm.authorName} onChange={e => setR('authorName', e.target.value)} />
                          </div>
                          <div>
                            <label className="text-xs text-silver block mb-1">شماره تماس *</label>
                            <input type="tel" dir="ltr" className="input text-sm py-1.5" placeholder="09..."
                              value={replyForm.authorPhone} onChange={e => setR('authorPhone', e.target.value)} />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-silver block mb-1">پاسخ *</label>
                          <textarea rows={3} className="textarea text-sm"
                            placeholder="پاسخ خود را بنویسید..."
                            value={replyForm.body} onChange={e => setR('body', e.target.value)} />
                        </div>
                        {replyStatus === 'error' && (
                          <p className="text-red-500 text-xs">خطا در ارسال. دوباره تلاش کنید.</p>
                        )}
                        <div className="flex gap-2">
                          <button
                            onClick={handleReply}
                            disabled={replyStatus === 'sending' || !replyForm.authorName.trim() || !replyForm.authorPhone.trim() || !replyForm.body.trim()}
                            className="btn-primary text-xs py-1.5 px-4 disabled:opacity-50"
                          >
                            {replyStatus === 'sending'
                              ? <span className="flex items-center gap-1"><Loader2 size={12} className="animate-spin" /> ارسال...</span>
                              : <span className="flex items-center gap-1"><Send size={12} /> ارسال پاسخ</span>
                            }
                          </button>
                          <button onClick={() => setReplyingTo(null)}
                            className="text-xs text-silver hover:text-ink transition-colors px-2">
                            انصراف
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Main submit form */}
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
                  value={form.authorName} onChange={e => setF('authorName', e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-silver block mb-1.5">شماره تماس *</label>
                <input type="tel" dir="ltr" className="input" placeholder="09..."
                  value={form.authorPhone} onChange={e => setF('authorPhone', e.target.value)} />
              </div>
            </div>
            <div>
              <label className="text-xs text-silver block mb-1.5">نظر *</label>
              <textarea rows={4} className="textarea" placeholder="نظر خود را بنویسید..."
                value={form.body} onChange={e => setF('body', e.target.value)} />
            </div>
            {status === 'error' && (
              <p className="text-red-500 text-xs">خطا در ثبت نظر. لطفاً دوباره تلاش کنید.</p>
            )}
            <button
              onClick={handleSubmit}
              disabled={status === 'sending' || !form.authorName.trim() || !form.authorPhone.trim() || !form.body.trim()}
              className="btn-primary py-2.5 disabled:opacity-50"
            >
              {status === 'sending' ? (
                <span className="flex items-center gap-2"><Loader2 size={14} className="animate-spin" /> در حال ارسال...</span>
              ) : (
                <span className="flex items-center gap-2"><Send size={14} /> ارسال نظر</span>
              )}
            </button>
            <p className="text-xs text-silver/60">شماره تماس نمایش داده نمی‌شود. نظرات بعد از تأیید نمایش داده می‌شوند.</p>
          </div>
        )}
      </div>
    </div>
  )
}
