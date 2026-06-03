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
    title: 'وقتی وکالت ساعت کاری نمی‌شناسد',
    descEn: 'Staying Up-to-Date',
    points: ['تماس ها، دغدغه ها و نگرانی موکلین ساعت اداری نمی‌شناسد و انتظار پاسخگویی شبانه‌روزی دارند.'],
    icon: <BookOpen size={28} />,
  },
  {
    id: 2,
    title: 'حقوقی که ادا شد، قدری که شناخته نشد',
    descEn: 'Heavy Responsibility',
    points: [ 'پشت هر نتیجه حقوقی ساعت ها مطالعه، پیگیری و تحمل فشار نهفته است که به چشم موکل نمی‌آید.'],
    icon: <UserCheck size={28} />,
  },
  {
    id: 3,
    title: 'جمله کشنده (مگه چیکار کردی؟)',
    descEn: 'Managing Client Expectations',
    points: ['بسیاری تنها نتیجه نهایی را می‌بینند، نه مسیر پیچیده، زمان بر و تخصصی رسیدن به آن را.'],
    icon: <Users size={28} />,
  },
  {
    id: 4,
    title: 'مرزهای وکالت در برابر توقعات بی پایان',
    descEn: 'Time Management',
    points: ['برخی تصور میکنند اگر وکیل در یک پرونده ایشان اعلام وکالت کرد مسولیت تمام ابلاغ ها، امور حقوقی و... با وکیل است.'],
    icon: <Clock size={28} />,
  },
  {
    id: 5,
    title: 'نادیده گرفتن تخصص حقوقی',
    descEn: 'Financial Problems',
    points: ['وکالت صرفا دانستن چند ماده حقوقی نیست، حاصل سال‌ها تحصیل، تجربه، تحلیل و تصمیم گیری در موقعیت های حساس است.'],
    icon: <DollarSign size={28} />,
  },
  {
    id: 6,
    title: 'حق‌الوکاله، از چانه زنی تا بی ارزش شدن دستمزد',
    descEn: 'Lengthy Litigation',
    points: ['موکل از آغاز تا پایان کار با چانه زنی بر سر دستمزد و کاهش ارزش آن در اثر تورم، این بخش از حرفه را به چالشی فرساینده تبدیل کرده.'],
    icon: <Scale size={28} />,
  },
  {
    id: 7,
    title: 'کندی دادرسی به حساب وکیل نوشته می‌شود',
    descEn: 'Professional Competition',
    points: [ 'تاخیر در فرایند رسیدگی غالبا ناشی از ساختار تراکم پرونده ها یا روند اداری است نه کم کاری وکیل. خیلی چیزها باعث کندی رونده پرونده می‌شود.'],
    icon: <Trophy size={28} />,
  },
  {
    id: 8,
    title: 'تنهایی وکیل پس از پایان اختلاف',
    descEn: 'Ethical Challenges',
    points: ['وقتی اختلافات به سازش ختم می‌شود، بسیاری از تنش ها فراموش می‌شود اما نقش وکیل در شکل گیری آن دیده  نمی‌شود.'],
    icon: <HeartPulse size={28} />,
  },
  {
    id: 9,
    title: 'وکیل برای حق خودش هم باید بجنگد',
    descEn: 'Case Complexity',
    points: [ 'به تازگی وکیل باید برای وصول حق‌الوکاله یا دفاع از حق شخص خود وکیل بگیرد، مدتی برای موکل بجنگد و مدتی نیز با موکل بجنگد برای حق‌الوکاله ناچیز خود.'],
    icon: <Briefcase size={28} />,
  },
  {
    id: 10,
    title: 'تهدید به شکایت، فشاری فراتر از مسولیت',
    descEn: 'Work-Life Balance',
    points: ['وقتی هیچ تخلفی رخ نداده، وکیل تهدید به شکایت می‌شود، اغلب این شکایات به زمانی برمی‌گردد که وکیل مطالبه حق‌الوکاله میکند و موکل تازه متوجه می‌شود وکیل تخلف کرده.'],
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

      {/* Bullet Points */}
      <ul className="text-sm text-silver space-y-1.5 mt-auto w-full">
        {data.points.map((point, idx) => (
          <li key={idx} className="flex items-start justify-center gap-1">
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
            ذره‌ای از چالش‌های من<br />
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
