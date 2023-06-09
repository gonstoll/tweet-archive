import Search from '~/components/Search'
import TagsFilter from '~/components/TagsFilter/TagsFilter'
import Tweet from '~/components/Tweet'
import {getTags, getTweets} from '~/db/db'

export default async function Home({
  searchParams,
}: {
  searchParams: {search: string}
}) {
  const tweets = await getTweets(searchParams.search)
  const tags = await getTags()

  return (
    <>
      <div className="flex items-center gap-4">
        <TagsFilter tags={tags} />
        <Search />
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
