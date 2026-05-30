import { CollectionConfig } from 'payload'

export const InstagramPosts: CollectionConfig = {
  slug: 'instagram-posts',
  admin: {
    useAsTitle: 'caption',
    defaultColumns: ['caption', 'postedAt', 'instagramUrl'],
    group: 'اینستاگرام',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) =>
      user?.role === 'founder' || user?.role === 'it_manager',
    update: ({ req: { user } }) =>
      user?.role === 'founder' || user?.role === 'it_manager',
    delete: ({ req: { user } }) =>
      user?.role === 'founder' || user?.role === 'it_manager',
  },
  fields: [
    { name: 'caption', label: 'متن پست', type: 'textarea', required: true },
    { name: 'image', label: 'تصویر', type: 'upload', relationTo: 'media', required: true },
    { name: 'instagramUrl', label: 'لینک اینستاگرام', type: 'text' },
    { name: 'postedAt', label: 'تاریخ انتشار', type: 'date', required: true },
    { name: 'likes', label: 'تعداد لایک', type: 'number', defaultValue: 0 },
  ],
  timestamps: true,
}
