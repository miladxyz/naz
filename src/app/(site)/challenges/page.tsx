'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  BookOpen, UserCheck, Users, Clock, DollarSign,
  Scale, Trophy, HeartPulse, Briefcase, CalendarDays, ArrowLeft
} from 'lucide-react'
import gpPhoto from '@/app/group.jpg'
const challenges = [
  {
    id: 1,
    title: 'تماس صدم، بولد کردن یک جواب ندادن',
    descEn: 'Staying Up-to-Date',
    points: ['همان یک بار که  وکیل جواب نداد را بزرگ میکنی، اما 99 بار جواب دادن را اصلا نمی‌بینی.'],
    icon: <BookOpen size={28} />,
  },
  {
    id: 2,
    title: 'وکیل پرونده من، وکیل همه پرونده ها',
    descEn: 'Heavy Responsibility',
    points: [ 'توقع داری وکیل قرارداد همسایه‌ات را هم رایگان بررسی کند، چون یک بار برای خودت وکیل گرفته ای.'],
    icon: <UserCheck size={28} />,
  },
  {
    id: 3,
    title: 'قبل پول دوست / بعد پول دشمن',
    descEn: 'Managing Client Expectations',
    points: ['تا پول وسط نیامده، وکیل بهترین آدم دنیاست: به محض مطرح شدن حق‌الوکاله، تبدیل به آدم سودجو می‌شود.'],
    icon: <Users size={28} />,
  },
  {
    id: 4,
    title: 'چانه اول، چانه آخر، حق‌الوکاله صفر',
    descEn: 'Time Management',
    points: ['اول قرارداد چانه می‌زنی، آخر پرونده هم چانه می‌زنی غاقل از اینکه تورم ارزش حق‌الوکاله را به صفر رسانده.'],
    icon: <Clock size={28} />,
  },
  {
    id: 5,
    title: 'توقع سرعت از وکیل، نادیده گرفتن بوروکراسی',
    descEn: 'Financial Problems',
    points: ['انتظار داری وکیل ابلاغ را از پشت بام دادگاه قاپ بزند، در حالی که نوبت پرونده دست قاضی است نه وکیل.'],
    icon: <DollarSign size={28} />,
  },
  {
    id: 6,
    title: 'وصله های ناجور',
    descEn: 'Lengthy Litigation',
    points: ['اطاله دادرسی', 'پیگیری‌های مکرر و زمان‌بر'],
    icon: <Scale size={28} />,
  },
  {
    id: 7,
    title: 'مگه چیکار کردی؟',
    descEn: 'Professional Competition',
    points: [ 'با همین یک جمله، تمام زحمات ماه‌ها و سال‌های وکیل را یک‌جا نفی میکنی.'],
    icon: <Trophy size={28} />,
  },
  {
    id: 8,
    title: 'پاسخگویی شبانه روزی',
    descEn: 'Ethical Challenges',
    points: [' نصف شب هم باید جواب بدهی، چون موکل فراموش کرده تو هم آدمی با یک زندگی شخصی.'],
    icon: <HeartPulse size={28} />,
  },
  {
    id: 9,
    title: 'تنهایی وکیل پس از سازش',
    descEn: 'Case Complexity',
    points: [ 'طرفین بعد از صلح و آشتی، همدیگر را در آغوش می‌گیرند، اما وکیل را کاملا فراموش می‌کنند - انگار نه او زحمت کشیده، نه او میانجی بوده، نه او حقالوکاله‌ای دارد.'],
    icon: <Briefcase size={28} />,
  },
  {
    id: 10,
    title: 'تحمل فشارهای روحی',
    descEn: 'Work-Life Balance',
    points: ['وکیل باید هم فشار پرونده را تحمل کند، هم توهین طرف مقابل را، هم بی‌صبری موکل خودش را -  و هیج‌کس این فشار را نمی‌بیند.'],
    icon: <CalendarDays size={28} />,
  },
];

