'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Scale, LayoutDashboard, Settings, HelpCircle, LogOut, Menu, X } from 'lucide-react'

const navLinks = [
  { href: '/',            label: 'خانه' },
  { href: '/about',       label: 'درباره ما' },
  { href: '/blog',        label: 'مقالات' },
  { href: '/cases',       label: 'تجربیات' },
  { href: '/qa',          label: 'پرسش و پاسخ' },
  { href: '/faq',         label: 'سوالات متداول' },
  { href: '/challenges',    label: 'چالش ها' },
  { href: '/help',    label: 'خدمات ما' },
  { href: '/contact',     label: 'تماس با ما' },
]

const roleLabels: Record<string, string> = {
  founder: 'بنیان‌گذار', lawyer: 'وکیل',
  it_manager: 'مدیر IT', financial_manager: 'مدیر مالی', client: 'موکل',
}

export function Header() {
  const [scrolled, setScrolled]         = useState(false)
  const [menuOpen, setMenuOpen]         = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const pathname  = usePathname()
  const router    = useRouter()
  const { user, logout, isStaff, loading } = useAuth()
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  useEffect(() => { setMenuOpen(false); setUserMenuOpen(false) }, [pathname])

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node))
        setUserMenuOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const isHome = pathname === '/'
  const onDark = true

  async function handleLogout() { await logout(); router.push('/') }

  return (
    <header className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md border-b border-bone shadow-card' : 'bg-transparent'
    }`}>
      <div className="container-site">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 flex items-center justify-center transition-colors"
              style={{ background: 'rgba(76,180,201,0.15)' }}>
              <Scale size={16} style={{ color: '#4cb4c9' }} />
            </div>
            <div>
              <span className={`text-base md:text-lg font-bold leading-tight block transition-colors ${scrolled ? 'text-navy' : 'text-ivory'}`}>
                علیرضا نظری
              </span>
              <span className="text-2xs tracking-widest uppercase block" style={{ color: '#4cb4c9', fontSize: '9px' }}>
                تیم حقوقی
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href}
                className={`text-sm font-medium hover-underline transition-colors duration-200 ${
                  pathname === link.href
                    ? scrolled ? 'text-teal' : 'text-teal'
                    : scrolled ? 'text-navy hover:text-silver' : 'text-silver hover:text-bone'
                }`}>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth area */}
          <div className="flex items-center gap-3">
            {!loading && (
              user ? (
                <div className="relative hidden md:block" ref={userMenuRef}>
                  <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                      onDark ? 'text-ivory/80 hover:text-ivory' : 'text-graphite hover:text-navy'
                    }`}>
                    <span className="w-8 h-8 text-white text-xs font-bold flex items-center justify-center"
                      style={{ background: '#4cb4c9' }}>
                      {user.name.charAt(0)}
                    </span>
                    <span className="max-w-[90px] truncate hidden lg:block">{user.name}</span>
                    <span className={`text-xs transition-transform ${userMenuOpen ? 'rotate-180' : ''} ${onDark ? 'text-ivory/40' : 'text-silver'}`}>▾</span>
                  </button>

                  {userMenuOpen && (
                    <div className="absolute left-0 top-full mt-2 w-56 bg-white border border-bone shadow-card-hover animate-scale-in z-50">
                      <div className="px-4 py-3 border-b border-bone" style={{ background: 'rgba(76,180,201,0.04)' }}>
                        <p className="text-sm font-semibold text-navy truncate">{user.name}</p>
                        <p className="text-xs font-medium mt-0.5" style={{ color: '#4cb4c9' }}>{roleLabels[user.role]}</p>
                      </div>
                      <Link href="/dashboard" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink hover:bg-navy/4 hover:text-navy transition-colors">
                        <LayoutDashboard size={15} className="text-silver" /> داشبورد
                      </Link>
                      <Link href="/qa" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink hover:bg-navy/4 hover:text-navy transition-colors">
                        <HelpCircle size={15} className="text-silver" /> سوالات من
                      </Link>
                      {isStaff && (
                        <Link href="/admin" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink hover:bg-navy/4 hover:text-navy transition-colors border-t border-bone">
                          <Settings size={15} className="text-silver" /> پنل مدیریت
                        </Link>
                      )}
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-bone">
                        <LogOut size={15} /> خروج
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/auth"
                  className="bg-gradient-to-b from-[#b09b52] to-[#8a7840] hidden md:inline-flex items-center px-5 py-2 text-sm font-semibold transition-all duration-200 hover:brightness-110 active:scale-95">
                  ورود / ثبت‌نام
                </Link>
              )
            )}

            {/* Hamburger */}
            <button onClick={() => setMenuOpen(!menuOpen)}
              className={`lg:hidden p-1.5 transition-colors ${onDark ? 'text-ivory' : 'text-navy'}`}
              aria-label="منو">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden overflow-hidden transition-all duration-300 bg-white border-b border-bone shadow-card ${
        menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <nav className="container-site py-4 flex flex-col">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href}
              className={`py-3 text-sm font-medium border-b border-bone last:border-0 transition-colors ${
                pathname === link.href ? 'text-navy font-semibold' : 'text-graphite'
              }`}>
              {link.label}
            </Link>
          ))}
          {user ? (
            <div className="mt-3 pt-3 border-t border-bone space-y-1">
              <div className="flex items-center gap-2 pb-2">
                <span className="w-8 h-8 text-white text-xs font-bold flex items-center justify-center"
                  style={{ background: '#4cb4c9' }}>{user.name.charAt(0)}</span>
                <div>
                  <p className="text-sm font-semibold text-navy">{user.name}</p>
                  <p className="text-xs font-medium" style={{ color: '#4cb4c9' }}>{roleLabels[user.role]}</p>
                </div>
              </div>
              <Link href="/dashboard" className="flex items-center gap-2 py-2 text-sm text-ink">
                <LayoutDashboard size={14} className="text-silver" /> داشبورد
              </Link>
              {isStaff && (
                <Link href="/admin" className="flex items-center gap-2 py-2 text-sm text-ink">
                  <Settings size={14} className="text-silver" /> پنل مدیریت
                </Link>
              )}
              <button onClick={handleLogout} className="flex items-center gap-2 py-2 text-sm text-red-600 w-full">
                <LogOut size={14} /> خروج
              </button>
            </div>
          ) : (
            <Link href="/auth" className="mt-4 py-3 text-sm font-semibold text-center block"
              style={{ background: '#c9a84c', color: '#070f1e' }}>
              ورود / ثبت‌نام
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
