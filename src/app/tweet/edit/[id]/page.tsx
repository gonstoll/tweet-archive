import {revalidatePath} from 'next/cache'
import {editTweet, getTweetById, type UpdatedTweet} from '~/db/models/tweet'
import {TweetForm} from '../../tweet-form'
import {redirect} from 'next/navigation'

export default async function EditTweetPage({params}: {params: {id: string}}) {
  const tweet = await getTweetById(params.id)

  async function handleEditTweet(tweet: UpdatedTweet) {
    'use server'
    await editTweet({...tweet, id: params.id})
    revalidatePath('/')
    redirect('/')
  }

  return (
    <TweetForm type="edit" handleEditTweet={handleEditTweet} tweet={tweet} />
  )
}