const ChallengeCard = ({ data }: { data: typeof challenges[0] }) => {
  return (
    <div className="isolate aspect-video w-96 rounded-xl bg-graphite/20 shadow-lg ring-1 ring-black/5  p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center h-full">
      {/* <div className="" /> */}

      {/* Icon Container - Mimics the circular icon in the infographic */}
      <div className="w-14 h-14 rounded-full bg-tansparent border-2 border-teal/40 text-teal shadow-lg shadow-teal/50 flex items-center justify-center shadow-md mb-4">
        {data.icon}
      </div>

      <h3 className="text-lg font-bold mb-2">{data.title}</h3>
      {/* <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">{data.descEn}</p> */}

      {/* Bullet Points */}
      <ul className="text-sm text-silver space-y-1.5 mt-auto w-full">
        {data.points.map((point, idx) => (
          <li key={idx} className="flex items-start justify-center gap-1">
            <span className="text-silver mt-1 text-[8px]">●</span>
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};


export default function ProblemsPage() {
  return (
    <div style={{ background: '#070f1e', minHeight: '100vh' }}>

      {/* Header */}
      <section className="pt-24 pb-12 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ background: '#4cb4c9' }} />

        <div className="container-site relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-ivory mb-4 leading-tight">
            چالش‌های من<br />
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(90deg, #4cb4c9, #a8dde8)' }}>
              به عنوان یک وکیل
            </span>
          </h1>
          <p className="text-base max-w-xl mx-auto leading-relaxed mb-8"
            style={{ color: 'rgba(246,248,250,0.55)' }}>
            آیا تا الان به چالش‌ها و سختی‌های یک وکیل فکر کرده بودی؟
          </p>
          <div className="h-px max-w-2xl mx-auto" style={{ background: 'linear-gradient(90deg, transparent, #4cb4c9, transparent)' }} />
        </div>
      </section>

      {/* Main grid — 3 cols with hero image in center */}
      <section className="container-site py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

          {/* Row 1: cards 1–2 + center image (spans 2 rows) */}
          <ChallengeCard data={challenges[0]} />
          <ChallengeCard data={challenges[1]} />
          <ChallengeCard data={challenges[2]} />

          {/* Row 2: cards 3–4 + center image continues */}
          <ChallengeCard data={challenges[3]} />

          {/* Center hero image — spans 2 rows on lg */}
          <div className="lg:row-span-2 flex items-center justify-center p-2 hidden lg:flex rounded-[50%]"
            style={{ border: '1px solid rgba(76,180,201,0.2)', background: 'rgba(13,31,60,0.6)' }}>
            <div className="relative w-full h-full min-h-[380px] overflow-hidden"
              style={{ borderRadius: '2px' }}>
              <Image src={gpPhoto} alt="تیم حقوقی علیرضا نظری" fill
                className="object-cover object-top rounded-[50%]" />
              <div className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(7,15,30,0.8) 0%, transparent 50%)' }} />
              <div className="absolute bottom-4 left-4 right-4 text-center">
                <p className="text-ivory font-bold text-sm">تیم حقوقی علیرضا نظری</p>
                <p className="text-xs mt-1" style={{ color: '#4cb4c9' }}>وکیل پایه یک دادگستری</p>
              </div>
            </div>
          </div>

          <ChallengeCard data={challenges[4]} />

          {/* Row 3 */}
          <ChallengeCard data={challenges[5]} />
          <ChallengeCard data={challenges[6]} />

          {/* Row 4 */}
          <ChallengeCard data={challenges[7]} />
          <ChallengeCard data={challenges[8]} />
          <ChallengeCard data={challenges[9]} />

        </div>

        {/* CTA */}
        <div className="mt-12 p-8 text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0d1f3c, #162d52)', border: '1px solid rgba(76,180,201,0.2)' }}>
          <div className="h-0.5 absolute top-0 left-0 right-0"
            style={{ background: 'linear-gradient(90deg, transparent, #c9a84c, transparent)' }} />
          <h3 className="text-xl font-bold text-ivory mb-2">حالا که چالش‌های ما را می‌دانید…</h3>
          <p className="text-sm mb-6" style={{ color: 'rgba(246,248,250,0.5)' }}>
            ما با همه این سختی‌ها در کنار شما هستیم — مشاوره رایگان، حق‌الوکاله پس از نتیجه.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/qa"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-all hover:brightness-110"
              style={{ background: '#c9a84c', color: '#070f1e' }}>
              <Scale size={15} /> پرسش رایگان
            </Link>
            <Link href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all"
              style={{ border: '1px solid rgba(76,180,201,0.3)', color: '#4cb4c9' }}>
              تماس با ما <ArrowLeft size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
