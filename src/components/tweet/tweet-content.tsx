'use client'
import {EmbeddedTweet} from 'react-tweet'
import type {Tweet} from 'react-tweet/api'
import type {UserTweet} from '~/db/models/tweet'
import {Tag} from '../tag'

type TweetContent = {
  tweet: UserTweet
  tweetData: Tweet
  handleDeleteTweet(tweetId: number): Promise<void>
}

export async function TweetContent({
  tweet,
  tweetData,
  handleDeleteTweet,
}: TweetContent) {
  return (
    <div
      key={tweet.id}
      className="mb-4 break-inside-avoid rounded-md border-1 border-slate-200 p-4"
    >
      <div className="mb-4">
        <EmbeddedTweet tweet={tweetData} />
      </div>
      <div className="flex flex-wrap gap-2">
        {tweet.tags?.map(tag => <Tag key={tag.id} tag={tag} />)}
      </div>
      {tweet.description ? <p className="mt-4">{tweet.description}</p> : null}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-slate-400">
          {new Date(tweet.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        <button
          className="rounded-md bg-slate-100 px-3 py-1 text-sm hover:bg-slate-300"
          onClick={() => handleDeleteTweet(tweet.id)}
        >
          Delete
        </button>
      </div>
    </div>
  )
}
