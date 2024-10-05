import {getAuth} from '@clerk/remix/ssr.server'
import type {LoaderFunctionArgs} from '@remix-run/node'
import {eq, inArray, type InferSelectModel} from 'drizzle-orm'
import {fetchTweet, type Tweet} from 'react-tweet/api'
import {db} from '..'
import * as schema from '../schema'
import type {Tag} from './tags'

export type TweetMeta = InferSelectModel<typeof schema.tweet> & {
  tags: Array<Omit<Tag, 'userId'>>
}
export type NewTweet = Pick<TweetMeta, 'url' | 'description'> & {
  tagIds?: Array<string>
}
export type UpdatedTweet = Pick<TweetMeta, 'url' | 'description'> & {
  tagIds?: Array<string>
  id: number
}

export async function getTweet(tweetId: number) {
  const tweet = await db.query.tweet.findFirst({
    where: (tweets, {eq}) => eq(tweets.id, Number(tweetId)),
    with: {
      tweetsToTags: {
        with: {tag: true},
      },
    },
  })

  if (!tweet) {
    throw new Error(`Tweet with id ${tweetId} could not be found`)
  }

  const tags = tweet.tweetsToTags.map(t => t.tag)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {tweetsToTags, ...userTweet} = tweet

  return {
    ...userTweet,
    tags,
    tweetId: getTweetId(userTweet.url),
  }
}

export async function getTweets(request: Request, userId: string) {
  const url = new URL(request.url)
  const search = url.searchParams.get('q') ?? ''
  const tagsSearchParam = url.searchParams.getAll('tags') ?? []
  const $skip = Number(url.searchParams.get('$skip')) || 0
  const $top = Number(url.searchParams.get('$top')) || 10

  const filteredTweetsQuery = await db.query.tweet.findMany({
    orderBy: ({createdAt}, {desc}) => desc(createdAt),
    columns: {id: true},
    where: (tweets, {and, eq, like}) => {
      return and(
        like(tweets.description, `%${search}%`),
        eq(tweets.userId, userId),
      )
    },
    with: {
      tweetsToTags: {
        columns: {tagId: false, tweetId: false},
        with: {
          tag: {
            columns: {id: true, name: true, color: true},
          },
        },
        where: (tweetsToTags, {exists, inArray, and}) => {
          return exists(
            db
              .select()
              .from(schema.tag)
              .where(tag =>
                and(
                  eq(tag.id, tweetsToTags.tagId),
                  inArray(tag.name, tagsSearchParam),
                ),
              ),
          )
        },
      },
    },
  })

  const filteredTweetIds = filteredTweetsQuery
    .filter(t => {
      if (tagsSearchParam.length) {
        return Boolean(t.tweetsToTags.length)
      }
      return true
    })
    .map(t => t.id)

  if (!filteredTweetIds.length) {
    return {
      tweets: [],
      totalTweets: 0,
    }
  }

  const filteredTweetsWithTags = await db.query.tweet.findMany({
    with: {
      tweetsToTags: {
        with: {tag: true},
      },
    },
    limit: $top,
    offset: $skip,
    orderBy: ({createdAt}, {desc}) => desc(createdAt),
    where: (tweets, {eq, and}) => {
      return and(
        inArray(tweets.id, filteredTweetIds),
        eq(tweets.userId, userId),
      )
    },
  })

  const transformedDbTweets = filteredTweetsWithTags.map(
    ({tweetsToTags, ...item}) => {
      return {...item, tags: tweetsToTags.map(item => item.tag)}
    },
  )

  const userTweets: Array<{
    meta: TweetMeta
    data: Tweet
  }> = []

  for (const dbTweet of transformedDbTweets) {
    const tweetId = getTweetId(dbTweet.url)
    const {data, notFound, tombstone} = await fetchTweet(tweetId)

    // notFound === deleted tweet
    // tombstone === tweet was made private
    if (notFound || tombstone) {
      continue
    }

    if (data) {
      userTweets.push({meta: dbTweet, data})
    }
  }

  return {
    tweets: userTweets,
    totalTweets: filteredTweetIds.length,
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
    where: (tweets, {and, like}) => {
      return and(like(tweets.url, `%${tweetId}%`))
    },
  })

  return Boolean(existingTweet)
}

export async function createTweet(
  loaderArgs: LoaderFunctionArgs,
  {tagIds, ...restNewTweet}: NewTweet,
) {
  const user = await getAuth(loaderArgs)

  if (!user.userId) {
    throw new Error('You must login to create a tweet')
  }

  const existingTweet = await isTweetDuplicated(getTweetId(restNewTweet.url))

  if (existingTweet) {
    throw new Error('That tweet already exists')
  }

  try {
    const createdTweet = await db
      .insert(schema.tweet)
      .values({...restNewTweet, userId: user.userId, createdAt: new Date()})
      .returning({id: schema.tweet.id})

    if (tagIds?.length) {
      await db.insert(schema.tweetsToTags).values(
        tagIds.map(id => ({
          tweetId: Number(createdTweet[0].id),
          tagId: Number(id),
        })),
      )
    }
  } catch (error) {
    console.error(error)
    throw new Error('Something went wrong when creating the tweet')
  }
}

export async function editTweet(
  loaderArgs: LoaderFunctionArgs,
  tweet: UpdatedTweet,
) {
  const user = await getAuth(loaderArgs)

  if (!user.userId) {
    throw new Error('You must login to create a tweet')
  }

  const {tagIds, id, ...restTweet} = tweet

  try {
    await db
      .update(schema.tweet)
      .set(restTweet)
      .where(eq(schema.tweet.id, Number(id)))

    await db
      .delete(schema.tweetsToTags)
      .where(eq(schema.tweetsToTags.tweetId, Number(id)))

    if (tagIds?.length) {
      await db.insert(schema.tweetsToTags).values(
        tagIds.map(id => ({
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
