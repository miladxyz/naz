import { CollectionConfig } from 'payload'

/**
 * OtpCodes — temporary OTP records.
 * Each doc lives for OTP_TTL_SECONDS (default 120s) and is deleted after verification.
 * We enforce uniqueness on phone via a beforeChange hook.
 */
export const OtpCodes: CollectionConfig = {
  slug: 'otp-codes',
  admin: {
    hidden: true, // hide from Payload admin UI
  },
  access: {
    read:   () => false,
    create: () => false,
    update: () => false,
    delete: () => false,
  },
  fields: [
    {
      name: 'phone',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'code',
      type: 'text',
      required: true,
    },
    {
      name: 'expiresAt',
      type: 'date',
      required: true,
    },
    {
      name: 'attempts',
      type: 'number',
      defaultValue: 0,
    },
  ],
  hooks: {
    // Delete any previous OTP for the same phone before inserting a new one
    beforeChange: [
      async ({ operation, data, req }) => {
        if (operation === 'create') {
          const existing = await req.payload.find({
            collection: 'otp-codes',
            where: { phone: { equals: data.phone } },
            limit: 100,
            overrideAccess: true,
          })
          for (const doc of existing.docs) {
            await req.payload.delete({
              collection: 'otp-codes',
              id:         doc.id,
              overrideAccess: true,
            })
          }
        }
        return data
      },
    ],
  },
}
