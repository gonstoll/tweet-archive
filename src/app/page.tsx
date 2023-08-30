import Link from 'next/link'
import {Search} from '~/components/search'
import {TagsFilter} from '~/components/tags-filter'
import {Tweet} from '~/components/tweet'
import {createTag, getTags} from '~/db/models/tag'
import {getTweets} from '~/db/models/tweet'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type Props = {
  searchParams: {
    search: string
    tags: string
  }
}

export default async function Home({searchParams}: Props) {
  const tweets = await getTweets(searchParams)
  const tags = await getTags()

  return (
    <>
      <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="lg:w-96">
          <TagsFilter tags={tags} type="filter" createTag={createTag} />
        </div>
        <div className="flex flex-1 items-end gap-4">
          <Search />
          <Link
            href="tweet/new"
            className="flex h-11 items-center justify-center gap-1 whitespace-nowrap rounded-md bg-slate-300 px-8"
          >
            Add<span className='hidden lg:block'>tweet</span>
          </Link>
        </div>
      </div>
      <div className="gap-4 md:columns-2 xl:columns-3">
        {tweets.map(t => (
          <Tweet key={t.id} tweet={t} />
        ))}
      </div>
    </>
  )
}
