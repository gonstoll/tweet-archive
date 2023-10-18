'use client'
import Link from 'next/link'
import {useRouter} from 'next/navigation'
import * as React from 'react'
import {z} from 'zod'
import {TagsFilter} from '~/components/tags-filter'
import type {Tag} from '~/db/models/tag'
import type {Tweet} from '~/db/models/tweet'

export const newTweetSchema = z.object({
  url: z.string(),
  description: z.string().nullable(),
})

type NewTweet = Omit<Tweet, 'id' | 'userId'> & {tagIds?: Array<number>}
type NewTag = Omit<Tag, 'id' | 'userId'>

type Props = {
  tags: Array<Tag>
  handleCreateTweet(tweet: NewTweet): Promise<void>
  handleCreateTag(tag: NewTag): Promise<void>
  handleDeleteTag(tagId: number): Promise<void>
}

export function TweetForm({
  tags,
  handleCreateTweet,
  handleCreateTag,
  handleDeleteTag,
}: Props) {
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

    await handleCreateTweet({
      ...parsedTweet,
      tagIds,
      createdAt: new Date(),
    })

    router.push('/')
    router.refresh()
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
        createTag={handleCreateTag}
        deleteTag={handleDeleteTag}
      />
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
          Add tweet
        </button>
      </div>
    </form>
  )
}
