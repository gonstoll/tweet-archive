import {auth} from '@clerk/nextjs'
import {InferModel} from 'drizzle-orm'
import {db, ratelimit} from '../db'
import * as schema from '../schema'

export type Tag = InferModel<typeof schema.tag>

export async function getTags() {
  const {userId} = auth()

  if (!userId) {
    return []
  }

  return await db.query.tag.findMany({
    where: (tags, {eq}) => eq(tags.userId, userId),
  })
}

export async function createTag(tag: Omit<Tag, 'userId' | 'id'>) {
  'use server'
  const user = auth()

  if (!user.userId) {
    throw new Error('User not logged in')
  }

  const {success} = await ratelimit.limit(user.userId)

  if (!success) {
    throw new Error('Rate limit exceeded')
  }

  const newTag = await db
    .insert(schema.tag)
    .values({...tag, userId: user.userId})

  // Revalidating creates an issue, where search params are not read correctly from the
  // UI. This might be a bug in Nextjs, for now we are disabling revalidation and
  // relying on optimistic updates.
  // revalidatePath('/')

  return {
    success: true,
    newTag: {
      ...tag,
      id: Number(newTag.insertId),
      userId: user.userId,
    },
  }
}
