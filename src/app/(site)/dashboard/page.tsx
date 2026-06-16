'use client'

import { CheckCircle2, FileText, HelpCircle, Inbox } from 'lucide-react'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
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
  others: 'سایر',
}

export default function DashboardPage() {
  const { user, isStaff, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) router.replace('/auth')
  }, [user, loading, router])

  // Client view — tracks own questions
  if (!loading && user && !isStaff) {
    return <ClientDashboard user={user} />
  }

  // Staff view — answer Q&As and write posts
  if (!loading && user && isStaff) {
    return <StaffDashboard user={user} />
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-navy border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

/* ── Client Dashboard ──────────────────────────────────── */
function ClientDashboard({ user }: { user: any }) {
  const [questions, setQuestions] = useState<any[]>([])
  const [loading, setLoading]     = useState(true)
  const [expanded, setExpanded]   = useState<string | null>(null)

  const fetchQuestions = () => {
    fetch('/api/dashboard/my-questions')
      .then(r => r.json())
      .then(data => { setQuestions(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    fetchQuestions()
    // Refresh when a new question is submitted (from AskQuestionForm on /qa page)
    window.addEventListener('question-submitted', fetchQuestions)
    return () => window.removeEventListener('question-submitted', fetchQuestions)
  }, [])

  const pending  = questions.filter(q => q.status === 'pending')
  const answered = questions.filter(q => q.status === 'answered')

  return (
    <div className="min-h-screen bg-navy pt-20">
      {/* Header */}
      <div className="bg-navy">
        <div className="container-site py-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-ivory">داشبورد من</h1>
            <p className="text-ivory/50 text-sm mt-1">خوش آمدید، {user.name}</p>
          </div>
          <Link href="/qa" className="btn-gold text-sm px-4 py-2">+ سوال جدید</Link>
        </div>
      </div>

      <div className="container-site py-10">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { v: questions.length, l: 'کل سوالات',    color: 'text-navy' },
            { v: pending.length,   l: 'در انتظار',     color: 'text-amber-600' },
            { v: answered.length,  l: 'پاسخ داده شده', color: 'text-emerald-600' },
          ].map((s, i) => (
            <div key={i} className="card bg-white text-center">
              <div className={`text-3xl font-bold mb-1 ${s.color}`}>{s.v}</div>
              <div className="text-xs text-silver">{s.l}</div>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16 text-silver">در حال بارگذاری...</div>
        ) : questions.length === 0 ? (
          <div className="card bg-white text-center py-16">
            <p className="text-4xl mb-4"></p>
            <h3 className="font-bold text-ink mb-2">هنوز سوالی نپرسیده‌اید</h3>
            <p className="text-silver text-sm mb-6">سوال حقوقی خود را از وکیل متخصص ما بپرسید</p>
            <Link href="/qa" className="btn-primary">پرسیدن سوال</Link>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="font-bold text-ink text-lg mb-4">سوالات شما</h2>
            {questions.map(q => (
              <div key={q.id} className="card bg-white">
                <button onClick={() => setExpanded(expanded === q.id ? null : q.id)}
                  className="w-full text-right flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={q.status === 'answered' ? 'badge-answered' : q.status === 'rejected' ? 'badge-rejected' : 'badge-pending'}>
                        {q.status === 'answered' ? 'پاسخ داده شده' : q.status === 'rejected' ? 'رد شده' : 'در انتظار پاسخ'}
                      </span>
                      {q.category && <span className="tag text-xs text-ink">{categoryLabels[q.category]}</span>}
                    </div>
                    <h3 className="font-semibold text-ink text-sm">{q.title}</h3>
                    <p className="text-xs text-silver mt-1">{new Date(q.createdAt).toLocaleDateString('fa-IR')}</p>
                  </div>
                  <span className={`text-silver transition-transform ${expanded === q.id ? 'rotate-180' : ''}`}>▾</span>
                </button>

                {expanded === q.id && (
                  <div className="mt-4 pt-4 border-t border-bone animate-fade-in space-y-4">
                    <div>
                      <p className="text-xs text-silver mb-1">متن سوال</p>
                      <p className="text-sm text-ink leading-relaxed">{q.body}</p>
                    </div>
                    {q.status === 'answered' && q.answer && (
                      <div className="bg-navy/5 border border-navy/10 p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="w-7 h-7 bg-navy text-ivory text-xs font-bold flex items-center justify-center">
                            {q.answeredBy?.name?.charAt(0) || 'و'}
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-navy">{q.answeredBy?.name || 'وکیل متخصص'}</p>
                            {q.answeredAt && <p className="text-xs text-silver">{new Date(q.answeredAt).toLocaleDateString('fa-IR')}</p>}
                          </div>
                        </div>
                        <p className="text-sm text-ink leading-relaxed">{q.answer}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Staff Dashboard ───────────────────────────────────── */
function StaffDashboard({ user }: { user: any }) {
  const [tab, setTab]             = useState<'questions' | 'posts' | 'new-post'>('questions')
  const [questions, setQuestions] = useState<any[]>([])
  const [posts, setPosts]         = useState<any[]>([])
  const [answeringId, setAnsweringId] = useState<string | null>(null)
  const [answerText, setAnswerText]   = useState('')
  const [savingAnswer, setSavingAnswer] = useState(false)
  const [dataLoading, setDataLoading]   = useState(true)
  const [newPost, setNewPost] = useState({ title:'', excerpt:'', content:'', category:'', publishNow:true })
  const [postSaving, setPostSaving]   = useState(false)
  const [postSuccess, setPostSuccess] = useState(false)

  const fetchData = useCallback(async () => {
    setDataLoading(true)
    try {
      const [qRes, pRes] = await Promise.all([
        fetch('/api/dashboard/questions'),
        fetch('/api/dashboard/posts'),
      ])
      if (qRes.ok) setQuestions(await qRes.json())
      if (pRes.ok) setPosts(await pRes.json())
    } catch {}
    setDataLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  async function submitAnswer(id: string) {
    if (!answerText.trim()) return
    setSavingAnswer(true)
    const res = await fetch(`/api/dashboard/questions/${id}/answer`, {
      method:'PATCH', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ answer: answerText })})
    if (res.ok) { setAnsweringId(null); setAnswerText(''); fetchData() }
    setSavingAnswer(false)
  }

  async function submitPost() {
    if (!newPost.title || !newPost.content) return
    setPostSaving(true)
    const res = await fetch('/api/dashboard/posts', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify(newPost)})
    if (res.ok) {
      setPostSuccess(true)
      setNewPost({ title:'', excerpt:'', content:'', category:'', publishNow:true })
      fetchData()
      setTimeout(() => { setPostSuccess(false); setTab('posts') }, 2000)
    }
    setPostSaving(false)
  }

  const pending  = questions.filter(q => q.status === 'pending')
  const answered = questions.filter(q => q.status === 'answered')

  return (
    <div className="min-h-screen bg-navy pt-20">
      <div className="bg-navy">
        <div className="container-site py-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-ivory">داشبورد مدیریت</h1>
            <p className="text-ivory/50 text-sm mt-1">خوش آمدید، {user.name}</p>
          </div>
          <Link href="/admin" className="text-sm text-teal hover:text-teal/80 transition-colors">پنل Payload ←</Link>
        </div>
      </div>

      <div className="container-site py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { v: pending.length,  l: 'سوالات بی‌پاسخ',    c: 'text-amber-600' },
            { v: answered.length, l: 'پاسخ داده شده',     c: 'text-emerald-600' },
            { v: posts.filter(p => p._status==='published').length, l: 'مقالات منتشر', c: 'text-navy' },
            { v: posts.filter(p => p._status==='draft').length,     l: 'پیش‌نویس',     c: 'text-silver' },
          ].map((s, i) => (
            <div key={i} className="card bg-white">
              <div className={`text-3xl font-bold mb-1 ${s.c}`}>{s.v}</div>
              <div className="text-xs text-silver">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-bone mb-6">
          {([
            { id:'questions', label:`سوالات${pending.length>0?` (${pending.length} جدید)`:''}` },
            { id:'posts',     label:'مقالات' },
            { id:'new-post',  label:'+ مقاله جدید' },
          ] as const).map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${tab===t.id?'border-bone text-bone':'border-transparent text-silver hover:text-ink'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Questions */}
        {tab === 'questions' && (
          <div>
            {dataLoading ? <div className="text-center py-12 text-silver">در حال بارگذاری...</div> : (
              <>
                {pending.length > 0 && (
                  <div className="mb-8">
                    <h2 className="font-bold text-silver mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 bg-amber-500 rounded-full" />در انتظار پاسخ ({pending.length})
                    </h2>
                    <div className="space-y-4">
                      {pending.map(q => (
                        <div key={q.id} className="card bg-white">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="tag text-ink">{categoryLabels[q.category]||q.category}</span>
                              </div>
                              <h3 className="font-bold text-ink">{q.title}</h3>
                              <p className="text-sm text-silver mt-1">{q.body}</p>
                              {q.askedBy && <p className="text-xs text-silver mt-2">از: {q.askedBy.name||q.askedBy.email}</p>}
                            </div>
                            <span className="text-xs text-silver flex-shrink-0">{new Date(q.createdAt).toLocaleDateString('fa-IR')}</span>
                          </div>
                          {answeringId === q.id ? (
                            <div className="mt-3 pt-3 border-t border-bone space-y-3">
                              <textarea rows={4} className="textarea" placeholder="پاسخ خود را بنویسید..."
                                value={answerText} onChange={e => setAnswerText(e.target.value)} autoFocus />
                              <div className="flex gap-2">
                                <button onClick={() => submitAnswer(q.id)} disabled={savingAnswer||!answerText.trim()}
                                  className="btn-primary text-xs px-4 py-2 disabled:opacity-50">
                                  {savingAnswer ? 'در حال ذخیره...' : 'ثبت پاسخ'}
                                </button>
                                <button onClick={() => {setAnsweringId(null);setAnswerText('')}} className="btn-ghost text-xs">انصراف</button>
                              </div>
                            </div>
                          ) : (
                            <button onClick={() => {setAnsweringId(q.id);setAnswerText('')}}
                              className="btn-gold text-xs px-4 py-2 mt-2">پاسخ دادن</button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {answered.length > 0 && (
                  <div>
                    <h2 className="font-bold text-silver mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full" />پاسخ داده شده ({answered.length})
                    </h2>
                    <div className="space-y-3">
                      {answered.map(q => (
                        <div key={q.id} className="card bg-white opacity-70 flex items-center justify-between">
                          <div>
                            <span className="tag text-xs mb-1 inline-block text-ink">{categoryLabels[q.category]}</span>
                            <h3 className="font-medium text-ink text-sm">{q.title}</h3>
                          </div>
                          <span className="badge-answered">پاسخ داده شده</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {questions.length === 0 && (
                  <div className="card text-center py-16 text-silver bg-white">
                    <p className="text-3xl mb-3"></p><p>سوالی وجود ندارد.</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Posts list */}
        {tab === 'posts' && (
          <div>
            {dataLoading ? <div className="text-center py-12 text-silver">در حال بارگذاری...</div> :
              posts.length > 0 ? (
                <div className="space-y-3">
                  {posts.map(p => (
                    <div key={p.id} className="card bg-white flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={p._status==='published'?'badge-answered':'badge-pending'}>
                            {p._status==='published'?'منتشر شده':'پیش‌نویس'}
                          </span>
                          {p.category && <span className="tag text-xs">{categoryLabels[p.category]}</span>}
                        </div>
                        <h3 className="font-medium text-ink truncate">{p.title}</h3>
                      </div>
                      <Link href={`/admin/collections/posts/${p.id}`} className="text-xs text-silver hover:text-navy transition-colors flex-shrink-0">ویرایش ←</Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card text-center py-16 text-silver bg-white">
                  <p className="text-3xl mb-3"></p><p>مقاله‌ای نوشته نشده.</p>
                </div>
              )
            }
          </div>
        )}

        {/* New post */}
        {tab === 'new-post' && (
          <div className="max-w-3xl w-full">
            <h2 className="font-bold text-ivory text-lg mb-6">نوشتن مقاله جدید</h2>
            {postSuccess ? (
              <div className="text-center py-16 animate-scale-in"
                style={{ border: '1px solid rgba(34,197,94,0.3)', background: 'rgba(34,197,94,0.05)' }}>
                <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)' }}>
                  <span className="text-3xl">✅</span>
                </div>
                <p className="font-bold text-emerald-400 text-lg mb-2">مقاله با موفقیت ثبت شد!</p>
                <p className="text-sm text-silver">در حال انتقال به لیست مقالات...</p>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Title */}
                <div>
                  <label className="text-xs text-ivory/50 block mb-1.5">عنوان مقاله *</label>
                  <input
                    className="w-full px-4 py-3 text-base font-semibold text-ivory focus:outline-none"
                    style={{ background: 'rgba(22,45,82,0.5)', border: '1px solid rgba(36,61,106,0.8)' }}
                    placeholder="عنوان مقاله را بنویسید"
                    value={newPost.title}
                    onChange={e => setNewPost(p => ({...p, title: e.target.value}))}
                  />
                </div>

                {/* Meta row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-ivory/50 block mb-1.5">دسته‌بندی</label>
                    <select
                      className="w-full px-3 py-2.5 text-sm text-ivory appearance-none cursor-pointer focus:outline-none"
                      style={{ background: 'rgba(22,45,82,0.5)', border: '1px solid rgba(36,61,106,0.8)' }}
                      value={newPost.category}
                      onChange={e => setNewPost(p => ({...p, category: e.target.value}))}>
                      <option value="">انتخاب کنید</option>
                      {Object.entries(categoryLabels).map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-ivory/50 block mb-1.5">زمان مطالعه (دقیقه)</label>
                    <input type="number" min="1" max="60"
                      className="w-full px-3 py-2.5 text-sm text-ivory focus:outline-none"
                      style={{ background: 'rgba(22,45,82,0.5)', border: '1px solid rgba(36,61,106,0.8)' }}
                      placeholder="۵"
                      value={(newPost as any).readingTime || ''}
                      onChange={e => setNewPost(p => ({...p, readingTime: e.target.value} as any))}
                    />
                  </div>
                </div>

                {/* Cover image upload */}
                <div>
                  <label className="text-xs text-ivory/50 block mb-1.5">تصویر شاخص</label>
                  <CoverImageUpload
                    value={(newPost as any).coverImageBase64}
                    onChange={(v: string) => setNewPost(p => ({...p, coverImageBase64: v} as any))}
                  />
                </div>

                {/* Excerpt */}
                <div>
                  <label className="text-xs text-ivory/50 block mb-1.5">خلاصه مقاله</label>
                  <textarea rows={2}
                    className="w-full px-3 py-2.5 text-sm text-ivory focus:outline-none resize-none"
                    style={{ background: 'rgba(22,45,82,0.5)', border: '1px solid rgba(36,61,106,0.8)' }}
                    placeholder="یک یا دو جمله خلاصه..."
                    value={newPost.excerpt}
                    onChange={e => setNewPost(p => ({...p, excerpt: e.target.value}))}
                  />
                </div>

                {/* Rich text editor */}
                <div>
                  <label className="text-xs text-ivory/50 block mb-1.5">محتوای مقاله *</label>
                  <RichEditor
                    value={newPost.content}
                    onChange={v => setNewPost(p => ({...p, content: v}))}
                    placeholder="محتوای مقاله را اینجا بنویسید..."
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="text-xs text-ivory/50 block mb-1.5">برچسب‌ها (با کاما جدا کنید)</label>
                  <input
                    className="w-full px-3 py-2.5 text-sm text-ivory focus:outline-none"
                    style={{ background: 'rgba(22,45,82,0.5)', border: '1px solid rgba(36,61,106,0.8)' }}
                    placeholder="مثال: طلاق، حضانت، مهریه"
                    value={(newPost as any).tags || ''}
                    onChange={e => setNewPost(p => ({...p, tags: e.target.value} as any))}
                  />
                </div>

                {/* Publish toggle */}
                <div className="flex items-center justify-between p-4"
                  style={{ background: 'rgba(22,45,82,0.3)', border: '1px solid rgba(36,61,106,0.6)' }}>
                  <div>
                    <p className="text-sm font-medium text-ivory">وضعیت انتشار</p>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(246,248,250,0.4)' }}>
                      {newPost.publishNow ? 'بلافاصله منتشر می‌شود' : 'به عنوان پیش‌نویس ذخیره می‌شود'}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer"
                      checked={newPost.publishNow}
                      onChange={e => setNewPost(p => ({...p, publishNow: e.target.checked}))} />
                    <div className="w-12 h-6 rounded-full transition-colors"
                      style={{ background: newPost.publishNow ? '#4cb4c9' : 'rgba(36,61,106,0.8)' }} />
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"
                      style={{ transform: newPost.publishNow ? 'translateX(-24px)' : 'none' }} />
                  </label>
                </div>

                <div className="flex gap-3">
                  <button onClick={submitPost}
                    disabled={postSaving || !newPost.title || !newPost.content}
                    className="flex-1 py-3 text-sm font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    style={{ background: '#4cb4c9', color: '#070f1e' }}>
                    {postSaving
                      ? <><span className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />در حال ذخیره...</>
                      : newPost.publishNow ? 'انتشار مقاله' : 'ذخیره پیش‌نویس'}
                  </button>
                  <button onClick={() => setTab('posts')}
                    className="px-6 py-3 text-sm font-medium transition-colors"
                    style={{ border: '1px solid rgba(22,45,82,0.8)', color: 'rgba(246,248,250,0.6)' }}>
                    انصراف
                  </button>
                </div>
              </div>
            )}
          </div>
        )}   </div>
    </div>
  )
}
