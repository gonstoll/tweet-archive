import {createTag, deleteTag, getTags} from '~/db/models/tag'
import {createTweet} from '~/db/models/tweet'
import {TweetForm} from './tweet-form'
import {revalidatePath} from 'next/cache'

export default async function NewTweet() {
  const tags = await getTags()

  async function handleCreateTag(tag: any) {
    'use server'
    await createTag(tag)
    revalidatePath('/tweet/new')
  }

  async function handleCreateTweet(tweet: any) {
    'use server'
    await createTweet(tweet)
    revalidatePath('/')
  }

  async function handleDeleteTag(tagId: number) {
    'use server'
    await deleteTag(tagId)
    revalidatePath('/tweet/new')
  }

  return (
    <TweetForm
      tags={tags}
      handleCreateTweet={handleCreateTweet}
      handleCreateTag={handleCreateTag}
      handleDeleteTag={handleDeleteTag}
    />
  )
}
