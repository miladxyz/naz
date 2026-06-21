import { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card',      width: 768, height: 500, position: 'centre' },
      { name: 'hero',      width: 1200, height: 630, position: 'centre' },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) =>
      user?.role === 'founder' || user?.role === 'it_manager',
    delete: ({ req: { user } }) =>
      user?.role === 'founder' || user?.role === 'it_manager',
  },
  fields: [
    {
      name: 'alt',
      label: 'متن جایگزین',
      type: 'text',
    },
  ],
}
