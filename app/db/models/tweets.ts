import {eq, inArray, type InferSelectModel} from 'drizzle-orm'
import {fetchTweet, type Tweet} from 'react-tweet/api'
import {db} from '..'
import type {tweet} from '../schema'
import {tag} from '../schema'
import type {Tag} from './tags'

export type TweetMeta = InferSelectModel<typeof tweet> & {
  tags: Array<Omit<Tag, 'userId'>>
}

export async function getTweets(request: Request, userId: string) {
  const url = new URL(request.url)
  const search = url.searchParams.get('q') ?? ''
  const tagsSearchParam = url.searchParams.getAll('tags') ?? []

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
              .from(tag)
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
    return []
  }

  const filteredTweetsWithTags = await db.query.tweet.findMany({
    with: {
      tweetsToTags: {
        with: {tag: true},
      },
    },
    limit: 10,
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

  return userTweets
}

function getTweetId(tweetUrl: string) {
  const tweetId = tweetUrl.split('/').pop()?.split('?').shift()
  const tweetIdRegex = /^(\d+)$/

  if (!tweetId || !tweetIdRegex.test(tweetId)) {
    throw new Error('Invalid tweet URL')
  }

  return tweetId
}
