import {createTag, getTags} from '~/db/models/tag'
import {createTweet} from '~/db/models/tweet'
import {TweetForm} from './tweet-form'

export default async function NewTweet() {
  const tags = await getTags()

  return (
    <TweetForm tags={tags} createTweet={createTweet} createTag={createTag} />
  )
}
