'use client'

import { AlertCircle } from 'lucide-react'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'

export default function AuthPage() {
  const [tab, setTab]         = useState<'login' | 'register'>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const { login, register, user, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && user) router.replace('/dashboard')
  }, [user, authLoading, router])

  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [regForm, setRegForm]     = useState({ name: '', email: '', password: '', confirm: '' })

  async function handleLogin() {
    setError('')
    if (!loginForm.email || !loginForm.password) { setError('همه فیلدها را پر کنید'); return }
    setLoading(true)
    const r = await login(loginForm.email, loginForm.password)
    setLoading(false)
    if (r.success) router.push('/dashboard')
    else setError(r.error || 'خطا در ورود')
  }

  async function handleRegister() {
    setError('')
    if (!regForm.name || !regForm.email || !regForm.password) { setError('همه فیلدها را پر کنید'); return }
    if (regForm.password !== regForm.confirm) { setError('رمز عبور و تکرار آن یکسان نیستند'); return }
    if (regForm.password.length < 8) { setError('رمز عبور باید حداقل ۸ کاراکتر باشد'); return }
    setLoading(true)
    const r = await register(regForm.name, regForm.email, regForm.password)
    setLoading(false)
    if (r.success) router.push('/dashboard')
    else setError(r.error || 'خطا در ثبت‌نام')
  }

  if (authLoading) return null

  return (
    <div className="min-h-screen flex">
      {/* Left panel — decorative */}
      <div className="hidden lg:flex lg:w-1/2 hero-gradient relative overflow-hidden pattern-grid flex-col justify-between p-12">
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-navy-light/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-teal/10 rounded-full blur-2xl" />
        <div className="relative z-10">
          <Link href="/" className="inline-block">
            <h1 className="text-2xl font-bold text-ivory">علیرضا نظری</h1>
            <p className="text-xs text-teal tracking-widest uppercase mt-1">تیم حقوقی</p>
          </Link>
        </div>
        <div className="relative z-10">
          <blockquote className="text-ivory/80 text-xl font-light leading-relaxed mb-6">
            «دفاع از حقوق شما، تعهد ماست»
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-10 h-0.5 bg-teal" />
            <span className="text-teal text-sm">تیم حقوقی علیرضا نظری</span>
          </div>
        </div>
        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[['۱۲+','سال تجربه'],['۲۵۰۰+','پرونده موفق'],['۹۸٪','رضایت']].map(([v,l],i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-bold text-ivory">{v}</div>
              <div className="text-xs text-ivory/40 mt-1">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-ivory">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/">
              <h1 className="text-2xl font-bold text-navy">علیرضا نظری</h1>
              <p className="text-xs text-teal tracking-widest uppercase mt-1">تیم حقوقی</p>
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-navy mb-1">
              {tab === 'login' ? 'خوش آمدید' : 'ایجاد حساب'}
            </h2>
            <p className="text-silver text-sm">
              {tab === 'login' ? 'برای ادامه وارد شوید' : 'حساب رایگان بسازید'}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex bg-bone mb-6">
            {(['login','register'] as const).map(t => (
              <button key={t} onClick={() => { setTab(t); setError('') }}
                className={`flex-1 py-2.5 text-sm font-medium transition-all duration-200 ${
                  tab === t ? 'bg-navy text-ivory shadow-md' : 'text-silver hover:text-ink'
                }`}>
                {t === 'login' ? 'ورود' : 'ثبت‌نام'}
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 mb-5 flex items-center gap-2">
              <AlertCircle size={15} />{error}
            </div>
          )}

          {tab === 'login' ? (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="text-xs font-medium text-graphite block mb-1.5">ایمیل</label>
                <input type="email" dir="ltr" className="input" placeholder="email@example.com"
                  value={loginForm.email} onChange={e => setLoginForm(p => ({...p, email:e.target.value}))}
                  onKeyDown={e => e.key==='Enter' && handleLogin()} />
              </div>
              <div>
                <label className="text-xs font-medium text-graphite block mb-1.5">رمز عبور</label>
                <input type="password" dir="ltr" className="input" placeholder="••••••••"
                  value={loginForm.password} onChange={e => setLoginForm(p => ({...p, password:e.target.value}))}
                  onKeyDown={e => e.key==='Enter' && handleLogin()} />
              </div>
              <button onClick={handleLogin} disabled={loading}
                className="w-full btn-primary justify-center py-3 text-base disabled:opacity-50 mt-2">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-ivory/30 border-t-ivory rounded-full animate-spin" />
                    در حال ورود...
                  </span>
                ) : 'ورود به حساب'}
              </button>
              <p className="text-xs text-silver text-center pt-2">
                حساب ندارید؟{' '}
                <button onClick={() => setTab('register')} className="text-navy font-medium hover:underline">
                  ثبت‌نام کنید
                </button>
              </p>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="text-xs font-medium text-graphite block mb-1.5">نام کامل</label>
                <input className="input" placeholder="نام و نام خانوادگی"
                  value={regForm.name} onChange={e => setRegForm(p => ({...p, name:e.target.value}))} />
              </div>
              <div>
                <label className="text-xs font-medium text-graphite block mb-1.5">ایمیل</label>
                <input type="email" dir="ltr" className="input" placeholder="email@example.com"
                  value={regForm.email} onChange={e => setRegForm(p => ({...p, email:e.target.value}))} />
              </div>
              <div>
                <label className="text-xs font-medium text-graphite block mb-1.5">رمز عبور</label>
                <input type="password" dir="ltr" className="input" placeholder="حداقل ۸ کاراکتر"
                  value={regForm.password} onChange={e => setRegForm(p => ({...p, password:e.target.value}))} />
              </div>
              <div>
                <label className="text-xs font-medium text-graphite block mb-1.5">تکرار رمز عبور</label>
                <input type="password" dir="ltr" className="input" placeholder="••••••••"
                  value={regForm.confirm} onChange={e => setRegForm(p => ({...p, confirm:e.target.value}))}
                  onKeyDown={e => e.key==='Enter' && handleRegister()} />
              </div>
              <button onClick={handleRegister} disabled={loading}
                className="w-full btn-primary justify-center py-3 text-base disabled:opacity-50 mt-2">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-ivory/30 border-t-ivory rounded-full animate-spin" />
                    در حال ثبت‌نام...
                  </span>
                ) : 'ایجاد حساب رایگان'}
              </button>
              <p className="text-xs text-silver text-center pt-2">
                با ثبت‌نام <Link href="/terms" className="text-navy hover:underline">شرایط استفاده</Link> را می‌پذیرید
              </p>
            </div>
          )}

          <p className="text-center text-xs text-silver mt-8">
            <Link href="/" className="hover:text-navy transition-colors">← بازگشت به سایت</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
