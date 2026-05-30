import Link from 'next/link'
import Image from 'next/image'
import { safeFind } from '@/lib/payload'
import {
  Scale, Briefcase, Users, Star, ArrowLeft,
  Gavel, HandCoins, Landmark, ScrollText, HeartHandshake,
  Wallet, Shield, ChevronLeft, MapPin, Phone, Mail,
  CheckCircle2, Award, Clock, HelpCircle
} from 'lucide-react'
import gpPhoto from '@/app/group.jpg'

async function getData() {
  const [team, instagram, experiences, posts] = await Promise.all([
    safeFind('team-members',    { limit: 6, sort: 'orderIndex' }),
    safeFind('instagram-posts', { limit: 6, sort: '-postedAt' }),
    safeFind('experiences',     { limit: 3, where: { isFeatured: { equals: true } } }),
    safeFind('posts',           { limit: 3, sort: '-publishedAt', where: { _status: { equals: 'published' } } }),
  ])
  return { team, instagram, experiences, posts }
}

const stats = [
  { value: '۱۳+',  label: 'سال تجربه',     icon: Clock },
  { value: '۲۵۰۰+',label: 'پرونده در سراسر کشور',   icon: Briefcase },
  { value: '۹',    label: 'حوزه تخصصی',    icon: Scale },
  { value: '۹۸٪',  label: 'رضایت موکلین',  icon: Star },
]

const practiceAreas = [
  { icon: Gavel,        label: 'کیفری',               desc: 'قتل، مواد مخدر، ضرب و جرح، سرقت، کلاه‌برداری',     href: '/qa?category=criminal' },
  { icon: Landmark,     label: 'حقوقی',               desc: 'مطالبه وجه، الزام به انجام تعهد، اختلافات قراردادی', href: '/qa?category=civil' },
  { icon: HandCoins,    label: 'داوری و حل اختلاف',   desc: 'میانجی‌گری، سازش و صلح خارج از دادگاه',             href: '/qa?category=arbitration' },
  { icon: ScrollText,   label: 'امور حسبی',           desc: 'اجازه فروش مال محجور، نصب و عزل قیم',               href: '/qa?category=probate' },
  { icon: HeartHandshake,label:'دعاوی ارث و ترکه',    desc: 'انحصار وراثت، تقسیم ترکه، مطالبه سهم الارث',        href: '/qa?category=inheritance' },
  { icon: Users,        label: 'حقوق کار',            desc: 'اخراج غیرقانونی، مطالبه مزایا، اختلافات کارگری',    href: '/qa?category=labor' },
  { icon: HeartHandshake,label:'حقوق خانواده',         desc: 'طلاق، حضانت، ارث، نفقه و مهریه',                    href: '/qa?category=family' },
  { icon: Wallet,       label: 'حقوق بانکی',          desc: 'اختلافات تسهیلات، دعاوی وام، رفع توقیف اموال',      href: '/qa?category=banking' },
  { icon: Shield,       label: 'حقوق بیمه',           desc: 'مطالبه خسارت، اختلافات بیمه‌گذار و بیمه‌گر',        href: '/qa?category=insurance' },
]

const categoryLabels: Record<string,string> = {
  criminal:'کیفری', civil:'حقوقی', arbitration:'داوری و حل اختلاف',
  probate:'امور حسبی', inheritance:'دعاوی ارث و ترکه', labor:'حقوق کار',
  family:'حقوق خانواده', banking:'حقوق بانکی', insurance:'حقوق بیمه',
}

const whyUs = [
  { icon: HelpCircle,        title: 'حل مشکل با مشاوره رایگان',       desc: 'شما  میتوانید صرفا با دریافت مشاوره حرفه ای رایگان کمک بگیرید' },
  { icon: HeartHandshake,        title: 'همراه با موکل',      desc: 'شما میتوانید بدون اعلام وکالت در مسیر حقوقی خود همراهی داشته باشید' },
  { icon: CheckCircle2, title: 'اعلام وکالت',     desc: ' شما  با اعلام وکالت از از اول تا انتهای مسیر در حل پرونده حقوقی وکیل متخصص همراه دارید' },
]

