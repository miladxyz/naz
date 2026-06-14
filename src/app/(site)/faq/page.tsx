'use client'

import { useState } from 'react'
import type { Metadata } from 'next'

const faqs = [
  {
    category: 'عمومی',
    items: [
      {
        q: 'چطور می‌توانم وقت مشاوره بگیرم؟',
        a: 'برای دریافت وقت مشاوره می‌توانید از طریق فرم تماس در سایت، ایمیل یا تماس تلفنی با دفتر ما ارتباط برقرار کنید. تیم ما ۲۴ ساعته پاسخگو  است.',
      },
      {
        q: 'هزینه اولین جلسه مشاوره چقدر است؟',
        a: 'اولین جلسه مشاوره برای بررسی اولیه پرونده شما به صورت رایگان برگزار می‌شود. پس از بررسی، هزینه‌های دقیق با توجه به نوع و پیچیدگی پرونده تعیین خواهد شد.',
      },
      {
        q: 'آیا امکان مشاوره آنلاین وجود دارد؟',
        a: 'بله، ما امکان مشاوره آنلاین از طریق ویدیوکال را برای موکلینی که امکان حضور در دفتر را ندارند فراهم کرده‌ایم.',
      },
      {
        q: 'آیا در طول رسیدگی، وضعیت پرونده به موکل اطلاع داده می‌شود؟',
        a: 'بله. اطلاع‌رسانی درباره روند پرونده و اقدامات انجام‌شده، بخشی از تعهد حرفه‌ای در قبال موکل است و در طول رسیدگی، وضعیت پرونده متناسب با مراحل آن به موکل اعلام می‌شود.',
      },
      {
        q: 'آیا در همراه با موکل امکان تنظیم انواع اوراق قضایی، از جمله دادخواست، شکواییه، لایحه، اظهارنامه و درخواست اعمال ماده  وجود دارد؟',
        a: 'بله. امکان تنظیم و نگارش انواع اوراق قضایی و حقوقی، از جمله درخواست، دادخواست، شکواییه، لایحه، اظهارنامه و در موارد لازم، درخواست اعمال ماده، پس از بررسی موضوع و مدارک وجود دارد.',
      },
      {
        q: 'چه نوع پرونده‌هایی را قبول می‌کنید؟',
        a: 'خدمات حقوقی با توجه به موضوع پرونده، در حوزه‌هایی مانند دعاوی حقوقی، خانواده، ارث، امور ملکی، چک، مطالبات، قراردادها و برخی پرونده‌های کیفری ارائه می‌شود. پس از بررسی اولیه مدارک، امکان پیگیری پرونده و نحوه همکاری به‌صورت شفاف اعلام خواهد شد.',
      },
      {
        q: 'شرایط پرداخت هزینه وکالت به چه صورت است؟',
        a: 'ما معتقدیم کیفیت کار باید تضمین‌کننده حق‌الوکاله باشد. به همین منظور، پس از بررسی اولیه پرونده و در صورت پذیرش وکالت، قراردادی شفاف تنظیم می‌شود که در آن امکان پرداخت حق‌الوکاله پس از پایان کار یا بر اساس خروجی‌های هر مرحله پیش‌بینی شده است. این رویکرد، گویای تعهد و مسئولیت‌پذیری ما تا رسیدن به نتیجه نهایی است.',
      },
      {
        q: 'آیا برای اعلام وکالت باید حضوری به دفتر مراجعه کنم؟ اگر در شیراز ساکن نباشم، این فرآیند چگونه انجام می‌شود؟',
        a: 'در شیراز ساکن نباشم، این فرآیند چگونه انجام می‌شود؟خیر. با توجه به سامانه‌های الکترونیکی، برای بسیاری از پرونده‌ها امکان انجام مراحل اعلام وکالت بدون مراجعه حضوری فراهم است. افرادی که ساکن شیراز نیستند نیز می‌توانند پس از ارسال مدارک و بررسی اولیه، با راهنمایی کامل مراحل لازم را به‌صورت غیرحضوری انجام دهند.',
      },
    ],
  },
  {
    category: 'پرسش و پاسخ آنلاین',
    items: [
      {
        q: 'آیا پاسخ‌های این بخش رسمی و قابل استناد هستند؟',
        a: 'پاسخ‌های ارائه شده در بخش پرسش و پاسخ جنبه اطلاع‌رسانی و راهنمایی اولیه دارند و جایگزین مشاوره حقوقی رسمی نمی‌شوند. برای استناد رسمی، مشاوره خصوصی توصیه می‌شود.',
      },
      {
        q: 'چقدر طول می‌کشد تا سوالم پاسخ داده شود؟',
        a: 'تیم ۲۴ ساعته پاسخگو می‌باشد. در مواردی که سوال نیاز به بررسی بیشتر داشته باشد، این زمان ممکن است بیشتر شود.',
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <div className="pt-24">
      {/* Header */}
      <section className="section-py bg-navy relative overflow-hidden noise-overlay">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-teal to-transparent opacity-60" />
        <div className="container-site">
          <p className="text-teal text-xs tracking-widest uppercase mb-4">راهنما</p>
          <h1 className="text-4xl md:text-6xl font-bold text-ivory mb-4">سوالات متداول</h1>
          <p className="text-silver text-lg max-w-xl leading-relaxed">
            پاسخ سوالات رایج درباره خدمات حقوقی و فرآیندهای قانونی.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <div className="container-site section-py">
        {faqs.map((group) => (
          <div key={group.category} className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <span className="gold-line mb-0 inline-block" />
              <h2 className="text-xl font-bold text-[#c9a84c]">{group.category}</h2>
            </div>
            <div className="space-y-3">
              {group.items.map((faq, i) => (
                <FAQItem key={i} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <section className="bg-bone border-t border-bone section-py">
        <div className="container-site text-center">
          <h2 className="text-2xl font-bold text-ink mb-3">سوال شما اینجا نیست؟</h2>
          <p className="text-silver mb-6">از وکیل متخصص ما مستقیماً بپرسید</p>
          <a href="/qa" className="btn-primary">ارسال سوال</a>
        </div>
      </section>
    </div>
  )
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`border transition-colors duration-200 ${open ? 'border-ink' : 'border-bone'} bg-white`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-right flex items-center justify-between gap-4 px-6 py-4 group"
      >
        <span className="font-medium text-ink text-sm">{q}</span>
        <span className={`text-silver transition-transform duration-200 flex-shrink-0 ${open ? 'rotate-180' : ''}`}>
          ▾
        </span>
      </button>
      {open && (
        <div className="px-6 pb-5 animate-fade-in">
          <p className="text-sm text-silver leading-relaxed border-t border-bone pt-4">{a}</p>
        </div>
      )}
    </div>
  )
}
