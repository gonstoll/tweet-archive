import {NextTweet} from 'next-tweet'
import {getTweets} from '~/db/db'
import {classNames} from '~/utils/classnames'

type Tweet = {
  id: string
  url: string
  description?: string
  createdAt: string
  tags: Array<{
    id: number
    name: string
    color: 'blue' | 'red' | 'green' | 'yellow'
  }>
}

const TWEETS = [
  {
    id: '1648923232937058304',
    url: 'https://twitter.com/dan_abramov/status/1648923232937058304',
    description: 'Dan Abramov RSC quiz',
    tags: [
      {id: 135, name: 'react', color: 'green'},
      {id: 579, name: 'RSC', color: 'yellow'},
    ],
    createdAt: '2023-06-03T19:00:00.000Z',
  },
  {
    id: '1249937011068129280',
    url: 'https://twitter.com/vercel/status/1249937011068129280',
    description: 'Vercel tweeting about Next.js 9.4',
    tags: [
      {id: 123, name: 'vercel', color: 'blue'},
      {id: 345, name: 'nextjs', color: 'red'},
    ],
    createdAt: '2023-06-01T19:00:00.000Z',
  },
  {
    id: '1663166812760965120',
    url: 'https://twitter.com/housecor/status/1663166812760965120',
    description: 'Cory tweeting about too much consistency',
    tags: [{id: 789, name: 'consistency', color: 'yellow'}],
    createdAt: '2023-06-02T19:00:00.000Z',
  },
  {
    id: '1653403198885904387',
    url: 'https://twitter.com/mattpocockuk/status/1653403198885904387',
    description: 'Matt Pocock showing Prettify utility!',
    tags: [{id: 567, name: 'typescript', color: 'blue'}],
    createdAt: '2023-06-05T19:00:00.000Z',
  },
  {
    id: '1648585529716269056',
    url: 'https://twitter.com/diegohaz/status/1648585529716269056',
    tags: [{id: 135, name: 'react', color: 'green'}],
    createdAt: '2023-06-05T19:00:00.000Z',
  },
] satisfies Array<Tweet>

const tagColors = {
  blue: 'bg-blue-100 text-blue-800',
  red: 'bg-red-100 text-red-800',
  green: 'bg-green-100 text-green-800',
  yellow: 'bg-yellow-100 text-yellow-800',
}

export default async function Home() {
  const tweets = await getTweets()

  return (
    <div className="flex justify-center">
      <div className="columns-3 gap-4 lg:grid-cols-2 xl:grid-cols-tweet-xl">
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
  )
}
