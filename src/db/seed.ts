import {db} from './db'
import * as schema from './schema'

export async function seed() {
  await db.insert(schema.tweet).values([
    {
      id: 1,
      tweetId: '1648923232937058304',
      url: 'https://twitter.com/dan_abramov/status/1648923232937058304',
      description: 'Dan Abramov RSC quiz',
      createdAt: new Date('2023-06-03'),
      userId: 'fulanito',
    },
    {
      id: 2,
      tweetId: '1249937011068129280',
      url: 'https://twitter.com/vercel/status/1249937011068129280',
      description: 'Vercel tweeting about Next.js 9.4',
      createdAt: new Date('2023-06-01'),
      userId: 'fulanito',
    },
    {
      id: 3,
      tweetId: '1663166812760965120',
      url: 'https://twitter.com/housecor/status/1663166812760965120',
      description: 'Cory tweeting about too much consistency',
      createdAt: new Date('2023-06-02'),
      userId: 'fulanito',
    },
    {
      id: 4,
      tweetId: '1653403198885904387',
      url: 'https://twitter.com/mattpocockuk/status/1653403198885904387',
      description: 'Matt Pocock showing Prettify utility!',
      createdAt: new Date('2023-06-05'),
      userId: 'fulanito',
    },
  ])
  await db.insert(schema.tag).values([
    {
      id: 1,
      name: 'vercel',
      color: 'blue',
      userId: 'fulanito',
    },
    {
      id: 2,
      name: 'react',
      color: 'green',
      userId: 'fulanito',
    },
    {
      id: 3,
      name: 'nextjs',
      color: 'red',
      userId: 'fulanito',
    },
    {
      id: 4,
      name: 'typescript',
      color: 'orange',
      userId: 'fulanito',
    },
    {
      id: 5,
      name: 'RSC',
      color: 'yellow',
      userId: 'fulanito',
    },
  ])
  await db.insert(schema.tweetsToTags).values([
    {tweetId: 1, tagId: 2, userId: 'fulanito'},
    {tweetId: 1, tagId: 5, userId: 'fulanito'},
    {tweetId: 2, tagId: 1, userId: 'fulanito'},
    {tweetId: 2, tagId: 3, userId: 'fulanito'},
    {tweetId: 4, tagId: 4, userId: 'fulanito'},
  ])
}
