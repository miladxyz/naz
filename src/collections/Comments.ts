import { CollectionConfig } from 'payload'

export const Comments: CollectionConfig = {
  slug: 'comments',
  admin: {
    useAsTitle: 'authorName',
    defaultColumns: ['authorName', 'post', 'status', 'createdAt'],
    group: 'محتوا',
  },
  access: {
    // Anyone can submit a comment
    create: () => true,
    // Only admins/founders can read all; public reads via API route (approved only)
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
      name: 'authorName',
      type: 'text',
      required: true,
      label: 'نام',
    },
    {
      name: 'authorEmail',
      type: 'email',
      label: 'ایمیل (نمایش داده نمی‌شود)',
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
