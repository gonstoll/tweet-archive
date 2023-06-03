import {connect} from '@planetscale/database'
import {InferModel, eq} from 'drizzle-orm'
import {drizzle} from 'drizzle-orm/planetscale-serverless'
import {ENV} from '~/env'
import * as schema from './schema'

const connection = connect({
  host: ENV.DATABASE_HOST,
  username: ENV.DATABASE_USERNAME,
  password: ENV.DATABASE_PASSWORD,
})

export const db = drizzle(connection, {schema})

export async function getTweets() {
  return await db.select().from(schema.tweets)
}

export async function getTags() {
  // return await db.select().from(schema.tagsToTweets)
  // await db.insert(schema.tweets).values([
  //   {
  //     id: 1,
  //     tweetId: '1648923232937058304',
  //     url: 'https://twitter.com/dan_abramov/status/1648923232937058304',
  //     description: 'Dan Abramov RSC quiz',
  //     createdAt: new Date('2023-06-03'),
  //   },
  //   {
  //     id: 2,
  //     tweetId: '1249937011068129280',
  //     url: 'https://twitter.com/vercel/status/1249937011068129280',
  //     description: 'Vercel tweeting about Next.js 9.4',
  //     createdAt: new Date('2023-06-01'),
  //   },
  //   {
  //     id: 3,
  //     tweetId: '1663166812760965120',
  //     url: 'https://twitter.com/housecor/status/1663166812760965120',
  //     description: 'Cory tweeting about too much consistency',
  //     createdAt: new Date('2023-06-02'),
  //   },
  //   {
  //     id: 4,
  //     tweetId: '1653403198885904387',
  //     url: 'https://twitter.com/mattpocockuk/status/1653403198885904387',
  //     description: 'Matt Pocock showing Prettify utility!',
  //     createdAt: new Date('2023-06-05'),
  //   },
  // ])
  // await db.insert(schema.tags).values([
  //   {id: 1, name: 'vercel', color: 'blue'},
  //   {id: 2, name: 'react', color: 'green'},
  //   {id: 3, name: 'nextjs', color: 'red'},
  //   {id: 4, name: 'typescript', color: 'blue'},
  //   {id: 5, name: 'RSC', color: 'yellow'},
  //   {id: 6, name: 'consistency', color: 'yellow'},
  // ])

  const rows = await db
    .select()
    .from(schema.tagsToTweets)
    .rightJoin(schema.tweets, eq(schema.tagsToTweets.tweetId, schema.tweets.id))
    .leftJoin(schema.tags, eq(schema.tagsToTweets.tagId, schema.tags.id))

  type Tweet = InferModel<typeof schema.tweets>
  type Tag = InferModel<typeof schema.tags>

  const result = rows.reduce<Array<Tweet & {tags?: Array<Tag>}>>((acc, row) => {
    const {tweets, tags, tags_to_tweets} = row

    const tweet = acc.find(t => t.id === tags_to_tweets?.tweetId)

    if (tweet && tags) {
      tweet.tags?.push(tags)
    } else {
      if (tweets) {
        acc.push({
          ...tweets,
          tags: tags ? [tags] : undefined,
        })
      }
    }

    return acc
  }, [])

  return result
}
