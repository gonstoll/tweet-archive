import {revalidatePath} from 'next/cache'
import Link from 'next/link'
import {Search} from '~/components/search'
import {TagsFilter} from '~/components/tags-filter'
import {Tweet} from '~/components/tweet'
import {db} from '~/db/db'
import {createTag, deleteTag, getTags} from '~/db/models/tag'
import {getTweets, getTweetsCount} from '~/db/models/tweet'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type Props = {
  searchParams: Record<string, string | string[] | undefined>
}

export default async function Home({searchParams}: Props) {
  const search =
    typeof searchParams.search === 'string' ? searchParams.search : ''
  const tagsParam =
    typeof searchParams.tags === 'string' ? searchParams.tags : ''

  const totalTweets = await getTweetsCount({search, tags: tagsParam})
  const tweetsPerPage = 3
  const totalPages = Math.ceil(totalTweets / tweetsPerPage)

  const sanitizedSearchParams = {
    search,
    tags: tagsParam,
    page:
      typeof searchParams.page === 'string' &&
      Number(searchParams.page) > 1 &&
      Number(searchParams.page) <= totalPages
        ? Number(searchParams.page)
        : 1,
  }

  const currentSearchParams = new URLSearchParams()

  if (sanitizedSearchParams.search) {
    currentSearchParams.set('search', sanitizedSearchParams.search)
  }

  if (sanitizedSearchParams.tags) {
    currentSearchParams.set('tags', sanitizedSearchParams.tags)
  }

  if (sanitizedSearchParams.page > 1) {
    currentSearchParams.set('page', String(sanitizedSearchParams.page))
  } else {
    currentSearchParams.delete('page')
  }

  const tweets = await getTweets({...sanitizedSearchParams, tweetsPerPage})
  const tags = await getTags()

  async function handleDeleteTag(tagId: number) {
    'use server'
    await deleteTag(tagId)
    revalidatePath('/')
  }

  return (
    <>
      <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="lg:w-96">
          <TagsFilter
            tags={tags}
            type="filter"
            createTag={createTag}
            deleteTag={handleDeleteTag}
          />
        </div>
        <div className="flex flex-1 flex-col gap-8 lg:flex-row lg:items-end lg:gap-24">
          <Search />
          <Link
            href="tweet/new"
            className="flex items-center justify-center whitespace-nowrap rounded-md border border-sky-800 bg-sky-500 px-3 py-2 text-sm font-semibold text-white hover:bg-sky-800"
          >
            Add tweet
          </Link>
        </div>
      </div>
      <div className="gap-4 md:columns-2 xl:columns-3">
        {tweets.map(tweet => (
          <Tweet key={tweet.id} tweet={tweet} />
        ))}
      </div>
      <div className="mt-8 flex flex-col items-center justify-end gap-4 md:flex-row">
        <p>
          Showing{' '}
          <span className="font-semibold">
            {(sanitizedSearchParams.page - 1) * tweetsPerPage + 1}
          </span>{' '}
          to{' '}
          <span className="font-semibold">
            {Math.min(sanitizedSearchParams.page * tweetsPerPage, totalTweets)}
          </span>{' '}
          of <span className="font-semibold">{totalTweets}</span> tweets
        </p>
        <div className="flex items-center gap-2">
          <PreviousPage
            page={sanitizedSearchParams.page}
            currentSearchParams={currentSearchParams}
          />
          <NextPage
            page={sanitizedSearchParams.page}
            totalPages={totalPages}
            currentSearchParams={currentSearchParams}
          />
        </div>
      </div>
    </>
  )
}

function PreviousPage({
  page,
  currentSearchParams,
}: {
  page: number
  currentSearchParams: URLSearchParams
}) {
  const notInFirstPage = page > 1
  const nextPageSearchParams = new URLSearchParams(currentSearchParams)

  if (page > 2) {
    nextPageSearchParams.set('page', String(page - 1))
  } else {
    nextPageSearchParams.delete('page')
  }

  return notInFirstPage ? (
    <Link
      href={`/?${nextPageSearchParams}`}
      className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
    >
      Previous page
    </Link>
  ) : (
    <button
      disabled
      className="cursor-not-allowed rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 opacity-50"
    >
      Previous page
    </button>
  )
}

function NextPage({
  page,
  totalPages,
  currentSearchParams,
}: {
  page: number
  totalPages: number
  currentSearchParams: URLSearchParams
}) {
  const notInLastPage = page < totalPages
  const nextPageSearchParams = new URLSearchParams(currentSearchParams)

  if (page <= totalPages) {
    nextPageSearchParams.set('page', String(page + 1))
  } else {
    nextPageSearchParams.delete('page')
  }

  return notInLastPage ? (
    <Link
      href={`/?${nextPageSearchParams}`}
      className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
    >
      Next page
    </Link>
  ) : (
    <button
      disabled
      className="cursor-not-allowed rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 opacity-50"
    >
      Next page
    </button>
  )
}
