import { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.role === 'founder',
    update: ({ req: { user } }) =>
      user?.role === 'founder' || user?.role === 'it_manager',
    delete: ({ req: { user } }) => user?.role === 'founder',
  },
  fields: [
    {
      name: 'name',
      label: 'نام کامل',
      type: 'text',
      required: true,
    },
    {
      name: 'phone',
      label: 'شماره موبایل',
      type: 'text',
      index: true,
      unique: true,
      admin: {
        description: 'مثال: 09121234567',
      },
    },
    {
      name: 'role',
      label: 'نقش',
      type: 'select',
      required: true,
      defaultValue: 'client',
      options: [
        { label: 'بنیان‌گذار', value: 'founder' },
        { label: 'وکیل', value: 'lawyer' },
        { label: 'مدیر فناوری اطلاعات', value: 'it_manager' },
        { label: 'مدیر مالی', value: 'financial_manager' },
        { label: 'موکل', value: 'client' },
      ],
    },
    {
      name: 'specialization',
      label: 'تخصص حقوقی',
      type: 'text',
      admin: {
        condition: (data) => data?.role === 'lawyer' || data?.role === 'founder',
      },
    },
    {
      name: 'bio',
      label: 'بیوگرافی',
      type: 'textarea',
      admin: {
        condition: (data) =>
          ['founder', 'lawyer', 'it_manager', 'financial_manager'].includes(data?.role),
      },
    },
    {
      name: 'avatar',
      label: 'تصویر پروفایل',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (data) =>
          ['founder', 'lawyer', 'it_manager', 'financial_manager'].includes(data?.role),
      },
    },
    {
      name: 'categories',
      label: 'دسته‌بندی‌های تخصصی',
      type: 'select',
      hasMany: true,
      admin: {
        condition: (data) => data?.role === 'lawyer',
      },
      options: [
        { label: 'حقوق خانواده', value: 'familyy' },
        { label: 'حقوق تجاری', value: 'commercial' },
        { label: 'حقوق کیفری', value: 'criminal' },
        { label: 'حقوق ملکی', value: 'property' },
        { label: 'حقوق کار', value: 'labor' },
        { label: 'حقوق بین‌الملل', value: 'international' },
      ],
    },
    {
      name: 'yearsOfExperience',
      label: 'سال‌های تجربه',
      type: 'number',
      admin: {
        condition: (data) => data?.role === 'lawyer' || data?.role === 'founder',
      },
    },
    {
      name: 'orderIndex',
      label: 'ترتیب نمایش',
      type: 'number',
      defaultValue: 99,
    },
  ],
}
