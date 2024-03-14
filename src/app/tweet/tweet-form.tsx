import Link from 'next/link'
import {z} from 'zod'
import {TagsFilter} from '~/components/tags-filter'
import type {NewTweet, UpdatedTweet, UserTweet} from '~/db/models/tweet'
import {SubmitButton} from './submit-button'

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

export function TweetForm(props: Props) {
  const initialTags = props.type === 'edit' ? props.tweet.tags : undefined

  async function handleSubmit(formData: FormData) {
    'use server'
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
  }

  return (
    <form action={handleSubmit}>
      <div className="mb-4">
        <label className="text-zinc-900 dark:text-zinc-100">
          Tweet URL
          <input
            type="url"
            name="tweet-url"
            id="tweet-url"
            className="mt-1 block w-full rounded-md border border-zinc-300 bg-zinc-50 p-2 text-zinc-900 placeholder-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            defaultValue={props.type === 'edit' ? props.tweet.url : ''}
          />
        </label>
      </div>
      <div className="mb-4">
        <label className="text-zinc-900 dark:text-zinc-100">
          Description (optional)
          <textarea
            name="tweet-description"
            id="tweet-description"
            rows={3}
            className="mt-1 block w-full rounded-md border border-zinc-300 bg-zinc-50 p-2 text-zinc-900 placeholder-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            defaultValue={
              props.type === 'edit' ? props.tweet.description ?? '' : ''
            }
          />
        </label>
      </div>

      <TagsFilter type="select" initialTags={initialTags} />

      <div className="mt-6 flex items-center justify-end gap-4">
        <Link
          href="/"
          className="rounded-md border border-red-500 bg-zinc-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 dark:border-red-500 dark:bg-zinc-900 dark:text-red-500 dark:hover:bg-red-950"
        >
          Cancel
        </Link>
        <SubmitButton type={props.type} />
      </div>
    </form>
  )
}
