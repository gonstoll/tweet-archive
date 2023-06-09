import Search from '~/components/Search'
import TagsFilter from '~/components/TagsFilter/TagsFilter'
import Tweet from '~/components/Tweet'
import {getTags, getTweets} from '~/db/db'
import {seedTags} from '~/db/seed'

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
