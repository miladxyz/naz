/**
 * Seed script — run with:  npm run seed
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

const makeRichText = (text: string) => ({
  root: {
    type: 'root', format: '', indent: 0, version: 1, direction: 'rtl',
    children: text.split('\n\n').filter(Boolean).map((para) => ({
      type: 'paragraph', format: '', indent: 0, version: 1, direction: 'rtl',
      textFormat: 0, textStyle: '',
      children: [{ type: 'text', text: para, format: 0, version: 1, mode: 'normal', style: '', detail: 0 }],
    })),
  },
})

async function seed() {
  console.log('Seeding database...')
  const payload = await getPayload({ config })

  // Founder
  const existing = await payload.find({ collection: 'users', where: { email: { equals: 'founder@nazari-law.ir' } }, limit: 1 })
  let founderId: string
  if (existing.docs.length > 0) {
    founderId = String(existing.docs[0].id)
    console.log('Founder already exists')
  } else {
    const f = await payload.create({ collection: 'users', data: { name: 'علیرضا نظری', email: 'founder@nazari-law.ir', password: 'Nazari@Law2024!', role: 'founder', specialization: 'حقوق تجاری و بین‌الملل', yearsOfExperience: 20, orderIndex: 1 } })
    founderId = String(f.id)
    console.log('Created founder: founder@nazari-law.ir / Nazari@Law2024!')
  }

  // Team
  const { totalDocs: t } = await payload.find({ collection: 'team-members', limit: 1 })
  if (t === 0) {
    for (const m of [
      { name: 'علیرضا نظری', role: 'founder', specialization: 'حقوق تجاری و بین‌الملل', yearsOfExperience: 20, linkedUser: founderId, orderIndex: 1, education: [{ degree: 'دکترای حقوق خصوصی', institution: 'دانشگاه تهران', year: 2000 }] },
      { name: 'سارا محمدی',   role: 'lawyer',  specialization: 'حقوق خانواده',            yearsOfExperience: 10, orderIndex: 2 },
      { name: 'رضا کریمی',    role: 'lawyer',  specialization: 'حقوق کیفری',              yearsOfExperience: 8,  orderIndex: 3 },
      { name: 'امیر تهرانی',  role: 'lawyer',  specialization: 'حقوق تجاری',              yearsOfExperience: 7,  orderIndex: 4 },
      { name: 'مریم حسینی',  role: 'financial_manager', specialization: 'مدیریت مالی',  yearsOfExperience: 12, orderIndex: 5 },
      { name: 'علی رضایی',    role: 'it_manager', specialization: 'فناوری اطلاعات',       yearsOfExperience: 6,  orderIndex: 6 },
    ] as any[]) await payload.create({ collection: 'team-members', data: m })
    console.log('Created 6 team members')
  }

  // Experiences
  const { totalDocs: e } = await payload.find({ collection: 'experiences', limit: 1 })
  if (e === 0) {
    for (const exp of [
      { title: 'دفاع موفق در پرونده طلاق توافقی',  summary: 'دفاع از حقوق موکل در پرونده پیچیده شامل حضانت فرزندان و تقسیم اموال مشترک.', category: 'family',     outcome: 'successful', year: 2023, isFeatured: true },
      { title: 'حل اختلاف تجاری بین‌المللی',        summary: 'میانجیگری موفق در اختلاف قراردادی میان یک شرکت ایرانی و طرف اروپایی.',        category: 'commercial', outcome: 'settled',    year: 2023, isFeatured: true },
      { title: 'دفاع در پرونده کیفری',               summary: 'دفاع از موکل در پرونده با اتهامات متعدد که منجر به تبرئه کامل شد.',             category: 'criminal',   outcome: 'successful', year: 2022, isFeatured: true },
      { title: 'استرداد ملک مشاع',                   summary: 'پیگیری موفق دعوای ملکی و استرداد سهم موکل پس از سه سال پیگیری قانونی.',          category: 'property',   outcome: 'successful', year: 2022, isFeatured: false },
    ] as any[]) await payload.create({ collection: 'experiences', data: exp })
    console.log('Created 4 sample experiences')
  }

  // Posts
  const { totalDocs: p } = await payload.find({ collection: 'posts', limit: 1 })
  if (p === 0) {
    await payload.create({ collection: 'posts', data: { title: 'راهنمای جامع طلاق توافقی در ایران', slug: 'divorce-guide', excerpt: 'همه آنچه باید درباره طلاق توافقی بدانید.', content: makeRichText('طلاق توافقی یکی از رایج‌ترین شیوه‌های جدایی قانونی در ایران است.\n\nمراحل اصلی شامل تنظیم دادخواست، ارجاع به مشاور، صدور گواهی عدم سازش، و ثبت طلاق است.'), category: 'family', author: founderId, _status: 'published', publishedAt: new Date().toISOString(), readingTime: 5 } })
    await payload.create({ collection: 'posts', data: { title: 'نکات مهم در تنظیم قرارداد تجاری', slug: 'commercial-contract-tips', excerpt: 'چه بندهایی در قرارداد تجاری باید گنجانده شوند؟', content: makeRichText('قرارداد تجاری یکی از مهم‌ترین اسناد در هر کسب‌وکار است.\n\nیک قرارداد جامع باید شامل تعریف دقیق تعهدات، شرایط فسخ، و مکانیزم حل اختلاف باشد.'), category: 'commercial', author: founderId, _status: 'published', publishedAt: new Date(Date.now() - 86400000).toISOString(), readingTime: 4 } })
    console.log('Created 2 sample posts')
  }

  // Instagram
  const { totalDocs: ig } = await payload.find({ collection: 'instagram-posts', limit: 1 })
  if (ig === 0) {
    for (const post of [
      { caption: 'حق شما را می‌شناسیم. از آن دفاع می‌کنیم. ⚖️', instagramUrl: 'https://instagram.com/nazari.law', postedAt: new Date().toISOString(), likes: 124 },
      { caption: 'طلاق توافقی می‌تواند در چند ماه نهایی شود. برای مشاوره تماس بگیرید.', instagramUrl: 'https://instagram.com/nazari.law', postedAt: new Date(Date.now() - 172800000).toISOString(), likes: 89 },
      { caption: 'تیم متخصص ما همیشه در کنار شماست. 📞', instagramUrl: 'https://instagram.com/nazari.law', postedAt: new Date(Date.now() - 345600000).toISOString(), likes: 201 },
    ] as any[]) await payload.create({ collection: 'instagram-posts', data: post })
    console.log('Created 3 sample Instagram posts')
  }

  console.log('\nSeed complete!')
  console.log('  Site  : http://localhost:3000')
  console.log('  Admin : http://localhost:3000/admin')
  process.exit(0)
}

seed().catch((err) => { console.error('Seed failed:', err); process.exit(1) })
