import {connect} from '@planetscale/database'
import {InferModel, eq, like} from 'drizzle-orm'
import {drizzle} from 'drizzle-orm/planetscale-serverless'
import {ENV} from '~/env'
import * as schema from './schema'

type Tweet = InferModel<typeof schema.tweet>
type Tag = InferModel<typeof schema.tag>
type TweetWithTag = InferModel<typeof schema.tweetWithTag>
type UserTweet = Tweet & {tags?: Array<Tag>}

const connection = connect({
  host: ENV.DATABASE_HOST,
  username: ENV.DATABASE_USERNAME,
  password: ENV.DATABASE_PASSWORD,
})

export const db = drizzle(connection, {schema})

function mergeTweetWithTags(
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

export async function getTweetsByQuery(query = '') {
  const tweetWithTags = await db
    .select()
    .from(schema.tweetWithTag)
    .where(like(schema.tweet.description, `%${query}%`))
    .rightJoin(schema.tweet, eq(schema.tweetWithTag.tweetId, schema.tweet.id))
    .leftJoin(schema.tag, eq(schema.tweetWithTag.tagId, schema.tag.id))

  return mergeTweetWithTags(tweetWithTags)
}

export async function getTweets() {
  const tweetWithTags = await db
    .select()
    .from(schema.tweetWithTag)
    .rightJoin(schema.tweet, eq(schema.tweetWithTag.tweetId, schema.tweet.id))
    .leftJoin(schema.tag, eq(schema.tweetWithTag.tagId, schema.tag.id))

  return mergeTweetWithTags(tweetWithTags)
}
