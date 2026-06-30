import Link from 'next/link'
import { Scale, MapPin, Phone, Mail, Clock } from 'lucide-react'

const quickLinks = [
  { href: '/about',       label: 'درباره ما' },
  { href: '/blog',        label: 'مقالات حقوقی' },
  { href: '/cases',       label: 'تجربیات' },
  { href: '/qa',          label: 'پرسش و پاسخ' },
  { href: '/faq',         label: 'سوالات متداول' },
  { href: '/challenges',    label: 'چالش ها' },
  { href: '/contact',     label: 'تماس با ما' },
]

const practiceAreas = [
  'داوری و حل اختلاف', 'حقوقی', 'کیفری',
  'حقوق کار', 'دعاوی ارث و ترکه', 'حقوق حسبی',
  'حقوق خانواده', 'حقوق بانکی', 'حقوق بیمه',
]

const contactItems = [
  { icon: MapPin,     value: 'شیراز، خیابان معالی‌آباد، مجتمع تجاری آوا، طبقه ۷، واحد ۷۱', href: null },
  { icon: Phone,      value: '۰۹۱۲۰۳۱۰۸۰۶', href: 'tel:+989120310806' },
  { icon: Phone,      value: '۰۹۱۲۰۳۱۰۸۰۵', href: 'tel:+989120310805' },
  { icon: Mail,       value: 'info@alirezanazari.com', href: 'mailto:info@alirezanazari.com' },
  { icon: Clock,      value: 'شنبه تا پنجشنبه — ۸ صبح تا ۸ عصر', href: null },
]

export function Footer() {
  return (
    <footer style={{ background: '#070f1e', color: '#f6f8fa' }}>
      {/* Teal top line */}
      <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, #4cb4c9, transparent)' }} />

      <div style={{ borderBottom: '1px solid rgba(32, 214, 255, 0.6)' }}>
        <div className="container-site py-14 grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 flex items-center justify-center"
                style={{ background: 'rgba(76,180,201,0.15)', border: '1px solid rgba(76,180,201,0.3)' }}>
                <Scale size={18} style={{ color: '#4cb4c9' }} />
              </div>
              <div>
                <h3 className="text-base font-bold text-ivory">علیرضا نظری</h3>
                <p className="text-xs tracking-widest uppercase font-medium" style={{ color: '#4cb4c9', fontSize: '9px' }}>تیم حقوقی</p>
              </div>
            </div>
            <div className="w-8 h-0.5 mb-4" style={{ background: '#4cb4c9' }} />
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(246,248,250,0.45)' }}>
              بیش از یک دهه تجربه در دفاع از حقوق موکلین در شیراز. دفتر وکالت علیرضا نظری آماده ارائه مشاوره رایگان و وکالت تخصصی شماست. همین حالا تماس بگیرید.
            </p>
            <a href="https://instagram.com/alireza.nazari.law" target="_blank" rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-sm transition-colors"
              style={{ color: 'rgba(246,248,250,0.4)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              @alireza.nazari.law
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold mb-5 text-ivory">دسترسی سریع</h4>
            <ul className="space-y-3">
              {quickLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="text-sm transition-colors hover-underline"
                    style={{ color: 'rgba(246,248,250,0.45)' }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Practice Areas */}
          <div>
            <h4 className="text-sm font-semibold mb-5 text-ivory">حوزه‌های تخصصی</h4>
            <ul className="space-y-3">
              {practiceAreas.map(area => (
                <li key={area} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(246,248,250,0.45)' }}>
                  <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: '#4cb4c9' }} />
                  {area}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold mb-5 text-ivory">تماس با ما</h4>
            <ul className="space-y-4">
              {contactItems.map((item, i) => {
                const Icon = item.icon
                return (
                  <li key={i} className="flex items-start gap-3">
                    <Icon size={15} className="flex-shrink-0 mt-0.5" style={{ color: '#4cb4c9' }} />
                    {item.href ? (
                      <a href={item.href} dir="ltr"
                        className="text-sm transition-colors"
                        style={{ color: 'rgba(246,248,250,0.45)' }}>
                        {item.value}
                      </a>
                    ) : (
                      <span className="text-sm leading-relaxed" style={{ color: 'rgba(246,248,250,0.45)' }}>
                        {item.value}
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="container-site py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs"
        style={{ color: 'rgba(246,248,250,0.25)' }}>
        <p>© {new Date().getFullYear()} تیم حقوقی علیرضا نظری. تمامی حقوق محفوظ است.</p>
        <div className="flex gap-5">
          <Link href="/privacy" className="hover:text-ivory transition-colors">حریم خصوصی</Link>
          <Link href="/terms"   className="hover:text-ivory transition-colors">شرایط استفاده</Link>
        </div>
      </div>
    </footer>
  )
}
