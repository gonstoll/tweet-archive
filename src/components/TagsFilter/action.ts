'use server'

import {zact} from 'zact/server'
import {z} from 'zod'
import {db} from '~/db/db'
import {tag as tagSchema} from '~/db/schema'

export const handleAddTag = zact(
  z.object({
    tag: z.object({
      name: z.string(),
      color: z.enum(['red', 'blue', 'green', 'yellow']),
    }),
  })
)(async ({tag}) => {
  await db.insert(tagSchema).values(tag)
})
