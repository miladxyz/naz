import React from 'react'

// Root layout — intentionally bare.
// (site)/layout.tsx provides <html><body> for the public site.
// (payload)/layout.tsx (Payload's RootLayout) provides <html><body> for /admin.
// Next.js 16 supports each route group having its own html/body.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
