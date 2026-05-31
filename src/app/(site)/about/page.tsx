import Image from 'next/image'
import { safeFind } from '@/lib/payload'
import type { Metadata } from 'next'
import gpPhoto from "@/app/group.png"
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
              <p className="text-bone leading-relaxed mb-6">
علیرضا نظری، وکیل پایه یک دادگستری و مؤسس این تیم حقوقی، با بیش از ۱۳ سال سابقه حرفه‌ای، از رتبه‌ ۵۶ کانون وکلای استان فارس و کهگیلویه و بویراحمد بوده و تحصیلات خود را در رشته حقوق خصوصی دنبال کرده است. ایشان همچنین سابقه تدریس در حوزه حقوق را در کارنامه خود داشته و تجربه موفق در پیگیری هزاران پرونده حقوقی و کیفری را داراست.
رویکرد حرفه‌ای علیرضا نظری بر تحلیل دقیق، صداقت در مشاوره، طراحی راهبرد حقوقی مؤثر و پیگیری مسئولانه پرونده‌ها استوار است. باور این مجموعه بر آن است که هر پرونده، شرایط و پیچیدگی‌های خاص خود را دارد و باید با بررسی دقیق و استراتژی متناسب مدیریت شود.
              </p>
              <p className="text-bone leading-relaxed mb-8">
این دفتر حقوقی با بهره‌گیری از یک تیم منسجم و مسئولیت‌پذیر تلاش می‌کند خدماتی شفاف، دقیق و قابل اعتماد به موکیلن ارائه دهد
در دنیای امروز، متأسفانه نگاه برخی از مردم به حرفه وکالت با نوعی بی‌اعتمادی همراه شده است. گاهی چنین تصور می‌شود که وکیل پس از دریافت حق‌الوکاله، دیگر انگیزه یا دغدغه‌ای برای پیگیری جدی پرونده ندارد.            
              </p>
              <p className="text-bone leading-relaxed mb-8">
                ما در تیم حقوقی علیرضا نظری، وکیل پایه یک دادگستری بر آن هستیم که تصویری متفاوت، حرفه‌ای و مبتنی بر اصالت از مفهوم وکالت ارائه دهیم؛ تصویری که در آن<strong className='text-[#c9a84c] text-bold'> مشاوره به صورت رایگان و حق الوکاله پس از اتمام پرونده اخذ میگردد</strong>، وکیل نه صرفاً یک نماینده حقوقی، بلکه همراهی مسئول، دقیق و متعهد در تمام مراحل مسیر پرونده است.
بر همین اساس، رویکرد کاری این مجموعه بر سه اصل بنیادین استوار شده است: اعتماد، شفافیت و همراهی واقعی با موکل.
در این دفتر، تعهد به موکل در حد شعار باقی نمی‌ماند؛ بلکه در دقت در جزئیات، بررسی موشکافانه پرونده‌ها، طراحی استراتژی حقوقی منسجم و حضور حرفه‌ای در تمامی مراحل رسیدگی معنا پیدا می‌کند  


              </p>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: '۱۳+', label: 'سال تجربه' },
                  { value: '۲۵۰۰+', label: 'پرونده موفق' },
                  // { value: '۲', label: 'متخصص' },
                  { value: '۹+', label: 'حوزه تخصصی' },
                ].map((s) => (
                  <div key={s.label} className="border-r-2 border-teal pr-4">
                    <div className="text-3xl font-bold text-white">{s.value}</div>
                    <div className="text-sm text-silver">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
               <Image src={gpPhoto} alt={"team"}  />

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
              { icon: Handshake, title: 'امانت‌داری', desc: 'حفظ اسرار و رعایت کامل حریم خصوصی موکلین' },
              { icon: Brain, title: 'تخصص',       desc: 'عمق دانش حقوقی در حوزه‌های تخصصی' },
              { icon: Rocket, title: 'کارایی',      desc: 'پیگیری سریع و موثر پرونده‌ها' },
              { icon: HandHeart, title: 'همدلی',      desc: 'درک شرایط موکل و حمایت صادقانه' },
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
