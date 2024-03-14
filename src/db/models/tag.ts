'use server'
import {auth} from '@clerk/nextjs'
import {eq, type InferSelectModel} from 'drizzle-orm'
import {db, ratelimit} from '../db'
import * as schema from '../schema'
import {checkAuth} from '../utils'

export type Tag = InferSelectModel<typeof schema.tag>

export async function getTags() {
  const {userId} = await checkAuth()
  const tags = await db.query.tag.findMany({
    where: (tags, {eq}) => eq(tags.userId, userId),
  })
  return tags
}

export async function createTag(tag: Omit<Tag, 'userId' | 'id'>) {
  const {userId} = await checkAuth(true)
  await db.insert(schema.tag).values({...tag, userId: userId})
}

export async function deleteTag(tagId: number) {
  await checkAuth()
  await db.delete(schema.tag).where(eq(schema.tag.id, tagId))
  await db
    .delete(schema.tweetsToTags)
    .where(eq(schema.tweetsToTags.tagId, tagId))
}
