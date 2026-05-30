'use client'
import React from 'react';
import Head from 'next/head';
import Image from 'next/image'
import { 
  BookOpen, 
  UserCheck, 
  Users, 
  Clock, 
  DollarSign, 
  Scale, 
  Trophy, 
  HeartPulse, 
  Briefcase, 
  CalendarDays 
} from 'lucide-react';
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

export default function ProblemPage() {

 return (
      <div style={{ background: '#070f1e', minHeight: '100vh' }}>

      {/* ── Header ──────────────────────────────────── */}
      <section className="pb-16 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #070f1e 0%, #0d1f3c 60%, #162d52 100%)' }}>
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg,rgba(255,255,255,1) 0,rgba(255,255,255,1) 1px,transparent 1px,transparent 80px),repeating-linear-gradient(90deg,rgba(255,255,255,1) 0,rgba(255,255,255,1) 1px,transparent 1px,transparent 80px)' }} />
        {/* Teal glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ background: '#4cb4c9' }} />
<div className="min-h-screen text-[#c9a84c] ">
      <Head>
        <title>چالش‌های یک وکیل</title>
        <meta name="description" content="Infographic showing the daily challenges of a lawyer" />
      </Head>

      <div className="max-w-6xl mx-auto pt-[80px]">
                <div className="relative top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(90deg, transparent, #4cb4c9, transparent)' }} />

        {/* Header Section */}
        <header className="text-center mt-[20px]">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-bone">
              چالش های من به عنوان یک وکیل
          </h1>
          <div className="text-sm md:text-base text-bone/75 max-w-2xl mx-auto leading-relaxed py-3">
           آیا تا الان به چالش ها و سختی های یک وکیل فکر کرده بودی؟
          </div>
        </header>
        <div className="relative top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(90deg, transparent, #4cb4c9, transparent)' }} />

        {/* Responsive Grid Layout */}
        {/* 
           Layout strategy: 
           1. On Desktop (lg): 3-column grid. The center column spans 2 rows for the Hero Image.
           2. On Tablet/Mobile: Image moves to the top as a standard hero section, cards stack vertically.
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-[10px] ">
          
          {/* Row 1 (Desktop) */}
          <ChallengeCard data={challenges[0]} />
          <ChallengeCard data={challenges[1]} />
          <ChallengeCard data={challenges[2]} />

          {/* Row 2 (Desktop) */}
          <ChallengeCard data={challenges[3]} />

          {/* Center Hero Element (Spans 2 rows on Desktop, 1 on Mobile) */}
          <div className="flex flex-col items-center justify-center bg-gradient-to-br from-navy to-teal rounded-[50%] shadow-md shadow-teal/50 h-full min-h-[350px] md:min-h-[400px] p-[2px] row-span-2">
             <div className="relative w-full h-full flex items-center justify-center">
                {/* Place the central illustration here. Replace 'url' with your actual image source */}
                <div className="text-center">
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-[#1A2930] rounded-full mx-auto mb-4 flex items-center justify-center text-white shadow-xl">
                       <Scale size={60} strokeWidth={1.5} />
                    </div>
                    <Image src={gpPhoto} alt="تیم حقوقی علیرضا نظری" fill className="object-cover object-top rounded-[50%]" />
                 </div>
             </div>
          </div>

          <ChallengeCard data={challenges[4]} />

          {/* Row 3 (Desktop) */}
          <ChallengeCard data={challenges[5]} />
          <ChallengeCard data={challenges[6]} />

          {/* Row 4 (Desktop) */}
          <ChallengeCard data={challenges[7]} />
          <ChallengeCard data={challenges[8]} />
          <ChallengeCard data={challenges[9]} />

        </div>

      </div>
    </div>
      </section>
    </div>
  );
}

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
