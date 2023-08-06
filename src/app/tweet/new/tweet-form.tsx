'use client'

import Link from 'next/link'
import {useRouter} from 'next/navigation'
import * as React from 'react'
import {z} from 'zod'
import {TagsFilter} from '~/components/tags-filter'
import {type Tag} from '~/db/models/tag'
import {type Tweet} from '~/db/models/tweet'

export const newTweetSchema = z.object({
  url: z.string(),
  description: z.string().nullable(),
})

type Props = {
  tags: Array<Tag>
  createTweet: (
    tweet: Omit<Tweet, 'id' | 'userId'> & {tagIds?: Array<number>}
  ) => Promise<void>
  createTag: (
    tag: Omit<Tag, 'userId' | 'id'>
  ) => Promise<{success: boolean; newTag: Tag}>
}

export function TweetForm({tags, createTweet, createTag}: Props) {
  const [selectedTags, setSelectedTags] = React.useState<Array<string>>()

  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    const url = formData.get('tweet-url')
    const description = formData.get('tweet-description')
    const tagIds = tags
      .filter(tag => selectedTags?.includes(tag.name))
      .map(t => t.id)

    const parsedTweet = newTweetSchema.parse({
      url,
      description,
    })

    await createTweet({
      ...parsedTweet,
      tagIds,
      createdAt: new Date(),
    })

    router.push('/')
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
        createTag={createTag}
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
          Add tweet
        </button>
      </div>
    </form>
  )
}
