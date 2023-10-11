import {auth} from '@clerk/nextjs'
import {InferModel, and, exists, inArray, like} from 'drizzle-orm'
import {revalidatePath} from 'next/cache'
import {db, ratelimit} from '../db'
import * as schema from '../schema'
import {Tag} from './tag'

export type Tweet = InferModel<typeof schema.tweet>
export type UserTweet = Tweet & {tags?: Array<Tag>; tweetId: string}
type GetTweetsOpts = {
  search: string
  tags: string
}

export async function getTweets({search = '', tags = ''}: GetTweetsOpts) {
  const {userId} = auth()

  if (!userId) {
    return []
  }

  const transformedTags = tags
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean)

  const filteredTweetsQuery = await db.query.tweet.findMany({
    columns: {
      id: true,
    },
    where: (tweets, {and, sql, eq}) => {
      return and(
        transformedTags.length
          ? sql`json_length(${tweets.tweetsToTags}) > 0`
          : undefined,
        like(tweets.description, `%${search}%`),
        eq(tweets.userId, userId),
      )
    },
    with: {
      tweetsToTags: {
        where: (tweetsToTags, {eq}) => {
          return exists(
            db
              .select()
              .from(schema.tag)
              .where(() => {
                if (transformedTags.length) {
                  return and(
                    inArray(schema.tag.name, transformedTags),
                    eq(tweetsToTags.tagId, schema.tag.id),
                  )
                }
              }),
          )
        },
      },
    },
  })

  const filteredTweetsIds = filteredTweetsQuery.map(t => t.id)

  if (!filteredTweetsIds.length) {
    return []
  }

  const filteredTweetsWithTags = await db.query.tweet.findMany({
    with: {
      tweetsToTags: {
        with: {
          tag: true,
        },
      },
    },
    where: (tweets, {eq, and}) => {
      return and(
        inArray(tweets.id, filteredTweetsIds),
        eq(tweets.userId, userId),
      )
    },
  })

  const userTweets: Array<UserTweet> = []

  for (const {tweetsToTags, ...userTweet} of filteredTweetsWithTags) {
    const tags = tweetsToTags.map(t => t.tag)
    userTweets.push({
      ...userTweet,
      tags,
      tweetId: getTweetId(userTweet.url),
    })
  }

  return userTweets
}

export async function getTweetById(id: string) {
  const tweet = await db.query.tweet.findFirst({
    where: (tweets, {eq}) => eq(tweets.id, Number(id)),
    with: {
      tweetsToTags: {
        with: {
          tag: true,
        },
      },
    },
  })

  if (!tweet) {
    return null
  }

  const tags = tweet.tweetsToTags.map(t => t.tag)
  const {tweetsToTags, ...userTweet} = tweet

  return {
    ...userTweet,
    tags,
    tweetId: getTweetId(userTweet.url),
  }
}

function getTweetId(tweetUrl: string) {
  const tweetId = tweetUrl.split('/').pop()?.split('?').shift()
  const tweetIdRegex = /^(\d+)$/

  if (!tweetId || !tweetIdRegex.test(tweetId)) {
    throw new Error('Invalid tweet URL')
  }

  return tweetId
}

export async function createTweet({
  tagIds,
  ...tweet
}: Omit<Tweet, 'id' | 'userId'> & {tagIds?: Array<number>}) {
  'use server'

  const user = auth()

  if (!user.userId) {
    throw new Error('User not logged in')
  }

  const {success} = await ratelimit.limit(user.userId)

  if (!success) {
    throw new Error('Rate limit exceeded')
  }

  const newTweet = await db
    .insert(schema.tweet)
    .values({...tweet, userId: user.userId})

  if (tagIds?.length) {
    await db
      .insert(schema.tweetsToTags)
      .values(
        tagIds.map(id => ({tweetId: Number(newTweet.insertId), tagId: id})),
      )
  }

  revalidatePath('/')
}
