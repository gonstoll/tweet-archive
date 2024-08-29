import {getAuth} from '@clerk/remix/ssr.server'
import {redirect, type LoaderFunctionArgs} from '@remix-run/node'
import {
  Link,
  useLoaderData,
  useNavigation,
  useSearchParams,
} from '@remix-run/react'
import {CirclePlus} from 'lucide-react'
import type * as React from 'react'
import {PaginationBar} from '~/components/pagination-bar'
import {TagsFilter} from '~/components/tags-filter'
import {TweetCard, TweetSkeleton} from '~/components/tweet-card'
import {Button} from '~/components/ui/button'
import {Input} from '~/components/ui/input'
import {getTags} from '~/db/models/tags'
import {getTweets} from '~/db/models/tweets'

export async function loader(args: LoaderFunctionArgs) {
  const {userId} = await getAuth(args)

  if (!userId) {
    return redirect('/sign-in')
  }

  const {tweets, totalTweets} = await getTweets(args.request, userId)
  const tags = await getTags(userId)

  return {tweets, tags, totalTweets}
}

export default function Index() {
  const {tweets, totalTweets} = useLoaderData<typeof loader>()
  const navigation = useNavigation()
  const isLoading = navigation.state === 'loading'

  return (
    <section>
      <div className="mb-4">
        <Filters />
      </div>
      <ul className="mx-auto mb-8 w-full justify-center gap-8 md:columns-2 lg:columns-3">
        {isLoading
          ? Array.from({length: 20}).map((_, i) => (
              <li key={i} className="mb-8 break-inside-avoid">
                <TweetSkeleton />
              </li>
            ))
          : tweets.map(tweet => {
              return (
                <li key={tweet.meta.id} className="mb-8 break-inside-avoid">
                  <TweetCard tweetData={tweet.data} tweetMeta={tweet.meta} />
                </li>
              )
            })}
      </ul>
      <PaginationBar total={totalTweets} />
    </section>
  )
}

function Filters() {
  const {tags} = useLoaderData<typeof loader>()
  const [searchParams, setSearchParams] = useSearchParams()
  const searchParamsMap = {
    search: searchParams.get('q'),
    tags: searchParams.getAll('tags'),
  }

  function searchTweets(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchParams(prev => {
      prev.set('q', e.target.value)
      return prev
    })
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Input
          name="q"
          type="search"
          placeholder="Filter tweets..."
          className="flex h-8 w-[150px] rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 lg:w-[250px]"
          value={searchParamsMap.search || ''}
          onChange={searchTweets}
        />
        <TagsFilter tags={tags} />
      </div>
      <Button asChild variant="default" size="sm" className="h-8 shadow-sm">
        <Link to="new">
          <CirclePlus size={15} className="mr-2" /> Add tweet
        </Link>
      </Button>
    </div>
  )
}
