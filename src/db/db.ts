import {createClient} from '@libsql/client'
import {Ratelimit} from '@upstash/ratelimit'
import {Redis} from '@upstash/redis'
import {drizzle} from 'drizzle-orm/libsql'
import {ENV} from '~/env'
import * as schema from './schema'

const connection = createClient({
  url: ENV.TURSO_DATABASE_URL,
  authToken: ENV.TURSO_DATABASE_AUTH_TOKEN,
})

export const db = drizzle(connection, {schema})

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(7, '10 s'),
  analytics: true,
})
