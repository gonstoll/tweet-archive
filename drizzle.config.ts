import * as dotenv from 'dotenv'
import type {Config} from 'drizzle-kit'

dotenv.config()

export default {
  schema: './src/db/schema.ts',
  out: './drizzle/migrations',
  driver: 'turso',
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_DATABASE_AUTH_TOKEN,
  },
} satisfies Config
