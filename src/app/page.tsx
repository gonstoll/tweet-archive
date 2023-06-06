import {NextTweet} from 'next-tweet'
import {getTweets} from '~/db/db'
import {classNames} from '~/utils/classnames'
import Search from '../components/Search'

const tagColors = {
  blue: 'bg-blue-100 text-blue-800',
  red: 'bg-red-100 text-red-800',
  green: 'bg-green-100 text-green-800',
  yellow: 'bg-yellow-100 text-yellow-800',
}

export default async function Home({
  searchParams,
}: {
  searchParams: {search: string}
}) {
  const tweets = await getTweets(searchParams.search)

  return (
    <>
      <Search />
      <div className="flex justify-center">
        <div className="gap-4 lg:columns-2 xl:columns-3">
          {tweets.map(t => (
            <div
              key={t.id}
              className="mb-4 break-inside-avoid rounded-md border-1 border-slate-200 p-4"
            >
              <div className="mb-4">
                <NextTweet id={t.tweetId} priority />
              </div>
              <div className="flex flex-wrap gap-2">
                {t.tags?.map(tag => (
                  <span
                    key={tag.name}
                    className={classNames(
                      tagColors[tag.color],
                      'rounded-md px-3 py-1 text-sm'
                    )}
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
              {t.description ? <p className="mt-4">{t.description}</p> : null}
              <p className="mt-4 text-xs text-slate-400">
                {new Date(t.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
