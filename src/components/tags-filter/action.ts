'use server'

import {auth} from '@clerk/nextjs'
import {Ratelimit} from '@upstash/ratelimit'
import {Redis} from '@upstash/redis'
import {sql} from 'drizzle-orm'
import {zact} from 'zact/server'
import {z} from 'zod'
import {db} from '~/db/db'
import {tagColors} from '~/db/schema'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(7, '10 s'),
  analytics: true,
})

export const handleCreateTag = zact(
  z.object({
    name: z.string(),
    color: z.enum(tagColors),
  })
)(async tag => {
  // await db.insert(tagSchema).values(tag)
  const user = auth()

  if (!user.userId) {
    throw new Error('User not logged in')
  }

  const {success} = await ratelimit.limit(user.userId)

  if (!success) {
    throw new Error('Rate limit exceeded')
  }

  const statement = sql`insert into tag (name,color) values (${tag.name}, ${tag.color});`
  const res = await db.execute(statement)
  // revalidatePath('/')
  return {id: Number(res.insertId), ...tag}
})
