'use client'

import { AlertCircle, Phone, Mail, ShieldCheck, Timer } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'

type AuthMode = 'phone' | 'email'
type PhoneStep = 'enter-phone' | 'enter-code' | 'complete-profile'

export default function AuthPage() {
  const [mode, setMode]     = useState<AuthMode>('phone')
  const [tab, setTab]       = useState<'login' | 'register'>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')
  const { login, register, sendOtp, verifyOtp, user, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && user && phoneStep !== 'complete-profile') router.replace('/dashboard')
  }, [user, authLoading, router])

  // ── Email/password forms ────────────────────────────────────────────
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

  // ── Phone / OTP ────────────────────────────────────────────────────
  const [phoneStep, setPhoneStep]   = useState<PhoneStep>('enter-phone')
  const [phone, setPhone]           = useState('')
  const [otpCode, setOtpCode]       = useState(['', '', '', '', '', ''])
  const [countdown, setCountdown]   = useState(0)
  const [firstName, setFirstName]   = useState('')
  const [lastName, setLastName]     = useState('')
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function startCountdown(secs: number) {
    setCountdown(secs)
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(timerRef.current!); return 0 }
        return prev - 1
      })
    }, 1000)
  }
  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current) }, [])

  async function handleSendOtp() {
    setError('')
    if (!phone) { setError('شماره موبایل را وارد کنید'); return }
    setLoading(true)
    const r = await sendOtp(phone)
    setLoading(false)
    if (r.success) {
      setPhoneStep('enter-code')
      startCountdown(r.expiresInSeconds || 120)
      setTimeout(() => otpRefs.current[0]?.focus(), 100)
    } else {
      setError(r.error || 'خطا در ارسال پیامک')
    }
  }

  async function handleVerifyOtp() {
    setError('')
    const code = otpCode.join('')
    if (code.length < 6) { setError('کد ۶ رقمی را کامل وارد کنید'); return }
    setLoading(true)
    const r = await verifyOtp(phone, code)
    setLoading(false)
    if (r.success) {
      if (r.isNewUser) setPhoneStep('complete-profile')
      else router.push('/dashboard')
    } else {
      setError(r.error || 'کد اشتباه است')
    }
  }

  async function handleCompleteProfile() {
    setError('')
    if (!firstName.trim() || !lastName.trim()) { setError('نام و نام خانوادگی را وارد کنید'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/update-profile', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ firstName: firstName.trim(), lastName: lastName.trim() }),
      })
      const data = await res.json()
      if (res.ok) router.push('/dashboard')
      else setError(data.error || 'خطا در ذخیره اطلاعات')
    } catch {
      setError('خطا در ارتباط با سرور')
    }
    setLoading(false)
  }

  function handleOtpKey(idx: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !otpCode[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus()
    }
  }

  function handleOtpChange(idx: number, val: string) {
    // Allow pasting all 6 digits at once
    if (val.length === 6 && /^\d{6}$/.test(val)) {
      setOtpCode(val.split(''))
      otpRefs.current[5]?.focus()
      return
    }
    const digit = val.replace(/\D/g, '').slice(-1)
    const next  = [...otpCode]
    next[idx]   = digit
    setOtpCode(next)
    if (digit && idx < 5) otpRefs.current[idx + 1]?.focus()
  }

  function resetPhoneStep() {
    setPhoneStep('enter-phone')
    setOtpCode(['', '', '', '', '', ''])
    setFirstName('')
    setLastName('')
    setError('')
    if (timerRef.current) clearInterval(timerRef.current)
    setCountdown(0)
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

          {/* Mode switcher */}
          <div className="flex gap-2 mb-6 bg-bone p-1 rounded">
            <button
              onClick={() => { setMode('phone'); setError(''); resetPhoneStep() }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded transition-all ${
                mode === 'phone' ? 'bg-navy text-ivory shadow' : 'text-silver hover:text-ink'
              }`}>
              <Phone size={14} /> ورود با موبایل
            </button>
            <button
              onClick={() => { setMode('email'); setError('') }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded transition-all ${
                mode === 'email' ? 'bg-navy text-ivory shadow' : 'text-silver hover:text-ink'
              }`}>
              <Mail size={14} /> ورود با ایمیل
            </button>
          </div>

          {/* ── PHONE MODE ────────────────────────────────────── */}
          {mode === 'phone' && (
            <div className="animate-fade-in">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-navy mb-1">
                  {phoneStep === 'enter-phone' ? 'ورود / ثبت‌نام' : phoneStep === 'enter-code' ? 'کد تأیید' : 'تکمیل پروفایل'}
                </h2>
                <p className="text-silver text-sm">
                  {phoneStep === 'enter-phone'
                    ? 'شماره موبایل خود را وارد کنید'
                    : phoneStep === 'enter-code'
                    ? `کد ۶ رقمی ارسال‌شده به ${phone} را وارد کنید`
                    : 'برای تکمیل ثبت‌نام نام خود را وارد کنید'}
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 mb-5 flex items-center gap-2 rounded">
                  <AlertCircle size={15} />{error}
                </div>
              )}

              {phoneStep === 'enter-phone' ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-graphite block mb-1.5">شماره موبایل</label>
                    <input
                      type="tel" dir="ltr" className="input text-center tracking-widest"
                      placeholder="09121234567"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSendOtp()}
                    />
                  </div>
                  <p className="text-xs text-silver">
                    اگر قبلاً ثبت‌نام نکرده‌اید، حساب جدید ساخته می‌شود.
                  </p>
                  <button onClick={handleSendOtp} disabled={loading}
                    className="w-full btn-primary justify-center py-3 text-base disabled:opacity-50">
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-ivory/30 border-t-ivory rounded-full animate-spin" />
                        در حال ارسال...
                      </span>
                    ) : 'ارسال کد تأیید'}
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* 6-box OTP input */}
                  <div>
                    <label className="text-xs font-medium text-graphite block mb-3 text-center">کد تأیید</label>
                    <div className="flex gap-2 justify-center" dir="ltr">
                      {otpCode.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={el => { otpRefs.current[idx] = el }}
                          type="text" inputMode="numeric" maxLength={6}
                          value={digit}
                          onChange={e => handleOtpChange(idx, e.target.value)}
                          onKeyDown={e => handleOtpKey(idx, e)}
                          className="w-11 h-12 text-center text-lg font-bold border border-silver/40 bg-white focus:border-teal focus:ring-1 focus:ring-teal outline-none rounded transition-all"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Countdown / resend */}
                  <div className="text-center">
                    {countdown > 0 ? (
                      <span className="text-sm text-silver flex items-center justify-center gap-1.5">
                        <Timer size={14} />
                        ارسال مجدد تا {countdown} ثانیه دیگر
                      </span>
                    ) : (
                      <button onClick={handleSendOtp} disabled={loading}
                        className="text-sm text-teal hover:underline">
                        ارسال مجدد کد
                      </button>
                    )}
                  </div>

                  <button onClick={handleVerifyOtp} disabled={loading}
                    className="w-full btn-primary justify-center py-3 text-base disabled:opacity-50">
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-ivory/30 border-t-ivory rounded-full animate-spin" />
                        در حال بررسی...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <ShieldCheck size={16} /> تأیید و ورود
                      </span>
                    )}
                  </button>

                  <button onClick={resetPhoneStep} className="w-full text-sm text-silver hover:text-navy py-1">
                    ← تغییر شماره
                  </button>
                </div>
              )}

              {phoneStep === 'complete-profile' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-teal/10 border border-teal/30 rounded px-4 py-3 text-sm text-navy mb-2">
                    ثبت‌نام شما موفق بود! لطفاً نام خود را وارد کنید.
                  </div>
                  <div>
                    <label className="text-xs font-medium text-graphite block mb-1.5">نام</label>
                    <input
                      className="input" placeholder="مثال: علی"
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-graphite block mb-1.5">نام خانوادگی</label>
                    <input
                      className="input" placeholder="مثال: احمدی"
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleCompleteProfile()}
                    />
                  </div>
                  <button onClick={handleCompleteProfile} disabled={loading}
                    className="w-full btn-primary justify-center py-3 text-base disabled:opacity-50">
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-ivory/30 border-t-ivory rounded-full animate-spin" />
                        در حال ذخیره...
                      </span>
                    ) : 'ورود به داشبورد'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── EMAIL MODE ────────────────────────────────────── */}
          {mode === 'email' && (
            <div className="animate-fade-in">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-navy mb-1">
                  {tab === 'login' ? 'خوش آمدید' : 'ایجاد حساب'}
                </h2>
                <p className="text-silver text-sm">
                  {tab === 'login' ? 'برای ادامه وارد شوید' : 'حساب رایگان بسازید'}
                </p>
              </div>

              {/* Email/Password tabs */}
              <div className="flex bg-bone mb-6">
                {(['login','register'] as const).map(t => (
                  <button key={t} onClick={() => { setTab(t); setError('') }}
                    className={`z-10 flex-1 py-2.5 text-sm font-medium transition-all duration-200 ${
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
                <div className="space-y-4">
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
                <div className="space-y-4">
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
