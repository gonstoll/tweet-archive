'use client'

import Link from 'next/link'
import {useRouter} from 'next/navigation'
import * as React from 'react'
import {ZactAction} from 'zact/server'
import {ZodType, z} from 'zod'
import {TagsFilter} from '~/components/tags-filter'
import {Tag} from '~/db/db'
import {tagColors} from '~/db/schema'

export const newTweetSchema = z.object({
  url: z.string(),
  description: z.string().optional(),
  tags: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
        color: z.enum(tagColors),
      })
    )
    .optional(),
})

type Props = {
  tags: Array<Tag>
  handleCreateTweet: ZactAction<ZodType<any>, void>
  handleCreateTag: ZactAction<ZodType<any>, Omit<Tag, 'userId'>>
}

export function TweetForm({tags, handleCreateTweet, handleCreateTag}: Props) {
  const [selectedTags, setSelectedTags] = React.useState<Array<string>>()
  const [isPending, startTransition] = React.useTransition()

  const router = useRouter()

  function handleSubmit(formData: FormData) {
    const url = formData.get('tweet-url')
    const description = formData.get('tweet-description')
    const tweetTags = tags.filter(tag => selectedTags?.includes(tag.name))

    const parsedTweet = newTweetSchema.parse({
      url,
      description,
      tags: tweetTags,
    })

    handleCreateTweet(parsedTweet).then(() => router.replace('/'))
  }

  return (
    <form action={formData => startTransition(() => handleSubmit(formData))}>
      <div className="mb-4">
        <label>
          Tweet URL
          <input
            type="url"
            name="tweet-url"
            id="tweet-url"
            className="mt-1 block w-full rounded-md border-1 border-slate-200 p-2"
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
          />
        </label>
      </div>
      <TagsFilter
        tags={tags}
        type="select"
        onChange={tags => setSelectedTags(tags)}
        handleCreateTag={handleCreateTag}
      />
      <div className="mt-6 flex items-center justify-end gap-4">
        <Link
          href="/"
          className="flex h-11 items-center justify-center rounded-md bg-red-500 px-8"
        >
          Cancel
        </Link>
        <button
          type="submit"
          className="flex h-11 items-center justify-center rounded-md bg-slate-300 px-8"
        >
          {isPending ? 'Adding tweet...' : 'Add tweet'}
        </button>
      </div>
    </form>
  )
}