export default async function HomePage() {
  const { team, instagram, experiences, posts } = await getData()

  return (
    <>
      {/* ── Hero ────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center hero-gradient overflow-hidden pattern-grid">
        {/* Teal glow blobs */}
        <div className="absolute top-1/4 right-1/3 w-80 h-80 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(76,180,201,0.12) 0%, transparent 70%)' }} />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(76,180,201,0.08) 0%, transparent 70%)' }} />

        {/* Teal left accent line */}
        <div className="absolute right-0 top-0 bottom-0 w-0.5 opacity-60"
          style={{ background: 'linear-gradient(180deg, transparent, #4cb4c9, transparent)' }} />

        <div className="container-site relative z-10 pt-24 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

            {/* Left — text */}
            <div className="text-center lg:text-right">
              <div className="flex flex-wrap items-center gap-3 mb-8 animate-fade-in justify-center lg:justify-start">
                <div className="inline-flex items-center gap-2 border px-4 py-2"
                  style={{ background: 'rgba(76,180,201,0.1)', borderColor: 'rgba(76,180,201,0.25)' }}>
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#4cb4c9' }} />
                  <span className="text-xs font-medium tracking-widest uppercase" style={{ color: '#4cb4c9' }}>
                    علیرضا نظری — وکیل پایه یک دادگستری
                  </span>
                </div>
                {/* Bar association rank badge */}
                <div className="inline-flex items-center gap-2 border px-3 py-2"
                  style={{ background: 'rgba(201,168,76,0.1)', borderColor: 'rgba(201,168,76,0.3)' }}>
                  <Award size={13} style={{ color: '#c9a84c' }} />
                  <span className="text-xs font-semibold" style={{ color: '#c9a84c' }}>
                    رتبه ۵۶ کانون وکلای فارس و کهگیلویه و بویراحمد
                  </span>
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-ivory leading-tight mb-4 animate-fade-in-up delay-100">
                همراه مطمئن شما
                <br />
                <span className="text-transparent bg-clip-text"
                  style={{ backgroundImage: 'linear-gradient(90deg, #4cb4c9, #a8dde8, #4cb4c9)' }}>
                  در مسیر عدالت
                </span>
              </h1>

              {/* Clickable highlight card — links to the free consultation blog post */}
              <Link href="/blog/divorce-guide"
                className="inline-flex items-center gap-3 mb-6 px-4 py-3 border transition-all duration-300 hover:border-teal/50 animate-fade-in-up delay-150 group"
                style={{ borderColor: 'rgba(201,168,76,0.3)', background: 'rgba(201,168,76,0.07)' }}>
                <span className="text-sm font-semibold" style={{ color: '#c9a84c' }}>
                  چرا حق‌الوکاله پس از اتمام پرونده؟
                </span>
                <ArrowLeft size={15} style={{ color: '#c9a84c' }} className="group-hover:-translate-x-1 transition-transform" />
              </Link>

              <p className="text-ivory/65 text-lg leading-relaxed mb-10 max-w-lg animate-fade-in-up delay-200">
                از مشاوره اولیه تا پیگیری نهایی پرونده، همراه شما هستیم تا تصمیمات حقوقی مطمئن‌تری بگیرید.
              </p>

              <div className="flex flex-wrap gap-3 mb-14 animate-fade-in-up delay-300">
                <Link href="/qa"
                  className="inline-flex items-center gap-2 text-base px-7 py-3.5 font-semibold transition-all duration-300 hover:brightness-110 active:scale-95"
                  style={{ background: '#c9a84c', color: '#070f1e', boxShadow: '0 4px 20px rgba(201,168,76,0.4)' }}>
                  <Scale size={17} />
                  پرسش از وکیل
                </Link>
                <Link href="/about"
                  className="inline-flex items-center gap-2 border border-ivory/25 text-ivory px-7 py-3.5 text-base font-medium hover:bg-ivory/10 transition-all duration-300">
                  آشنایی با تیم
                  <ArrowLeft size={16} />
                </Link>
                <Link href="tel:09120310806"
                  className="inline-flex items-center gap-2 border px-7 py-3.5 text-base font-medium transition-all duration-300 hover:bg-teal/10"
                  style={{ borderColor: 'rgba(76,180,201,0.4)', color: '#4cb4c9' }}>
                  <Phone size={16} />
                  مشاوره رایگان
                </Link>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-white/10 animate-fade-in-up delay-400">
                {stats.map((s, i) => {
                  const Icon = s.icon
                  return (
                    <div key={i} className="text-center">
                      <Icon size={18} className="mx-auto mb-2 opacity-50" style={{ color: '#4cb4c9' }} />
                      <div className="text-2xl md:text-3xl font-bold text-ivory">{s.value}</div>
                      <div className="text-xs text-ivory/40 mt-0.5 leading-tight">{s.label}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Right — team photo: centered strip on mobile, full panel on desktop */}
            <div className="flex justify-center animate-fade-in delay-300">
              <div className="relative w-full max-w-[340px] sm:max-w-[420px] mx-auto">
                {/* Outer teal glow ring */}
                <div className="absolute -inset-3 rounded-none opacity-30 blur-xl"
                  style={{ background: 'radial-gradient(ellipse, rgba(76,180,201,0.4) 0%, transparent 70%)' }} />

                {/* Image frame */}
                <div className="relative w-full h-[280px] sm:h-[380px] lg:h-[500px] overflow-hidden teal-ring"
                  style={{ border: '1px solid rgba(76,180,201,0.25)' }}>
                  <Image
                    src={gpPhoto}
                    alt="تیم حقوقی علیرضا نظری"
                    fill
                    className="object-cover object-top"
                    priority
                  />
                  {/* Dark gradient overlay at bottom */}
                  <div className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(7,15,30,0.7) 0%, transparent 50%)' }} />

                  {/* Floating badge */}
                  <div className="absolute bottom-6 right-6 left-6">
                    <div className="flex items-center gap-3 px-4 py-3"
                      style={{ background: 'rgba(13,31,60,0.9)', border: '1px solid rgba(76,180,201,0.3)', backdropFilter: 'blur(10px)' }}>
                      <div className="w-9 h-9 flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(76,180,201,0.2)', border: '1px solid rgba(76,180,201,0.4)' }}>
                        <Scale size={18} style={{ color: '#4cb4c9' }} />
                      </div>
                      <div>
                        <p className="text-ivory text-sm font-semibold">تیم حقوقی علیرضا نظری</p>
                        <p className="text-xs" style={{ color: '#4cb4c9' }}>شیراز، معالی‌آباد</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating teal stat card — top left, hidden on mobile */}
                <div className="hidden sm:block absolute -top-4 -right-6 px-4 py-3 animate-float"
                  style={{ background: '#4cb4c9', boxShadow: '0 8px 24px rgba(76,180,201,0.4)' }}>
                  <div className="text-white text-center">
                    <div className="text-2xl font-bold">۹۸٪</div>
                    <div className="text-xs opacity-80">رضایت موکلین</div>
                  </div>
                </div>

                {/* Floating dark stat card — bottom left, hidden on mobile */}
                <div className="hidden sm:block absolute -bottom-4 -left-6 px-4 py-3 animate-float"
                  style={{ animationDelay:'2s', background: 'rgba(13,31,60,0.95)', border: '1px solid rgba(76,180,201,0.3)', boxShadow: '0 8px 24px rgba(13,31,60,0.5)' }}>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-ivory">۲۵۰۰+</div>
                    <div className="text-xs" style={{ color: '#4cb4c9' }}>پرونده موفق</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ── Why Us ──────────────────────────────────────── */}
      <section className="bg-[#0d1f3c]">
        <div className="relative top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(90deg, transparent, #4cb4c9, transparent)' }} />

        <div className="container-site py-14">
          <div className="grid md:grid-cols-3 gap-8">
            {whyUs.map((w, i) => {
              const Icon = w.icon
              return (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-12 h-12 flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(76,180,201,0.1)', border: '1px solid rgba(76,180,201,0.25)' }}>
                    <Icon size={22} style={{ color: '#4cb4c9' }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">{w.title}</h3>
                    <p className="text-sm text-silver leading-relaxed">{w.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
                <div className="relative top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(90deg, transparent, #4cb4c9, transparent)' }} />

      </section>

      {/* ── Practice Areas ──────────────────────────────── */}
      <section className="section-py bg-[#0d1f3c]">
        <div className="container-site">
          <div className="text-center mb-12">
            <span className="gold-line mx-auto" />
            <h2 className="section-heading text-[#c9a84c]">حوزه‌های تخصصی</h2>
            <p className="section-subheading text-white">خدمات حقوقی جامع در نه حوزه تخصصی</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {practiceAreas.map((a, i) => {
              const Icon = a.icon
              return (
                <Link href={a.href} key={i}
                  className="group flex items-start gap-4 p-5 bg-navy border border-silver hover:border-teal/40 hover:shadow-teal-glow transition-all duration-300 hover:-translate-y-0.5">
                  <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-300 group-hover:bg-teal/15"
                    style={{ background: 'rgba(76,180,201,0.08)', border: '1px solid rgba(76,180,201,0.15)' }}>
                    <Icon size={18} style={{ color: '#4cb4c9' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white mb-1 group-hover:text-navy transition-colors">{a.label}</h3>
                    <p className="text-xs text-silver leading-relaxed line-clamp-2">{a.desc}</p>
                  </div>
                  <ChevronLeft size={16} className="text-bone group-hover:text-teal mt-1 flex-shrink-0 transition-colors" />
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Team Preview ────────────────────────────────── */}
      {team.length > 0 && (
        <section className="section-py bg-navy relative overflow-hidden pattern-grid">
          <div className="container-site relative z-10">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="gold-line" />
                <h2 className="section-heading text-[#c9a84c]">تیم ما</h2>
                <p className="text-ivory/40 text-sm">متخصصانی که به شما اعتماد می‌دهند</p>
              </div>
              <Link href="/about" className="hidden md:flex items-center gap-1 text-sm hover-underline transition-colors" style={{ color: '#4cb4c9' }}>
                مشاهده همه <ArrowLeft size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {team.map((m: any) => (
                <Link key={m.id} href="/about" className="group text-center">
                  <div className="relative w-full aspect-square bg-navy-light overflow-hidden mb-3 transition-all duration-300"
                    style={{ border: '1px solid rgba(76,180,201,0.1)' }}>
                    {m.photo?.url
                      ? <Image src={m.photo.url} alt={m.name} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                      : <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-navy-muted">{m.name.charAt(0)}</div>
                    }
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: 'linear-gradient(to top, rgba(13,31,60,0.7) 0%, transparent 60%)' }} />
                  </div>
                  <h3 className="text-ivory text-sm font-semibold group-hover:text-teal transition-colors">{m.name}</h3>
                  <p className="text-ivory/35 text-xs mt-0.5">{m.specialization || ''}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Experiences ─────────────────────────────────── */}
      {experiences.length > 0 && (
        <section className="section-py bg-navy">
          <div className="container-site">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="gold-line" />
                <h2 className="section-heading text-[#c9a84c]">تجربیات برجسته</h2>
                <p className="section-subheading">نمونه‌هایی از پرونده‌های موفق</p>
              </div>
              <Link href="/cases" className="hidden md:flex items-center gap-1 text-sm text-navy hover-underline">
                مشاهده همه <ArrowLeft size={14} />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {experiences.map((e: any) => (
                <div key={e.id} className="card group bg-navy border-silver">
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`text-xs px-2 py-0.5 font-medium ${e.outcome==='successful'?'bg-emerald-50 text-emerald-700 border border-emerald-200':e.outcome==='settled'?'bg-sky-50 text-sky-700 border border-sky-200':'bg-gray-50 text-gray-700 border border-gray-200'}`}>
                      {e.outcome==='successful'?'موفق':e.outcome==='settled'?'توافقی':'آموزنده'}
                    </span>
                    {e.category && <span className="tag">{categoryLabels[e.category]}</span>}
                  </div>
                  <h3 className="font-bold text-white mb-2 group-hover:text-navy transition-colors">{e.title}</h3>
                  <p className="text-sm text-silver leading-relaxed line-clamp-3">{e.summary}</p>
                  {e.year && <p className="text-xs text-silver mt-4 pt-4 border-t border-teal">{e.year}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Latest Posts ────────────────────────────────── */}
      {posts.length > 0 && (
        <section className="section-py bg-navy">
          <div className="container-site">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="gold-line" />
                <h2 className="section-heading text-[#c9a84c]">آخرین مقالات</h2>
                <p className="section-subheading">دانش حقوقی به زبان ساده</p>
              </div>
              <Link href="/blog" className="hidden md:flex items-center gap-1 text-sm text-navy hover-underline">
                مشاهده همه <ArrowLeft size={14} />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {posts.map((p: any) => (
                <Link key={p.id} href={`/blog/${p.slug || p.id}`} className="card group bg-navy border border-silver">
                  {p.coverImage?.url && (
                    <div className="relative w-full aspect-video overflow-hidden mb-4 -mx-6 -mt-6">
                      <Image src={p.coverImage.url} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  {p.category && <span className="tag mb-3 inline-block">{categoryLabels[p.category]}</span>}
                  <h3 className="font-bold text-white mb-2 group-hover:text-navy transition-colors leading-snug">{p.title}</h3>
                  {p.excerpt && <p className="text-sm text-silver line-clamp-2">{p.excerpt}</p>}
                  <div className="mt-4 pt-4 border-t border-teal flex items-center justify-between text-xs text-silver">
                    {p.publishedAt && <span>{new Date(p.publishedAt).toLocaleDateString('fa-IR')}</span>}
                    {p.readingTime && <span className="flex items-center gap-1"><Clock size={11} />{p.readingTime} دقیقه</span>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Instagram ───────────────────────────────────── */}
      {instagram.length > 0 && (
        <section className="section-py bg-navy relative overflow-hidden pattern-grid">
          <div className="container-site relative z-10">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="gold-line" />
                <h2 className="section-heading text-ivory">اینستاگرام</h2>
                <a href="https://instagram.com/alireza.nazari.law" target="_blank" rel="noopener noreferrer"
                  className="text-sm hover-underline" style={{ color: '#4cb4c9' }}>@nazari.law</a>
              </div>
              <a href="https://instagram.com/alireza.nazari.law" target="_blank" rel="noopener noreferrer"
                className="hidden md:flex items-center gap-1 text-sm hover-underline" style={{ color: '#4cb4c9' }}>
                دنبال کنید <ArrowLeft size={14} />
              </a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
              {instagram.map((p: any) => (
                <a key={p.id} href={p.instagramUrl || 'https://instagram.com/alireza.nazari.law'}
                  target="_blank" rel="noopener noreferrer"
                  className="relative aspect-square block group overflow-hidden">
                  {p.image?.url
                    ? <Image src={p.image.url} alt={p.caption?.slice(0,60)||''} fill className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" />
                    : <div className="w-full h-full bg-navy-light" />
                  }
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3"
                    style={{ background: 'rgba(13,31,60,0.8)' }}>
                    <p className="text-ivory text-xs line-clamp-3 leading-relaxed">{p.caption}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ─────────────────────────────────────────── */}
      <section className="section-py bg-navy">
        <div className="container-site">
          <div className="bg-navy relative overflow-hidden pattern-grid">
            <div className="absolute top-0 left-0 right-0 h-0.5"
              style={{ background: 'linear-gradient(90deg, transparent, #4cb4c9, transparent)' }} />
            <div className="relative z-10 p-12 md:p-16 text-center">
              <span className="gold-line mx-auto" />
              <h2 className="text-3xl md:text-4xl font-bold text-ivory mb-4">سوال حقوقی دارید؟</h2>
              <p className="text-ivory/50 mb-8 max-w-md mx-auto leading-relaxed">
                ثبت‌نام کنید و سوال خود را از وکلای متخصص ما بپرسید.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth"
                className="inline-flex items-center gap-2 justify-center text-base px-8 py-4 font-semibold transition-all duration-300 hover:brightness-110"
                style={{ background: '#efdc5b', color: '#070f1e', boxShadow: '0 4px 20px rgba(201,168,76,0.4)' }}>
                  <Scale size={18} />
                  ثبت‌نام رایگان
                </Link>
                <Link href="/contact"
                  className="inline-flex items-center gap-2 justify-center border border-ivory/25 text-ivory px-8 py-4 text-base font-medium hover:bg-ivory/10 transition-all duration-300">
                  <Phone size={18} />
                  تماس با ما
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
