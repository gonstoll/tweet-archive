'use server'

import {sql} from 'drizzle-orm'
import {revalidatePath} from 'next/cache'
import {zact} from 'zact/server'
import {z} from 'zod'
import {db} from '~/db/db'
import {tagColors, tag as tagSchema} from '~/db/schema'

export const handleCreateTag = zact(
  z.object({
    name: z.string(),
    color: z.enum(tagColors),
  })
)(async tag => {
  // await db.insert(tagSchema).values(tag)
  const statement = sql`insert into tag (name,color) values (${tag.name}, ${tag.color});`
  const res = await db.execute(statement)
  // revalidatePath('/')
  return {id: Number(res.insertId), ...tag}
})
