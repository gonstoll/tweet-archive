import {TagsFilter} from '~/components/tags-filter'
import {Tweet} from '~/components/tweet'
import {getTweetById} from '~/db/models/tweet'
import {Foo} from './foo'

export default async function TweetDetail({params}: {params: {id: string}}) {
  const tweet = await getTweetById(params.id)

  return <Tweet tweet={tweet} />
}
