'use server'
import {auth} from '@clerk/nextjs'
import {InferModel, eq} from 'drizzle-orm'
import {db, ratelimit} from '../db'
import * as schema from '../schema'

export type Tag = InferModel<typeof schema.tag>

export async function getTags() {
  const {userId} = auth()

  if (!userId) {
    return []
  }

  const tags = await db.query.tag.findMany({
    where: (tags, {eq}) => eq(tags.userId, userId),
  })

  return tags
}

export async function createTag(tag: Omit<Tag, 'userId' | 'id'>) {
  const user = auth()

  if (!user.userId) {
    throw new Error('User not logged in')
  }

  const {success} = await ratelimit.limit(user.userId)

  if (!success) {
    throw new Error('Rate limit exceeded')
  }

  await db.insert(schema.tag).values({...tag, userId: user.userId})
}

export async function deleteTag(tagId: number) {
  const user = auth()

  if (!user.userId) {
    throw new Error('User not logged in')
  }

  const {success} = await ratelimit.limit(user.userId)

  if (!success) {
    throw new Error('Rate limit exceeded')
  }

  await db.delete(schema.tag).where(eq(schema.tag.id, tagId))
  await db
    .delete(schema.tweetsToTags)
    .where(eq(schema.tweetsToTags.tagId, tagId))
}
