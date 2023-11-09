import {TagsFilter} from '~/components/tags-filter'
import type {NewTweet, UpdatedTweet, UserTweet} from '~/db/models/tweet'
import {TweetFormContent} from './tweet-form'

type CreateTweetProps = {
  type: 'create'
  handleCreateTweet(tweet: NewTweet): Promise<void>
}

type EditTweetProps = {
  type: 'edit'
  tweet: UserTweet
  handleEditTweet(tweet: UpdatedTweet): Promise<void>
}

type Props = CreateTweetProps | EditTweetProps

export function TweetForm(props: Props) {
  const initialTags = props.type === 'edit' ? props.tweet.tags : undefined

  return (
    <TweetFormContent {...props}>
      <TagsFilter type="select" initialTags={initialTags} />
    </TweetFormContent>
  )
}
