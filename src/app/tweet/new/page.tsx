import {revalidatePath} from 'next/cache'
import {redirect} from 'next/navigation'
import {createTweet, type NewTweet} from '~/db/models/tweet'
import {TweetForm} from '../tweet-form'

export default async function NewTweetPage() {
  async function handleCreateTweet(tweet: NewTweet) {
    'use server'
    await createTweet(tweet)
    revalidatePath('/')
    redirect('/')
  }

  return <TweetForm type="create" handleCreateTweet={handleCreateTweet} />
}
