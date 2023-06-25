'use server'

import {auth} from '@clerk/nextjs'
import {Ratelimit} from '@upstash/ratelimit'
import {Redis} from '@upstash/redis'
import {revalidatePath} from 'next/cache'
import {zact} from 'zact/server'
import {z} from 'zod'
import {db} from '~/db/db'
import {tagColors, tag as tagSchema} from '~/db/schema'

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

  const newTag = await db
    .insert(tagSchema)
    .values({...tag, userId: user.userId})

  revalidatePath('/')

  return {id: Number(newTag.insertId), ...tag}
})
