import {connect} from '@planetscale/database'
import {InferModel, eq} from 'drizzle-orm'
import {drizzle} from 'drizzle-orm/planetscale-serverless'
import {ENV} from '~/env'
import * as schema from './schema'

type Tweet = InferModel<typeof schema.tweet>
type Tag = InferModel<typeof schema.tag>
type TweetWithTag = Tweet & {tags?: Array<Tag>}

const connection = connect({
  host: ENV.DATABASE_HOST,
  username: ENV.DATABASE_USERNAME,
  password: ENV.DATABASE_PASSWORD,
})

export const db = drizzle(connection, {schema})

export async function seed() {
  await db.insert(schema.tweet).values([
    {
      id: 1,
      tweetId: '1648923232937058304',
      url: 'https://twitter.com/dan_abramov/status/1648923232937058304',
      description: 'Dan Abramov RSC quiz',
      createdAt: new Date('2023-06-03'),
    },
    {
      id: 2,
      tweetId: '1249937011068129280',
      url: 'https://twitter.com/vercel/status/1249937011068129280',
      description: 'Vercel tweeting about Next.js 9.4',
      createdAt: new Date('2023-06-01'),
    },
    {
      id: 3,
      tweetId: '1663166812760965120',
      url: 'https://twitter.com/housecor/status/1663166812760965120',
      description: 'Cory tweeting about too much consistency',
      createdAt: new Date('2023-06-02'),
    },
    {
      id: 4,
      tweetId: '1653403198885904387',
      url: 'https://twitter.com/mattpocockuk/status/1653403198885904387',
      description: 'Matt Pocock showing Prettify utility!',
      createdAt: new Date('2023-06-05'),
    },
  ])
  await db.insert(schema.tag).values([
    {id: 1, name: 'vercel', color: 'blue'},
    {id: 2, name: 'react', color: 'green'},
    {id: 3, name: 'nextjs', color: 'red'},
    {id: 4, name: 'typescript', color: 'blue'},
    {id: 5, name: 'RSC', color: 'yellow'},
    {id: 6, name: 'consistency', color: 'yellow'},
  ])
  await db.insert(schema.tweetWithTag).values([
    {tweetId: 1, tagId: 2},
    {tweetId: 1, tagId: 5},
    {tweetId: 2, tagId: 1},
    {tweetId: 2, tagId: 3},
    {tweetId: 3, tagId: 6},
    {tweetId: 4, tagId: 4},
  ])
}

export async function getTweets() {
  const tweetWithTags = await db
    .select()
    .from(schema.tweetWithTag)
    .rightJoin(schema.tweet, eq(schema.tweetWithTag.tweetId, schema.tweet.id))
    .leftJoin(schema.tag, eq(schema.tweetWithTag.tagId, schema.tag.id))

  const result = tweetWithTags.reduce<Array<TweetWithTag>>((acc, row) => {
    const {tweet, tag, tweetWithTag} = row
    const storedTweet = acc.find(t => t.id === tweetWithTag?.tweetId)

    // If there is a tweet already in the array, push the new tag to its tags array
    if (storedTweet && tag) {
      storedTweet.tags?.push(tag)
    }

    // If the tweet is not in the array, push it with the tag
    if (!storedTweet && tag) {
      acc.push({
        ...tweet,
        tags: [tag],
      })
    }

    // If the tweet is not in the array and there is no tag, push it without the tag
    if (!storedTweet && !tag) {
      acc.push(tweet)
    }

    return acc
  }, [])

  return result
}
