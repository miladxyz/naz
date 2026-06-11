import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy:        '#0d1f3c',
        'navy-deep': '#070f1e',
        'navy-light':'#162d52',
        'navy-muted':'#243d6a',
        teal:        '#4cb4c9',
        'teal-light':'#a8dde8',
        'teal-dark': '#2a8fa3',
        gold:        '#4cb4c9',   // alias for backward compat
        'gold-light':'#a8dde8',   // alias
        ivory:       '#f6f8fa',
        bone:        '#e4e8ed',
        ink:         '#0f1923',
        graphite:    '#2d3748',
        silver:      '#64748b',
      },
      fontFamily: {
        vazirmatn: ['var(--font-vazirmatn)', 'sans-serif'],
      },
      boxShadow: {
        'navy-glow': '0 8px 30px rgba(13,31,60,0.25)',
        'teal-glow': '0 4px 24px rgba(76,180,201,0.35)',
        'gold-glow': '0 4px 24px rgba(76,180,201,0.35)',  // alias
        'card':      '0 2px 15px rgba(13,31,60,0.08)',
        'card-hover':'0 8px 40px rgba(13,31,60,0.15)',
        'gold': '0 6px 14px -4px rgba(163, 143, 76, 0.4), inset 0 1px 0 rgba(255,255,240,0.2)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #070f1e 0%, #0d1f3c 60%, #162d52 100%)',
        'teal-gradient': 'linear-gradient(90deg, #4cb4c9, #a8dde8, #4cb4c9)',
        'gold-gradient': 'linear-gradient(90deg, #4cb4c9, #a8dde8, #4cb4c9)',
        'grid-pattern': 'repeating-linear-gradient(0deg,rgba(255,255,255,1) 0,rgba(255,255,255,1) 1px,transparent 1px,transparent 80px),repeating-linear-gradient(90deg,rgba(255,255,255,1) 0,rgba(255,255,255,1) 1px,transparent 1px,transparent 80px)' // alias
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.4,0,0.2,1) both',
        'fade-in':    'fadeIn 0.5s cubic-bezier(0.4,0,0.2,1) both',
        'scale-in':   'scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both',
        'float':      'float 4s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: { from: { opacity:'0', transform:'translateY(24px)' }, to: { opacity:'1', transform:'translateY(0)' } },
        fadeIn:   { from: { opacity:'0' }, to: { opacity:'1' } },
        scaleIn:  { from: { opacity:'0', transform:'scale(0.95)' }, to: { opacity:'1', transform:'scale(1)' } },
        float:    { '0%,100%': { transform:'translateY(0)' }, '50%': { transform:'translateY(-12px)' } },
      },
    },
  },
  plugins: [],
}

export default config
