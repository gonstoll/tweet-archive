'use server'

import {auth} from '@clerk/nextjs'
import {Ratelimit} from '@upstash/ratelimit'
import {Redis} from '@upstash/redis'
import {revalidatePath} from 'next/cache'
import {zact} from 'zact/server'
import {z} from 'zod'
import {db} from '~/db/db'
import * as schema from '~/db/schema'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(7, '10 s'),
  analytics: true,
})

const newTweetSchema = z.object({
  url: z.string(),
  description: z.string().optional(),
  tags: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
        color: z.enum(schema.tagColors),
      })
    )
    .optional(),
})

export const handleCreateTweet = zact(newTweetSchema)(
  async ({tags, ...tweet}) => {
    const user = auth()

    if (!user.userId) {
      throw new Error('User not logged in')
    }

    const {success} = await ratelimit.limit(user.userId)

    if (!success) {
      throw new Error('Rate limit exceeded')
    }

    const newTweet = await db
      .insert(schema.tweet)
      .values({...tweet, userId: user.userId, createdAt: new Date()})

    if (tags) {
      await db
        .insert(schema.tweetsToTags)
        .values(
          tags.map(tag => ({tweetId: Number(newTweet.insertId), tagId: tag.id}))
        )
    }

    revalidatePath('/')
  }
)
