import { CollectionConfig } from 'payload'

export const Comments: CollectionConfig = {
  slug: 'comments',
  admin: {
    useAsTitle: 'authorName',
    defaultColumns: ['authorName', 'post', 'status', 'createdAt'],
    group: 'محتوا',
  },
  access: {
    create: () => true,
    read: ({ req: { user } }) => {
      const role = (user as any)?.role
      return role === 'founder' || role === 'lawyer' || role === 'it_manager'
    },
    update: ({ req: { user } }) => {
      const role = (user as any)?.role
      return role === 'founder' || role === 'lawyer' || role === 'it_manager'
    },
    delete: ({ req: { user } }) => {
      const role = (user as any)?.role
      return role === 'founder' || role === 'it_manager'
    },
  },
  fields: [
    {
      name: 'post',
      type: 'relationship',
      relationTo: 'posts',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'parentComment',
      type: 'relationship',
      relationTo: 'comments',
      required: false,
      label: 'پاسخ به نظر',
      admin: { position: 'sidebar' },
    },
    {
      name: 'authorName',
      type: 'text',
      required: true,
      label: 'نام',
    },
    {
      name: 'authorPhone',
      type: 'text',
      required: true,
      label: 'شماره تماس (نمایش داده نمی‌شود)',
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
      label: 'متن نظر',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      label: 'وضعیت',
      options: [
        { label: 'در انتظار تأیید', value: 'pending'  },
        { label: 'تأیید شده',        value: 'approved' },
        { label: 'رد شده',           value: 'rejected' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
  timestamps: true,
}
