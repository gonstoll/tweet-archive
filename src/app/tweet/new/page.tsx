import {getTags} from '~/db/db'
import {TweetForm} from './tweet-form'

export default async function NewTweet() {
  const tags = await getTags()

  return <TweetForm tags={tags} />
}
