'use client'
import Image from 'next/image'
import {useRouter} from 'next/navigation'
import {useTransition} from 'react'
import type {Tweet} from 'react-tweet/api'
import type {UserTweet} from '~/db/models/tweet'
import {classNames} from '~/utils/classnames'
import {Tag} from '../tag'

type TweetContent = {
  tweet: UserTweet
  tweetData: Tweet
  deleteTweet(tweetId: number): Promise<void>
}

function TweetContent({tweetData}: {tweetData: Tweet}) {
  const tweetDate = new Date(tweetData.created_at)

  return (
    <div className="relative rounded-xl border bg-white shadow-md">
      <div className="w-full flex-col p-8 md:flex">
        <div className="flex items-center">
          <Image
            className="rounded-full"
            src={tweetData.user.profile_image_url_https}
            alt={`${tweetData.user.name}'s profile picture`}
            height="40"
            style={{
              aspectRatio: '40/40',
              objectFit: 'cover',
            }}
            width="40"
          />
          <div className="ml-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-black dark:text-white">
              {tweetData.user.name}
            </p>
            <p className="text-gray-400 dark:text-gray-300">
              @{tweetData.user.screen_name}
            </p>
          </div>
        </div>
        <p className="mt-4 text-gray-500 dark:text-gray-300">
          {tweetData.text}
        </p>
        <div className="mt-6 flex items-center justify-between">
          <div className="flex space-x-2 text-gray-400 dark:text-gray-300">
            <div className="flex items-center">
              <svg
                className=" h-6 w-6 text-red-500"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
              <span className="ml-1 text-red-500">
                {tweetData.favorite_count}
              </span>
            </div>
            <div className="flex items-center">
              <svg
                className=" h-6 w-6 text-green-500"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
              </svg>
              <span className="ml-1 text-green-500">
                {tweetData.conversation_count}
              </span>
            </div>
          </div>
          <div className="text-gray-400 dark:text-gray-300">
            {tweetDate.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export function TweetContainer({tweet, tweetData, deleteTweet}: TweetContent) {
  // TODO: Update tweet content with a custom component (inspo: https://v0.dev/t/ZXXB7Tv)
  console.log('tweetData', tweetData)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  async function handleDeleteTweet(tweetId: number) {
    startTransition(async () => {
      await deleteTweet(tweetId)
      router.refresh()
    })
  }

  return (
    <div className={classNames({'opacity-50': isPending})}>
      <TweetContent tweetData={tweetData} />
      <div className="-mt-4 rounded-xl bg-slate-100 p-8 pb-6 pt-10">
        {tweet.tags?.length ? (
          <div className="mb-4 flex flex-wrap gap-2">
            {tweet.tags.map(tag => (
              <Tag key={tag.id} tag={tag} />
            ))}
          </div>
        ) : null}
        {tweet.description ? <p className="mb-4">{tweet.description}</p> : null}
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Added to archive on{' '}
            {new Date(tweet.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <button
            className="rounded-md border border-red-500 bg-white px-3 py-1 text-sm text-red-700 hover:bg-red-50"
            onClick={() => handleDeleteTweet(tweet.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
