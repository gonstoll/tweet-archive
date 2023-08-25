import {Tweet as ReactTweet} from 'react-tweet'
import {type UserTweet} from '~/db/models/tweet'
import {Tag} from './tag'

export function Tweet({tweet}: {tweet?: UserTweet}) {
  return tweet ? (
    <div
      key={tweet.id}
      className="mb-4 break-inside-avoid rounded-md border-1 border-slate-200 p-4"
    >
      <div className="mb-4">
        <ReactTweet id={String(tweet.tweetId)} />
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
