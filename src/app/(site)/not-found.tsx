import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-8xl font-bold text-bone mb-4">۴۰۴</p>
        <span className="gold-line mx-auto" />
        <h1 className="text-2xl font-bold text-ink mb-3">صفحه یافت نشد</h1>
        <p className="text-silver mb-8 leading-relaxed">
          صفحه‌ای که به دنبال آن هستید وجود ندارد یا جابجا شده است.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/" className="btn-primary">بازگشت به خانه</Link>
          <Link href="/qa" className="btn-outline">پرسش و پاسخ</Link>
        </div>
      </div>
    </div>
  )
}
