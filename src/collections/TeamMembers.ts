import { CollectionConfig } from 'payload'

export const TeamMembers: CollectionConfig = {
  slug: 'team-members',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'orderIndex'],
    group: 'تیم',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => (user as any)?.role === 'founder',
    update: ({ req: { user } }) =>
      (user as any)?.role === 'founder' || (user as any)?.role === 'it_manager',
    delete: ({ req: { user } }) => (user as any)?.role === 'founder',
  },
  fields: [
    { name: 'name', label: 'نام', type: 'text', required: true },
    {
      name: 'role', label: 'سمت', type: 'select', required: true,
      options: [
        { label: 'بنیان‌گذار و وکیل ارشد', value: 'founder' },
        { label: 'وکیل',                   value: 'lawyer' },
        { label: 'مدیر فناوری اطلاعات',    value: 'it_manager' },
        { label: 'مدیر مالی',              value: 'financial_manager' },
        { label: 'دستیار حقوقی',           value: 'legal_assistant' },
        {label: 'مسئول امور داخلی', value: 'internal_manager'},
        {label: 'مدیر فنی', value: 'technical_officer'},
        {label: 'کارشناس تولید محتوا', value: 'content_creator'}
      ],
    },
    { name: 'specialization', label: 'تخصص',        type: 'text' },
    { name: 'bio',            label: 'بیوگرافی',    type: 'textarea' },
    { name: 'photo',          label: 'عکس',         type: 'upload', relationTo: 'media' },
    {
      name: 'education', label: 'تحصیلات', type: 'array',
      fields: [
        { name: 'degree',      label: 'مدرک',    type: 'text' },
        { name: 'institution', label: 'دانشگاه', type: 'text' },
        { name: 'year',        label: 'سال',     type: 'number' },
      ],
    },
    { name: 'yearsOfExperience', label: 'سال‌های تجربه',  type: 'number' },
    { name: 'linkedUser',        label: 'حساب کاربری',    type: 'relationship', relationTo: 'users' },
    { name: 'orderIndex',        label: 'ترتیب نمایش',    type: 'number', defaultValue: 99 },
  ],
  timestamps: true,
}
