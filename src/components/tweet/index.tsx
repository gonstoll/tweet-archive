import {revalidatePath} from 'next/cache'
import type {Tweet} from 'react-tweet/api'
import {deleteTweet, type UserTweet} from '~/db/models/tweet'
import {TweetContainer} from './tweet-content'

async function getTweetData(tweetId: string) {
  const res = await fetch(`https://react-tweet.vercel.app/api/tweet/${tweetId}`)

  if (res.statusText !== 'OK') {
    return // Tweet was deleted
  }

  return res.json() as Promise<{data: Tweet}>
}

export async function Tweet({tweet}: {tweet: UserTweet}) {
  const tweetData = await getTweetData(tweet.tweetId)

  async function handleDeleteTweet(tweetId: number) {
    'use server'
    await deleteTweet(tweetId)
    revalidatePath('/')
  }

  if (!tweetData) {
    return null
  }

  return (
    <TweetContainer
      tweet={tweet}
      tweetData={tweetData.data}
      deleteTweet={handleDeleteTweet}
    />
  )
}
