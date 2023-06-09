'use server'

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
  await db.insert(tagSchema).values(tag)
  revalidatePath('/')
  return tag
})
