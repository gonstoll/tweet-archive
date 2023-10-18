'use client'
import {useRouter} from 'next/navigation'
import {useTransition} from 'react'
import {EmbeddedTweet} from 'react-tweet'
import type {Tweet} from 'react-tweet/api'
import type {UserTweet} from '~/db/models/tweet'
import {classNames} from '~/utils/classnames'
import {Tag} from '../tag'

type TweetContent = {
  tweet: UserTweet
  tweetData: Tweet
  deleteTweet(tweetId: number): Promise<void>
}

export function TweetContent({tweet, tweetData, deleteTweet}: TweetContent) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  async function handleDeleteTweet(tweetId: number) {
    startTransition(async () => {
      await deleteTweet(tweetId)
      router.refresh()
    })
  }

  return (
    <div
      key={tweet.id}
      className={classNames(
        'mb-4 break-inside-avoid rounded-md border-1 border-slate-200 p-4',
        {'opacity-50': isPending},
      )}
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
          className="rounded-md border border-red-500 bg-white px-3 py-1 text-sm font-semibold text-red-700 hover:bg-red-50"
          onClick={() => handleDeleteTweet(tweet.id)}
        >
          Delete
        </button>
      </div>
    </div>
  )
}
