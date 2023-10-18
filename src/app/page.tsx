import {revalidatePath} from 'next/cache'
import Link from 'next/link'
import {Search} from '~/components/search'
import {TagsFilter} from '~/components/tags-filter'
import {Tweet} from '~/components/tweet'
import {createTag, deleteTag, getTags} from '~/db/models/tag'
import {getTweets, getTweetsCount} from '~/db/models/tweet'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type Props = {
  searchParams: Record<string, string | string[] | undefined>
}

export default async function Home({searchParams}: Props) {
  const totalTweets = await getTweetsCount()
  const tweetsPerPage = 3
  const totalPages = Math.ceil(totalTweets / tweetsPerPage)

  const transformedSearchParams = {
    search: typeof searchParams.search === 'string' ? searchParams.search : '',
    tags: typeof searchParams.tags === 'string' ? searchParams.tags : '',
    page:
      typeof searchParams.page === 'string' &&
      Number(searchParams.page) > 1 &&
      Number(searchParams.page) <= totalPages
        ? Number(searchParams.page)
        : 1,
  }

  const currentSearchParams = new URLSearchParams()

  if (transformedSearchParams.search) {
    currentSearchParams.set('search', transformedSearchParams.search)
  }

  if (transformedSearchParams.tags) {
    currentSearchParams.set('tags', transformedSearchParams.tags)
  }

  if (transformedSearchParams.page > 1) {
    currentSearchParams.set('page', String(transformedSearchParams.page))
  } else {
    currentSearchParams.delete('page')
  }

  const tweets = await getTweets({...transformedSearchParams, tweetsPerPage})
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
            className="flex items-center whitespace-nowrap rounded-md border border-sky-800 bg-sky-500 px-3 py-2 text-sm font-semibold text-white hover:bg-sky-800"
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
      <div className="mt-8 flex items-center justify-between">
        <p>
          Showing <span>1</span> to <span>3</span> of <span>12</span> tweets
        </p>
        <NextPage
          page={transformedSearchParams.page}
          totalPages={totalPages}
          currentSearchParams={currentSearchParams}
        />
      </div>
    </>
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
    <button disabled>Next page</button>
  )
}
