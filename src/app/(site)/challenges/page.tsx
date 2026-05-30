'use client'

import Link from 'next/link'
import {
  Scale, Clock, Banknote, ShieldAlert, Users, BookOpen,
  MessageSquareX, Gavel, HeartHandshake, ArrowLeft, CheckCircle2
} from 'lucide-react'

const challenges = [
  {
    number: '۰۱',
    icon: ShieldAlert,
    title: 'بی‌اعتمادی موکلین',
    desc: 'تصور عمومی این است که وکیل پس از دریافت حق‌الوکاله، دیگر انگیزه‌ای برای پیگیری جدی پرونده ندارد.',
    solution: 'ما حق‌الوکاله را پس از اتمام موفق پرونده دریافت می‌کنیم.',
    color: '#ef4444',
    bgColor: 'rgba(239,68,68,0.08)',
    borderColor: 'rgba(239,68,68,0.2)',
  },
  {
    number: '۰۲',
    icon: Banknote,
    title: 'هزینه‌های سنگین',
    desc: 'بسیاری از افراد به دلیل ترس از هزینه‌های بالا از مراجعه به وکیل اجتناب می‌کنند و حقوق خود را نادیده می‌گیرند.',
    solution: 'مشاوره اولیه رایگان و تعیین هزینه شفاف پیش از شروع.',
    color: '#f97316',
    bgColor: 'rgba(249,115,22,0.08)',
    borderColor: 'rgba(249,115,22,0.2)',
  },
  {
    number: '۰۳',
    icon: Clock,
    title: 'طولانی بودن روند دادرسی',
    desc: 'کند بودن دستگاه قضایی و تأخیر در رسیدگی به پرونده‌ها از چالش‌های اصلی موکلین است.',
    solution: 'پیگیری مستمر و استفاده از مسیرهای تسریع‌کننده قانونی.',
    color: '#eab308',
    bgColor: 'rgba(234,179,8,0.08)',
    borderColor: 'rgba(234,179,8,0.2)',
  },
  {
    number: '۰۴',
    icon: MessageSquareX,
    title: 'عدم ارتباط شفاف',
    desc: 'موکلین اغلب از روند پرونده خود بی‌اطلاع می‌مانند و وکیل اطلاع‌رسانی منظمی ندارد.',
    solution: 'گزارش‌دهی منظم و دسترسی مستقیم به وکیل پرونده.',
    color: '#8b5cf6',
    bgColor: 'rgba(139,92,246,0.08)',
    borderColor: 'rgba(139,92,246,0.2)',
  },
  {
    number: '۰۵',
    icon: BookOpen,
    title: 'ناآگاهی از حقوق قانونی',
    desc: 'اکثر مردم از حقوق قانونی خود آگاه نیستند و همین ناآگاهی باعث می‌شود در موضع ضعف قرار گیرند.',
    solution: 'آموزش رایگان از طریق مقالات، سوال‌وجواب و مشاوره اولیه.',
    color: '#4cb4c9',
    bgColor: 'rgba(76,180,201,0.08)',
    borderColor: 'rgba(76,180,201,0.2)',
  },
  {
    number: '۰۶',
    icon: Users,
    title: 'انتخاب وکیل نامناسب',
    desc: 'عدم تخصص کافی وکیل در حوزه مورد نظر یکی از دلایل اصلی شکست پرونده‌هاست.',
    solution: 'تخصص مشخص در ۹ حوزه حقوقی با سابقه مستند.',
    color: '#22c55e',
    bgColor: 'rgba(34,197,94,0.08)',
    borderColor: 'rgba(34,197,94,0.2)',
  },
  {
    number: '۰۷',
    icon: Gavel,
    title: 'پیچیدگی مراحل قانونی',
    desc: 'فرایندهای اداری و قضایی بسیار پیچیده و گیج‌کننده هستند، به‌ویژه برای افراد عادی.',
    solution: 'راهنمایی گام‌به‌گام از آغاز تا صدور رأی نهایی.',
    color: '#ec4899',
    bgColor: 'rgba(236,72,153,0.08)',
    borderColor: 'rgba(236,72,153,0.2)',
  },
  {
    number: '۰۸',
    icon: Scale,
    title: 'عدم تعادل قدرت در دادگاه',
    desc: 'بدون وکیل مجرب، موکل در برابر طرف مقابل دارای وکیل یا دستگاه‌های قضایی در موضع ضعف است.',
    solution: 'دفاع حرفه‌ای و استراتژیک برای برقراری تعادل.',
    color: '#c9a84c',
    bgColor: 'rgba(201,168,76,0.08)',
    borderColor: 'rgba(201,168,76,0.2)',
  },
  {
    number: '۰۹',
    icon: HeartHandshake,
    title: 'فقدان حمایت عاطفی',
    desc: 'پرونده‌های حقوقی به‌ویژه در حوزه خانواده و کیفری فشار روانی زیادی به موکل وارد می‌کنند.',
    solution: 'همراهی صادقانه، گوش شنوا و حمایت در تمام مراحل.',
    color: '#f43f5e',
    bgColor: 'rgba(244,63,94,0.08)',
    borderColor: 'rgba(244,63,94,0.2)',
  },
]

export default function ChallengesPage() {
  return (
    <div style={{ background: '#070f1e', minHeight: '100vh' }}>

      {/* ── Header ──────────────────────────────────── */}


    </div>
  )
}
