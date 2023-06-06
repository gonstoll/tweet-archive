import {UserTweet} from '~/db/db'

export default function Tweet({id, tweet}: {id?: string; tweet?: UserTweet}) {
  return id ? <h1>Tweet: {id}!!</h1> : <h1>New tweet!</h1>
}
