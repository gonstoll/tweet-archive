import {getTags} from '~/db/db'
import {handleCreateTweet} from './action'
import {TweetForm} from './tweet-form'
import {handleCreateTag} from '~/components/tags-filter/action'

export default async function NewTweet() {
  const tags = await getTags()

  return (
    <TweetForm
      tags={tags}
      handleCreateTweet={handleCreateTweet}
      handleCreateTag={handleCreateTag}
    />
  )
}
