'use client'
import Image from 'next/image'
import {useRouter} from 'next/navigation'
import {useTransition} from 'react'
import type {MediaDetails, Tweet} from 'react-tweet/api'
import type {UserTweet} from '~/db/models/tweet'
import {classNames} from '~/utils/classnames'
import {Tag} from '../tag'

type TweetContent = {
  tweet: UserTweet
  tweetData: Tweet
  deleteTweet(tweetId: number): Promise<void>
}

function getTweetUrl(handle: string, tweetId: string) {
  return `https://x.com/${handle}/status/${tweetId}`
}

function TweetMedia({mediaDetails}: {mediaDetails: Array<MediaDetails>}) {
  return (
    <div
      className={classNames('relative grid overflow-hidden rounded-md', {
        'grid-cols-2': mediaDetails.length === 2,
        'grid-cols-3': mediaDetails.length === 3,
        'grid-cols-4': mediaDetails.length > 3,
      })}
    >
      {mediaDetails.map(m => {
        switch (m.type) {
          case 'photo': {
            return (
              <a
                href={m.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
                key={m.media_url_https}
              >
                <Image
                  key={m.url}
                  src={m.media_url_https}
                  alt={m.ext_alt_text || 'Image'}
                  width={m.sizes.small.w}
                  height={m.sizes.small.h}
                />
              </a>
            )
          }

          case 'video': {
            return (
              <a
                href={m.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
                key={m.url}
              >
                <Image
                  key={m.url}
                  src={m.media_url_https}
                  alt="Video"
                  width={m.sizes.small.w}
                  height={m.sizes.small.h}
                />
              </a>
            )
          }
          default: {
            return null
          }
        }
      })}
    </div>
  )
}

function QuotedTweet({text, user}: Pick<Tweet, 'user' | 'text'>) {
  return (
    <>
      <div className="flex items-center gap-2">
        <Image
          className="rounded-full"
          src={user.profile_image_url_https}
          alt={`${user.name}'s profile picture`}
          height="30"
          style={{
            aspectRatio: '30/30',
            objectFit: 'cover',
          }}
          width="30"
        />
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-black">
            {user.name}
          </p>
          <p className="text-gray-400">@{user.screen_name}</p>
        </div>
      </div>
      <p className="mt-4 text-gray-500 dark:text-gray-300">{text}</p>
    </>
  )
}

function TweetContent({tweetData}: {tweetData: Tweet}) {
  const tweetDate = new Date(tweetData.created_at)

  return (
    <div className="relative rounded-xl border bg-white p-8 shadow-md">
      <a
        href={`https://x.com/${tweetData.user.screen_name}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-4"
      >
        <Image
          className="rounded-full"
          src={tweetData.user.profile_image_url_https}
          alt={`${tweetData.user.name}'s profile picture`}
          height="40"
          width="40"
          style={{
            aspectRatio: '40/40',
            objectFit: 'cover',
          }}
        />
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-black group-hover:hover:underline">
            {tweetData.user.name}
          </p>
          <p className="text-gray-400 group-hover:hover:underline">
            @{tweetData.user.screen_name}
          </p>
        </div>
      </a>

      <p className="mt-4 text-gray-600">{tweetData.text}</p>

      {tweetData.mediaDetails ? (
        <div className="mt-2">
          <TweetMedia mediaDetails={tweetData.mediaDetails} />
        </div>
      ) : null}

      {tweetData.quoted_tweet ? (
        <a
          href={getTweetUrl(
            tweetData.quoted_tweet.user.screen_name,
            tweetData.quoted_tweet.id_str,
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 block rounded-md border bg-gray-50 p-4 text-sm shadow-md hover:bg-gray-100"
        >
          <QuotedTweet {...tweetData.quoted_tweet} />
        </a>
      ) : null}

      <div className="mb-2 mt-4 border-b pb-2 text-sm text-gray-400">
        {tweetDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        })}
      </div>

      <div className="mb-6 flex items-center">
        <div className="flex gap-2">
          <div className="flex items-center">
            <svg
              className="h-6 w-6 text-red-500"
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
              className="h-6 w-6 text-green-500"
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
      </div>

      <a
        href={getTweetUrl(tweetData.user.screen_name, tweetData.id_str)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
      >
        Go to tweet
      </a>
    </div>
  )
}

export function TweetContainer({tweet, tweetData, deleteTweet}: TweetContent) {
  console.log('logging tweetData', tweetData)
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
        {tweet.description ? (
          <p className="mb-2 text-sm text-gray-700">{tweet.description}</p>
        ) : null}
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Archived on{' '}
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
