import {EmbeddedTweet} from 'react-tweet'
import {type Tweet} from 'react-tweet/api'
import {type UserTweet} from '~/db/models/tweet'
import {Tag} from './tag'

async function getTweetData(tweetId: string) {
  const res = await fetch(`https://react-tweet.vercel.app/api/tweet/${tweetId}`)

  if (res.statusText !== 'OK') {
    throw new Error('Failed to fetch tweet data')
  }

  return res.json() as Promise<{data: Tweet}>
}

export async function Tweet({tweet}: {tweet?: UserTweet}) {
  const tweetData = tweet ? await getTweetData(tweet.tweetId) : undefined

  return tweet && tweetData ? (
    <div
      key={tweet.id}
      className="mb-4 break-inside-avoid rounded-md border-1 border-slate-200 p-4"
    >
      <div className="mb-4">
        <EmbeddedTweet tweet={tweetData.data} />
      </div>
      <div className="flex flex-wrap gap-2">
        {tweet.tags?.map(tag => <Tag key={tag.id} tag={tag} />)}
      </div>
      {tweet.description ? <p className="mt-4">{tweet.description}</p> : null}
      <p className="mt-4 text-xs text-slate-400">
        {new Date(tweet.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </p>
    </div>
  ) : (
    <h1>New tweet!</h1>
  )
}
