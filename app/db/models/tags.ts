import {eq, type InferSelectModel} from 'drizzle-orm'
import {db} from '..'
import {tag} from '../schema'

export type Tag = InferSelectModel<typeof tag>

export async function getTags(userId: string) {
  const tags = await db
    .select()
    .from(tag)
    .where(({userId: dbUserId}) => eq(dbUserId, userId))
  return tags
}
