import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

// Add .js extensions — required for ESM resolution in Node 20+
import { Users }         from './collections/Users.ts'
import { Media }         from './collections/Media.ts'
import { Posts }         from './collections/Posts.ts'
import { Questions }     from './collections/Questions.ts'
import { TeamMembers }   from './collections/TeamMembers.ts'
import { InstagramPosts } from './collections/InstagramPosts.ts'
import { Experiences }   from './collections/Experiences.ts'

const filename = fileURLToPath(import.meta.url)
const dirname  = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname, '..'),
    },
    meta: {
      titleSuffix: '— پنل مدیریت نظری',
    },
  },

  editor: lexicalEditor(),

  collections: [Users, Media, Posts, Questions, TeamMembers, InstagramPosts, Experiences],

  secret: process.env.PAYLOAD_SECRET || 'super-secret-change-in-production',

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  db: mongooseAdapter({
    url: process.env.MONGODB_URI || 'mongodb://localhost:27017/alireza-nazari-law',
    transactionOptions: false,
  }),
})
