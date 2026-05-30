import { CollectionConfig } from 'payload'

export const Questions: CollectionConfig = {
  slug: 'questions',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'createdAt'],
    group: 'محتوا',
  },
  access: {
    create: ({ req: { user } }) => !!user,
    read: ({ req: { user } }) => {
      const role = (user as any)?.role
      if (role === 'founder' || role === 'lawyer') return true
      return { status: { equals: 'answered' } }
    },
    update: ({ req: { user } }) => {
      const role = (user as any)?.role
      return role === 'founder' || role === 'lawyer'
    },
    delete: ({ req: { user } }) => (user as any)?.role === 'founder',
  },
  // No beforeChange hook — askedBy and status are set by the API route
  // using the authenticated user's token ID directly.
  fields: [
    { name: 'title', label: 'عنوان سوال', type: 'text',     required: true },
    { name: 'body',  label: 'متن سوال',   type: 'textarea', required: true },
    {
      name: 'category', label: 'دسته‌بندی', type: 'select', required: true,
      options: [
        { label: 'کیفری',               value: 'criminal' },
        { label: 'حقوقی',               value: 'civil' },
        { label: 'داوری و حل اختلاف',   value: 'arbitration' },
        { label: 'امور حسبی',           value: 'probate' },
        { label: 'دعاوی ارث و ترکه',    value: 'inheritance' },
        { label: 'حقوق کار',            value: 'labor' },
        { label: 'حقوق خانواده',        value: 'family' },
        { label: 'حقوق بانکی',          value: 'banking' },
        { label: 'حقوق بیمه',           value: 'insurance' },
      ],
    },
    {
      name: 'status', label: 'وضعیت', type: 'select', defaultValue: 'pending',
      options: [
        { label: 'در انتظار پاسخ',  value: 'pending' },
        { label: 'پاسخ داده شده',   value: 'answered' },
        { label: 'رد شده',          value: 'rejected' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'askedBy',    label: 'پرسش‌کننده',  type: 'relationship', relationTo: 'users', admin: { readOnly: true, position: 'sidebar' } },
    { name: 'answeredBy', label: 'پاسخ‌دهنده',  type: 'relationship', relationTo: 'users', admin: { position: 'sidebar' } },
    { name: 'answer',     label: 'پاسخ وکیل',   type: 'textarea' },
    { name: 'answeredAt', label: 'تاریخ پاسخ',  type: 'date', admin: { position: 'sidebar' } },
    { name: 'isPublic',   label: 'نمایش عمومی', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
  ],
  timestamps: true,
}
