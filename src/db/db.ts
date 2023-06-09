import {connect} from '@planetscale/database'
import {InferModel, eq, inArray, like} from 'drizzle-orm'
import {drizzle} from 'drizzle-orm/planetscale-serverless'
import {ENV} from '~/env'
import * as schema from './schema'

type Tweet = InferModel<typeof schema.tweet>
export type Tag = InferModel<typeof schema.tag>
type TweetWithTag = InferModel<typeof schema.tweetWithTag>
export type UserTweet = Tweet & {tags?: Array<Tag>}

const connection = connect({
  host: ENV.DATABASE_HOST,
  username: ENV.DATABASE_USERNAME,
  password: ENV.DATABASE_PASSWORD,
})

export const db = drizzle(connection, {schema})

function getUserTweet(
  rows: Array<{
    tweet: Tweet
    tag: Tag | null
    tweetWithTag: TweetWithTag | null
  }>
) {
  return rows.reduce<Array<UserTweet>>((acc, row) => {
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
}

export async function getTweets({
  search = '',
  tags = '',
}: {
  search: string
  tags: string
}) {
  const transformedTags = tags
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean)

  // TODO: This is not great, but it works for now. Revist later.
  if (transformedTags.length) {
    const tweetWithTags = await db
      .select()
      .from(schema.tweetWithTag)
      .rightJoin(schema.tweet, eq(schema.tweetWithTag.tweetId, schema.tweet.id))
      .leftJoin(schema.tag, eq(schema.tweetWithTag.tagId, schema.tag.id))
      .where(like(schema.tweet.description, `%${search}%`))
      .where(inArray(schema.tag.name, transformedTags))

    return getUserTweet(tweetWithTags)
  } else {
    const tweetWithTags = await db
      .select()
      .from(schema.tweetWithTag)
      .rightJoin(schema.tweet, eq(schema.tweetWithTag.tweetId, schema.tweet.id))
      .leftJoin(schema.tag, eq(schema.tweetWithTag.tagId, schema.tag.id))
      .where(like(schema.tweet.description, `%${search}%`))

    return getUserTweet(tweetWithTags)
  }
}

export async function getTweetById(id: string) {
  const tweetWithTags = await db
    .select()
    .from(schema.tweetWithTag)
    .rightJoin(schema.tweet, eq(schema.tweetWithTag.tweetId, schema.tweet.id))
    .leftJoin(schema.tag, eq(schema.tweetWithTag.tagId, schema.tag.id))
    .where(eq(schema.tweet.tweetId, id))

  return getUserTweet(tweetWithTags)[0]
}

export async function getTags() {
  return await db.select().from(schema.tag)
}
