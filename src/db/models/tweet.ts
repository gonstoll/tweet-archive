import {auth} from '@clerk/nextjs'
import {and, eq, exists, inArray, like, type InferModel} from 'drizzle-orm'
import {db, ratelimit} from '../db'
import * as schema from '../schema'
import type {Tag} from './tag'

export type Tweet = InferModel<typeof schema.tweet>
export type UserTweet = Tweet & {tags?: Array<Tag>; tweetId: string}
export type NewTweet = Omit<Tweet, 'id' | 'userId'> & {tagIds?: string}
export type UpdatedTweet = Omit<Tweet, 'id' | 'userId' | 'createdAt'> & {
  tagIds?: string
}

type GetTweetsOpts = {
  search: string
  tags: string
  page: number
  tweetsPerPage: number
}

// This is no bueno, but it's the only way I got it to work
// TODO: Find a better way to do this
export async function getTweetsCount({
  tags,
  search,
}: Omit<GetTweetsOpts, 'page' | 'tweetsPerPage'>) {
  const {userId} = auth()

  if (!userId) {
    throw new Error('You must login to see this content')
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

  return filteredTweetsQuery.length
}

export async function getTweets({
  search,
  tags,
  page,
  tweetsPerPage,
}: GetTweetsOpts) {
  const {userId} = auth()

  if (!userId) {
    throw new Error('You must login to see this content')
  }

  const transformedTags = tags
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean)

  const filteredTweetsQuery = await db.query.tweet.findMany({
    limit: tweetsPerPage,
    offset: (Number(page) - 1) * tweetsPerPage,
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
    orderBy: ({createdAt}, {desc}) => desc(createdAt),
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
        with: {tag: true},
      },
    },
  })

  if (!tweet) {
    throw new Error(`Tweet with id ${id} could not be found`)
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

async function isTweetDuplicated(tweetId: string) {
  const existingTweet = await db.query.tweet.findFirst({
    where: tweets => {
      return and(like(tweets.url, `%${tweetId}%`))
    },
  })

  return Boolean(existingTweet)
}

export async function createTweet({tagIds, ...tweet}: NewTweet) {
  const user = auth()

  if (!user.userId) {
    throw new Error('You must login to see this content')
  }

  const {success} = await ratelimit.limit(user.userId)

  if (!success) {
    throw new Error('Rate limit exceeded')
  }

  const existingTweet = await isTweetDuplicated(getTweetId(tweet.url))

  if (existingTweet) {
    throw new Error('That tweet already exists')
  }

  try {
    const newTweet = await db
      .insert(schema.tweet)
      .values({...tweet, userId: user.userId})

    const tagsArray = tagIds
      ?.split(',')
      .map(tag => tag.trim())
      .filter(Boolean)

    if (tagsArray?.length) {
      await db.insert(schema.tweetsToTags).values(
        tagsArray.map(id => ({
          tweetId: Number(newTweet.insertId),
          tagId: Number(id),
        })),
      )
    }
  } catch (error) {
    console.error(error)
    throw new Error('Something went wrong when creating the tweet')
  }
}

export async function deleteTweet(tweetId: number) {
  const user = auth()

  if (!user.userId) {
    throw new Error('User not logged in')
  }

  const {success} = await ratelimit.limit(user.userId)

  if (!success) {
    throw new Error('Rate limit exceeded')
  }

  try {
    await db.delete(schema.tweet).where(eq(schema.tweet.id, tweetId))
    await db
      .delete(schema.tweetsToTags)
      .where(eq(schema.tweetsToTags.tweetId, tweetId))
  } catch (error) {
    console.error(error)
    throw new Error('Something went wrong when deleting the tweet')
  }
}

export async function editTweet(tweet: UpdatedTweet & {id: string}) {
  const user = auth()

  if (!user.userId) {
    throw new Error('User not logged in')
  }

  const {success} = await ratelimit.limit(user.userId)

  if (!success) {
    throw new Error('Rate limit exceeded')
  }

  const {tagIds, id, ...restTweet} = tweet

  try {
    await db
      .update(schema.tweet)
      .set(restTweet)
      .where(eq(schema.tweet.id, Number(tweet.id)))

    await db
      .delete(schema.tweetsToTags)
      .where(eq(schema.tweetsToTags.tweetId, Number(tweet.id)))

    const tagsArray = tweet.tagIds
      ?.split(',')
      .map(tag => tag.trim())
      .filter(Boolean)

    if (tagsArray?.length) {
      await db.insert(schema.tweetsToTags).values(
        tagsArray.map(id => ({
          tweetId: Number(tweet.id),
          tagId: Number(id),
        })),
      )
    }
  } catch (error) {
    console.error(error)
    throw new Error('Something went wrong when updating the tweet')
  }
}
