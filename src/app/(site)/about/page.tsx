import Image from 'next/image'
import { safeFind } from '@/lib/payload'
import type { Metadata } from 'next'
import gpPhoto from "@/app/alireza-nazari.jpg"
import { Brain, HandHeart, Handshake, Rocket, Scale } from 'lucide-react';

export const metadata: Metadata = {
  title: 'درباره ما',
  description: 'آشنایی با تیم وکیل و متخصصان تیم حقوقی علیرضا نظری'}

const roleLabels: Record<string, string> = {
  founder:           'بنیان‌گذار و وکیل ارشد',
  lawyer:            'وکیل',
  it_manager:        'مدیر فناوری اطلاعات',
  financial_manager: 'مدیر مالی',
  legal_assistant:   'دستیار حقوقی'}

const roleOrder = ['founder', 'lawyer', 'financial_manager', 'it_manager', 'legal_assistant']

export default async function AboutPage() {
  const team = await safeFind('team-members', { limit: 50, sort: 'orderIndex' })

  const grouped = roleOrder.reduce((acc, role) => {
    const members = team.filter((m: any) => m.role === role)
    if (members.length) acc[role] = members
    return acc
  }, {} as Record<string, any[]>)

  return (
    <div className="pt-24">
      {/* Header */}
      <section className="section-py bg-navy relative overflow-hidden noise-overlay">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-teal to-transparent opacity-60" />
        <div className="container-site">
          <p className="text-teal text-xs tracking-widest uppercase mb-4">تیم حقوقی علیرضا نظری</p>
          <h1 className="text-4xl md:text-6xl font-bold text-ivory mb-4">درباره ما</h1>
          <p className="text-silver text-lg max-w-xl leading-relaxed">
            تیمی از وکیل و متخصصان مجرب که با دانش، تعهد و درایت در کنار شما ایستاده‌اند.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="section-py bg-navy">
        <div className="container-site">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="gold-line" />
              <h2 className="section-heading">رسالت ما</h2>
              <p>من علیرضا نظری هستم، وکیل پایه یک دادگستری و مؤسس این مجموعه حقوقی. </p>
              <p className="text-bone leading-relaxed">
 بیش از ۱۳ سال است که به صورت حرفه‌ای در حوزه وکالت فعالیت می‌کنم. در آزمون کانون وکلای دادگستری استان فارس و کهگیلویه و بویراحمد رتبه ۵۶ را کسب کردم و در مقطع کارشناسی ارشد حقوق خصوصی نیز رتبه ۱۱ را به دست آوردم.
در این سال‌ها تجربه رسیدگی و پیگیری هزاران پرونده حقوقی و کیفری را داشته‌ام. هر پرونده شرایط خاص خودش را دارد، به همین دلیل قبل از پذیرش، موضوع به‌دقت بررسی می‌شود تا مسیر مناسب برای پیگیری آن مشخص شود.
در این مجموعه تلاش کرده‌ایم فضایی فراهم کنیم تا موکل با خیال راحت مسائل حقوقی خود را مطرح کند.
              </p>
              <p className='text-[#c9a84c] font-bold'>مشاوره به صورت رایگان انجام می‌شود تا قبل از هر تصمیمی، موضوع به‌طور کامل بررسی شود.</p>
              <p>  هدف ما این است که موکل بداند از شروع پرونده تا پایان آن، پیگیری و دغدغه موضوع برای ما جدی است.
در کنار فعالیت‌های وکالتی، در حوزه آموزش حقوق نیز فعال هستم. تدریس خصوصی دروس حقوقی، مشاوره تحصیلی برای داوطلبان آزمون‌های وکالت، قضاوت و سردفتری، و همچنین پشتیبانی آموزشی این آزمون‌ها از جمله خدمات این مجموعه است. در این مسیر با ارائه منابع معتبر، برنامه‌ریزی دقیق و همراهی مستمر، داوطلبان را تا رسیدن به نتیجه مطلوب همراهی می‌کنیم.
پایه کار ما در این مجموعه بر سه اصل استوار است: اعتماد، شفافیت و همراهی واقعی با موکل.
</p>
              <div className="grid grid-cols-2 gap-6 mt-12">
                {[
                  { value: '۱۳+', label: 'سال تجربه' },
                  { value: '۳۵۰۰+', label: 'پرونده موفق' },
                  // { value: '۲', label: 'متخصص' },
                  { value: '۱۰+', label: 'حوزه تخصصی' },
                ].map((s) => (
                  <div key={s.label} className="border-r-2 border-teal pr-4">
                    <div className="text-3xl font-bold text-white">{s.value}</div>
                    <div className="text-sm text-silver">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
               <Image src={gpPhoto} alt={"تیم حقوقی علیرضا نظری"} fill priority placeholder="blur" />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-teal opacity-20" />
            </div>
          </div>
        </div>
      </section>

      {/* Team by role */}
      {Object.entries(grouped).map(([role, members]) => (
        <section key={role} className={`section-py bg-navy`}>
          <div className="container-site">
            <div className={`grid gap-8 md:grid-cols-1 max-w-2xl`}>
              {members.map((member: any) => (
                <TeamMemberCard key={member.id} member={member} dark={role === 'founder'} />
              ))}
            </div>
          </div>
        </section>
      ))}

      {team.length === 0 && (
        <section className="section-py bg-ivory">
          <div className="container-site">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Static placeholder cards when DB is unavailable */}
              {[
                { name: 'علیرضا نظری', role: 'بنیان‌گذار و وکیل ارشد', spec: 'حقوق تجاری و بین‌الملل', exp: 20 },
                { name: 'سارا محمدی',   role: 'وکیل',                   spec: 'حقوق خانواده',           exp: 10 },
                { name: 'رضا کریمی',    role: 'وکیل',                   spec: 'حقوق کیفری',             exp: 8 },
              ].map((m, i) => (
                <div key={i} className="card bg-white">
                  <div className="flex gap-5 mb-4">
                    <div className="w-20 h-20 bg-bone flex items-center justify-center text-2xl font-bold text-silver flex-shrink-0">
                      {m.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-ink">{m.name}</h3>
                      <p className="text-teal text-xs font-medium mt-1">{m.role}</p>
                      <p className="text-xs text-silver mt-1">{m.spec}</p>
                      <p className="text-xs text-silver mt-1">{m.exp} سال تجربه</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Values */}
      <section className="section-py bg-navy border-t border-bone">
        <div className="container-site">
          <span className="gold-line" />
          <h2 className="section-heading mb-8 text-[#c9a84c]">ارزش‌های ما</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Handshake, title: 'تعهد به محرمانگی', desc: 'ما فراتر از امانت‌داری، امنیت اطلاعات شما را خط قرمز خود می‌دانیم.' },
              { icon: Brain, title: 'تسلط راهبردی',       desc: 'تخصص برای ما یک کلمه نیست؛ ما با دانش عمیق و به‌روز، مسیرهای قانونی را برای شما هموار می‌کنیم.' },
              { icon: Rocket, title: 'نتیجه‌گرایی هوشمندانه',      desc: 'ما به دنبال سریع‌ترین راه نیستیم، بلکه «هوشمندانه‌ترین» مسیر را برای موفقیت پرونده‌هایتان انتخاب می‌کنیم.' },
              { icon: HandHeart, title: 'پشتیبانی بی‌وقفه',      desc: 'در کنار شما هستیم، نه فقط به عنوان وکیل، بلکه به عنوان حامی و مشاوری که در هر گام، دغدغه‌های شما را درک می‌کند.' },
            ].map((v) => (
              <div key={v.title} className="card bg-graphite rounded-xl">
                <span className="text-3xl mb-4 block text-teal"><v.icon /></span>
                <h3 className="font-bold text-bone mb-2">{v.title}</h3>
                <p className="text-sm text-silver leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function TeamMemberCard({ member, dark }: { member: any; dark?: boolean }) {
  const cardBg = dark ? 'bg-ink border-graphite hover:border-teal' : 'bg-navy border-silver hover:border-ink'
  const textColor = dark ? 'text-ivory' : 'text-bone'
  const subColor  = dark ? 'text-silver' : 'text-silver'

  return (
    <div className={`border p-6 transition-all duration-300 group ${cardBg}`}>
      <div className="flex gap-5 mb-5">
        <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden bg-graphite border border-graphite">
          {member.photo?.url
            ? <Image src={member.photo.url} alt={member.name} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
            : <div className="w-full h-full flex items-center justify-center text-2xl text-silver">{member.name.charAt(0)}</div>
          }
        </div>
        <div>
          <h3 className={`font-bold text-lg leading-tight ${textColor}`}>{member.name}</h3>
          <p className="text-teal text-xs font-medium mt-1">{roleLabels[member.role]}</p>
          {member.specialization && <p className={`text-xs mt-1 ${subColor}`}>{member.specialization}</p>}
          {member.yearsOfExperience && <p className="text-xs text-silver mt-1">{member.yearsOfExperience} سال تجربه</p>}
        </div>
      </div>
      {member.education?.length > 0 && (
        <div className="mt-4 pt-4 border-t border-graphite/20 space-y-1">
          {member.education.map((edu: any, i: number) => (
            <p key={i} className="text-xs text-silver">
              {edu.degree} — {edu.institution}{edu.year ? ` (${edu.year})` : ''}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}
