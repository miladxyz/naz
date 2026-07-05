import { CollectionConfig } from 'payload'

export const Experiences: CollectionConfig = {
  slug: 'experiences',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'outcome', 'year'],
    group: 'محتوا',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) =>
      (user as any)?.role === 'founder' || (user as any)?.role === 'lawyer',
    update: ({ req: { user } }) =>
      (user as any)?.role === 'founder' || (user as any)?.role === 'lawyer',
    delete: ({ req: { user } }) => (user as any)?.role === 'founder',
  },
  fields: [
    { name: 'title',   label: 'عنوان پرونده', type: 'text',     required: true },
    { name: 'summary', label: 'خلاصه',        type: 'textarea', required: true },
    { name: 'story',   label: 'شرح کامل',     type: 'textarea' },
    {
      name: 'category', label: 'دسته‌بندی', type: 'select',
      options: [
        { label: 'کیفری',    value: 'criminal' },
        { label: 'حقوقی',      value: 'civil' },
        { label: 'داوری و حل اختلاف',      value: 'arbitration' },
        { label: 'امور حسبی',       value: 'probate' },
        { label: 'دعاوی ارث و ترکه',        value: 'inheritance' },
        { label: 'حقوق کار', value: 'labor' },
        { label: 'حقوق خانواده', value: 'family' },
        { label: 'حقوق بانکی', value: 'banking' },
        { label: 'حقوق بیمه', value: 'insurance' },
        { label: 'عمومی', value: 'others' },
      ],
    },
    {
      name: 'outcome', label: 'نتیجه', type: 'select',
      options: [
        { label: 'موفقیت‌آمیز', value: 'successful' },
        { label: 'توافقی',      value: 'settled' },
        { label: 'آموزنده',     value: 'educational' },
      ],
    },
    { name: 'year',          label: 'سال',            type: 'number' },
    { name: 'relatedLawyer', label: 'وکیل مربوطه',    type: 'relationship', relationTo: 'team-members' },
    { name: 'isFeatured',    label: 'نمایش در صفحه اصلی', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
  ],
  timestamps: true,
}
