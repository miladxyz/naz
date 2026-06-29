import { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'publishedAt', '_status'],
    group: 'محتوا',
  },
  versions: { drafts: true },
  access: {
    read: ({ req: { user } }) => {
      const role = (user as any)?.role
      if (role === 'founder' || role === 'lawyer') return true
      return { _status: { equals: 'published' } }
    },
    create: ({ req: { user } }) => {
      const role = (user as any)?.role
      return role === 'founder' || role === 'lawyer'
    },
    update: ({ req: { user } }) => {
      if ((user as any)?.role === 'founder') return true
      return { author: { equals: user?.id } }
    },
    delete: ({ req: { user } }) => (user as any)?.role === 'founder',
  },
  hooks: {
    beforeChange: [
      async ({ req, data, operation }) => {
        if (operation === 'create') data.author = req.user?.id
        return data
      },
    ],
  },
  fields: [
    { name: 'title',   label: 'عنوان', type: 'text', required: true },
    { name: 'slug',    label: 'اسلاگ', type: 'text', unique: true, admin: { position: 'sidebar' } },
    { name: 'excerpt', label: 'خلاصه', type: 'textarea' },
    {
      name: 'content',
      label: 'محتوا',
      type: 'richText',
    },
    { name: 'coverImage', label: 'تصویر شاخص',  type: 'upload',   relationTo: 'media' },
    {
      name: 'category', label: 'دسته‌بندی', type: 'select',
      options: [
        { label: 'کیفری',              value: 'criminal' },
        { label: 'حقوقی',              value: 'civil' },
        { label: 'داوری و حل اختلاف', value: 'arbitration' },
        { label: 'امور حسبی',          value: 'probate' },
        { label: 'دعاوی ارث و ترکه',  value: 'inheritance' },
        { label: 'حقوق کار',           value: 'labor' },
        { label: 'حقوق خانواده',       value: 'family' },
        { label: 'حقوق بانکی',         value: 'banking' },
        { label: 'حقوق بیمه',          value: 'insurance' },
        { label: 'سایر',               value: 'others' },
      ],
    },
    { name: 'author',      label: 'نویسنده',        type: 'relationship', relationTo: 'users',  admin: { readOnly: true, position: 'sidebar' } },
    { name: 'publishedAt', label: 'تاریخ انتشار',   type: 'date',                               admin: { position: 'sidebar' } },
    { name: 'readingTime', label: 'زمان مطالعه (دقیقه)', type: 'number',                        admin: { position: 'sidebar' } },
  ],
  timestamps: true,
}
