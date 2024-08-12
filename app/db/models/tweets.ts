import type {InferSelectModel} from 'drizzle-orm'
import {fetchTweet, type Tweet} from 'react-tweet/api'
import {db} from '..'
import type {tag, tweet} from '../schema'

export type Tag = InferSelectModel<typeof tag>
export type TweetMeta = InferSelectModel<typeof tweet> & {
  tags: Array<Omit<Tag, 'userId'>>
}

export async function getTweets(userId: string) {
  const dbTweets = await db.query.tweet.findMany({
    limit: 20,
    orderBy: ({createdAt}, {desc}) => desc(createdAt),
    where: ({userId: dbUserId}, {eq}) => eq(dbUserId, userId),
    with: {
      tweetsToTags: {
        columns: {tagId: false, tweetId: false},
        with: {
          tag: {
            columns: {id: true, name: true, color: true},
          },
        },
      },
    },
  })

  const transformedDbTweets = dbTweets.map(({tweetsToTags, ...item}) => {
    return {...item, tags: tweetsToTags.map(item => item.tag)}
  })

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
