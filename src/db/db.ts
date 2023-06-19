import {connect} from '@planetscale/database'
import {InferModel, and, eq, inArray, like, or} from 'drizzle-orm'
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
    tweet: Tweet | null
    tag: Tag | null
    tweetWithTag: TweetWithTag | null
  }>
) {
  return rows.reduce<Array<UserTweet>>((acc, row) => {
    const {tweet, tag, tweetWithTag} = row
    const storedTweet = acc.find(t => t.id === tweetWithTag?.tweetId)

    if (!tweet) return acc

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

  const tweetWithTags = await db
    .select()
    .from(schema.tweet)
    .where(like(schema.tweet.description, `%${search}%`))
    .leftJoin(
      schema.tweetWithTag,
      eq(schema.tweetWithTag.tweetId, schema.tweet.id)
    )
    .leftJoin(schema.tag, eq(schema.tweetWithTag.tagId, schema.tag.id))

  const userTweets = getUserTweet(tweetWithTags)

  if (!transformedTags.length) return userTweets

  const filteredTweets = userTweets.filter(tweet => {
    const tweetTags = tweet.tags?.map(tag => tag.name)
    if (!tweetTags) return false
    return tweetTags.length
      ? transformedTags.every(tag => tweetTags.includes(tag))
      : false
  })

  return filteredTweets
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
