import Link from 'next/link'
import {Search} from '~/components/search'
import {TagsFilter} from '~/components/tags-filter'
import {handleCreateTag} from '~/components/tags-filter/action'
import {Tweet} from '~/components/tweet'
import {getTags, getTweets} from '~/db/db'

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
      <div className="mb-4 flex items-center gap-4">
        <div className="w-96">
          <TagsFilter
            tags={tags}
            type="filter"
            handleCreateTag={handleCreateTag}
          />
        </div>
        <div className="flex flex-1 items-end gap-4">
          <Search />
          <Link
            href="tweet/new"
            className="flex h-11 items-center justify-center whitespace-nowrap rounded-md bg-slate-300 px-8"
          >
            Add tweet
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
