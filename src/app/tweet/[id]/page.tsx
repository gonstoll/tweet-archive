import {Tweet} from '~/components/tweet'
import {getTweetById} from '~/db/models/tweet'

export default async function TweetDetail({params}: {params: {id: string}}) {
  const tweet = await getTweetById(params.id)

  return <Tweet tweet={tweet} />
}
