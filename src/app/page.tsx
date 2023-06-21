import {Search} from '~/components/search'
import {TagsFilter} from '~/components/tags-filter'
import {Tweet} from '~/components/tweet'
import {getTags, getTweets} from '~/db/db'

export default async function Home({
  searchParams,
}: {
  searchParams: {search: string; tags: string}
}) {
  const tweets = await getTweets(searchParams)
  const tags = await getTags()

  return (
    <>
      <div className="flex items-center gap-4">
        <TagsFilter tags={tags} />
        <div className="flex-1">
          <Search />
        </div>
      </div>
      <div className="flex justify-center">
        <div className="gap-4 lg:columns-2 xl:columns-3">
          {tweets.map(t => (
            <Tweet key={t.id} tweet={t} />
          ))}
        </div>
      </div>
    </>
  )
}
