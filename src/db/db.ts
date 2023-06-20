import {connect} from '@planetscale/database'
import {InferModel, and, exists, inArray, like, sql} from 'drizzle-orm'
import {drizzle} from 'drizzle-orm/planetscale-serverless'
import {ENV} from '~/env'
import * as schema from './schema'

type Tweet = InferModel<typeof schema.tweet>
export type Tag = InferModel<typeof schema.tag>
type TweetWithTag = InferModel<typeof schema.tweetsToTags>
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

  // const relevantTweetIds = await db.query.tweet.findMany({
  //   where: ({tags}) => inArray(),
  // })

  // const tweets = await db.query.tweet.findMany({
  //   // where: ({description}) => like(description, `%${search}%`),
  //   where: (tweet, {and}) => {
  //     if (transformedTags.length) {
  //       return and(like(tweet.description, `%${search}%`))
  //     }
  //   },
  //   with: {
  //     tweetsToTags: {
  //       where: (tweetsToTags, {eq}) => {
  //         return exists(
  //           db
  //             .select()
  //             .from(schema.tag)
  //             .where(({name}) => {
  //               if (transformedTags.length) {
  //                 return and(
  //                   inArray(schema.tag.name, transformedTags),
  //                   eq(tweetsToTags.tagId, schema.tag.id)
  //                 )
  //               }
  //             })
  //         )
  //       },
  //     },
  //   },
  // })

  // console.dir(tweets, {depth: null})

  // const tweetWithTags = await db
  //   .select()
  //   .from(schema.tweet)
  //   .leftJoin(
  //     schema.tweetWithTag,
  //     eq(schema.tweetWithTag.tweetId, schema.tweet.id)
  //   )
  //   .leftJoin(schema.tag, eq(schema.tweetWithTag.tagId, schema.tag.id))
  //   .where(({tweet, tag}) => {
  //     // if (transformedTags.length) {
  //     //   return and(
  //     //     inArray(tag.name, transformedTags),
  //     //     like(tweet.description, `%${search}%`)
  //     //   )
  //     // }
  //     return like(tweet.description, `%${search}%`)
  //   })

  // return getUserTweet(tweetWithTags)

  const result = await db.query.tweet.findMany({
    where: (tweets, {and, sql}) =>
      and(
        transformedTags.length
          ? sql`json_length(${tweets.tweetsToTags}) > 0`
          : undefined,
        like(tweets.description, `%${search}%`)
      ),
    with: {
      tweetsToTags: {
        where: (tweetsToTags, {eq}) =>
          exists(
            db
              .select()
              .from(schema.tag)
              .where(() => {
                if (transformedTags.length) {
                  return and(
                    inArray(schema.tag.name, transformedTags),
                    eq(tweetsToTags.tagId, schema.tag.id)
                  )
                }
              })
          ),
      },
    },
  })

  console.dir(result, {depth: null})

  const relevantIds = result?.map(x => x.id)

  if (result.length === 0) {
    return []
  }

  // get tweets with tags
  const relevantTweets = await db.query.tweet.findMany({
    with: {
      tweetsToTags: {
        with: {
          tag: true,
        },
      },
    },
    where: (tweets, {}) => inArray(tweets.id, relevantIds),
  })

  return toTweets(relevantTweets) // shape, flatten, map etc..
}

function toTweets(relevantTweets: any[]) {
  const tweets: UserTweet[] = []

  for (const tweet of relevantTweets) {
    const tags = (tweet.tweetsToTags as any[]).flatMap(x => x.tag)
    tweets.push({
      ...tweet,
      tags: tags,
    })
  }

  return tweets
}

// export async function getTweetById(id: string) {
//   const tweetWithTags = await db
//     .select()
//     .from(schema.tweetWithTag)
//     .rightJoin(schema.tweet, eq(schema.tweetWithTag.tweetId, schema.tweet.id))
//     .leftJoin(schema.tag, eq(schema.tweetWithTag.tagId, schema.tag.id))
//     .where(eq(schema.tweet.tweetId, id))

//   return getUserTweet(tweetWithTags)[0]
// }

export async function getTags() {
  return await db.select().from(schema.tag)
}
