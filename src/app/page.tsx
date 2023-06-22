import Link from 'next/link'
import {Search} from '~/components/search'
import {TagsFilter} from '~/components/tags-filter'
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
      <div className="flex items-center gap-4">
        <TagsFilter tags={tags} />
        <div className="flex-1">
          <Search />
        </div>
        <Link href="tweet/new">Add tweet</Link>
      </div>
      <div className="gap-4 md:columns-2 xl:columns-3">
        {tweets.map(t => (
          <Tweet key={t.id} tweet={t} />
        ))}
      </div>
    </>
  )
}
