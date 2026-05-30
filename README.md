# موسسه حقوقی علیرضا نظاری

Next.js 16.2.4 + Payload CMS 3.39.1 + MongoDB

---

## پیش‌نیازها

| ابزار | نسخه |
|-------|-------|
| Node.js | >=18.20 — https://nodejs.org |
| MongoDB Community | 7.x — https://www.mongodb.com/try/download/community |

---

## راه‌اندازی (ویندوز)

### ۱. نصب وابستگی‌ها
```powershell
npm install
```

> **فونت Vazirmatn:** پس از نصب، فونت از `node_modules/@rastikerdar/vazirmatn` بارگذاری می‌شود — نیازی به اتصال به Google Fonts نیست.

### ۲. ساخت فایل محیطی
```powershell
copy .env.local.example .env.local
```
در `.env.local` مقدار `PAYLOAD_SECRET` را به یک رشته تصادفی قوی تغییر دهید.

### ۳. روشن کردن MongoDB
```powershell
net start MongoDB
```

### ۴. تولید Import Map (مهم — یک بار بعد از نصب)
```powershell
npm run generate:importmap
```
این دستور فایل `src/app/(payload)/importMap.js` را می‌سازد که برای کار کردن ادمین ضروری است.

### ۵. Seed داده‌های اولیه
```powershell
npm run seed
```

### ۶. اجرا
```powershell
npm run dev
```

| آدرس | توضیح |
|------|-------|
| http://localhost:3000 | سایت اصلی |
| http://localhost:3000/admin | پنل مدیریت Payload |
| http://localhost:3000/auth | ورود / ثبت‌نام |
| http://localhost:3000/dashboard | داشبورد وکلا |

**اطلاعات ورود پیش‌فرض:**
- ایمیل: `founder@nazari-law.ir`
- رمز: `Nazari@Law2024!`

---

## دستورات

```powershell
npm run dev                  # سرور توسعه
npm run build                # build تولید
npm run seed                 # بارگذاری داده‌های اولیه
npm run generate:importmap   # تولید import map (بعد از هر تغییر در collections)
npm run generate:types       # تولید TypeScript types
npm run setup                # generate:importmap + generate:types با هم
```

---

## نکته مهم — هر بار که collection تغییر کرد

```powershell
npm run generate:importmap
```

سپس سرور را restart کنید.

---

## ساختار

```
src/
├── app/
│   ├── layout.tsx              # bare passthrough (بدون html/body)
│   ├── (site)/                 # صفحات عمومی — html/body اینجاست
│   │   ├── layout.tsx          # Header + Footer + AuthProvider
│   │   ├── page.tsx            # خانه
│   │   ├── about/              # درباره ما
│   │   ├── blog/               # مقالات + [slug]
│   │   ├── cases/              # تجربیات
│   │   ├── qa/                 # پرسش و پاسخ
│   │   ├── faq/                # سوالات متداول
│   │   ├── contact/            # تماس با ما
│   │   ├── auth/               # ورود / ثبت‌نام
│   │   └── dashboard/          # داشبورد وکلا
│   └── (payload)/              # پنل مدیریت Payload
│       ├── layout.tsx          # Payload's RootLayout (html/body خودش)
│       ├── admin/[[...segments]]/
│       └── api/[...slug]/
├── collections/                # Users Media Posts Questions TeamMembers InstagramPosts Experiences
├── components/                 # Header Footer AskQuestionForm QuestionCard
├── context/AuthContext.tsx
├── lib/payload.ts
├── middleware.ts
└── payload.config.ts
```

---

## نقش‌ها

| نقش | دسترسی |
|-----|---------|
| `founder` | دسترسی کامل |
| `lawyer` | پاسخ سوالات + مقالات خود |
| `it_manager` | اینستاگرام + اعضای تیم |
| `financial_manager` | دسترسی محدود |
| `client` | ثبت سوال |
