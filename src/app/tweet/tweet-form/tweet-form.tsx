'use client'
import Link from 'next/link'
import {useRouter} from 'next/navigation'
import * as React from 'react'
import {z} from 'zod'
import type {NewTweet, UpdatedTweet, UserTweet} from '~/db/models/tweet'

export const newTweetSchema = z.object({
  url: z.string(),
  description: z.string().nullable(),
  tagIds: z.string().optional(),
})

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

export function TweetFormContent({
  children,
  ...props
}: React.PropsWithChildren<Props>) {
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    const url = formData.get('tweet-url')
    const description = formData.get('tweet-description')
    const tagIds = formData.get('tag-ids')

    const parsedTweet = newTweetSchema.parse({
      url,
      description,
      tagIds,
    })

    if (props.type === 'create') {
      await props.handleCreateTweet({
        ...parsedTweet,
        createdAt: new Date(),
      })
    }

    if (props.type === 'edit') {
      await props.handleEditTweet(parsedTweet)
    }

    // router.push('/')
    // router.refresh()
  }

  return (
    <form action={handleSubmit}>
      <div className="mb-4">
        <label>
          Tweet URL
          <input
            type="url"
            name="tweet-url"
            id="tweet-url"
            className="mt-1 block w-full rounded-md border-1 border-slate-200 p-2"
            defaultValue={props.type === 'edit' ? props.tweet.url : ''}
          />
        </label>
      </div>
      <div className="mb-4">
        <label>
          Description (optional)
          <textarea
            name="tweet-description"
            id="tweet-description"
            rows={3}
            className="mt-1 block w-full rounded-md border-1 border-slate-200 p-2"
            defaultValue={
              props.type === 'edit' ? props.tweet.description ?? '' : ''
            }
          />
        </label>
      </div>

      {/* TagsFilter slot */}
      {children}

      <div className="mt-6 flex items-center justify-end gap-4">
        <Link
          href="/"
          className="rounded-md border border-red-500 bg-white px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
        >
          Cancel
        </Link>
        <button
          type="submit"
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
        >
          {props.type === 'create' ? 'Add tweet' : 'Save changes'}
        </button>
      </div>
    </form>
  )
}
