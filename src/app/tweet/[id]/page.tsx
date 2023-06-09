import Tweet from '~/components/Tweet'
import {getTweetById} from '~/db/db'

export default async function TweetDetail({params}: {params: {id: string}}) {
  const tweet = await getTweetById(params.id)
  return <Tweet tweet={tweet} />
}
