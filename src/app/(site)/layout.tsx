import type { Metadata } from 'next'
import '../globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { AuthProvider } from '@/context/AuthContext'
import React from 'react'

export const metadata: Metadata = {
  title: {
    default: 'تیم حقوقی علیرضا نظری',
    template: '%s | تیم حقوقی علیرضا نظری',
  },
  description: 'تیم حقوقی علیرضا نظری — مشاوره و خدمات حقوقی تخصصی در شیراز.',
  keywords: ['وکیل', 'تیم حقوقی', 'علیرضا نظری', 'مشاوره حقوقی', 'وکیل شیراز'],
  authors: [{ name: 'علیرضا نظری' }],
}

// Vazirmatn loaded via @font-face in globals.css
// from node_modules/@rastikerdar/vazirmatn (run: npm install)
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body className="text-ivory antialiased" style={{ fontFamily: 'Vazirmatn, sans-serif', background: '#0d1f3c' }}>
        {/* backgroud grid */}
        <div className='fixed inset-0 opacity-5'>
          <div className='h-full w-full bg-grid-pattern'></div>
        </div>
        <AuthProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
