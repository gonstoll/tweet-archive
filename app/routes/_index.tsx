import {getAuth} from '@clerk/remix/ssr.server'
import {redirect, type LoaderFunctionArgs} from '@remix-run/node'
import {Form, useLoaderData, useSearchParams, useSubmit} from '@remix-run/react'
import {CirclePlus, ListFilter, X} from 'lucide-react'
import * as React from 'react'
import {TweetCard} from '~/components/tweet-card'
import {Button} from '~/components/ui/button'
import {Input} from '~/components/ui/input'
import {getTweets} from '~/db/models/tweets'

export async function loader(args: LoaderFunctionArgs) {
  const {userId} = await getAuth(args)

  if (!userId) {
    return redirect('/sign-in')
  }

  const tweets = await getTweets(args.request, userId)

  return {tweets}
}

export default function Index() {
  const {tweets} = useLoaderData<typeof loader>()

  return (
    <section>
      <div className="mb-4">
        <Filters />
      </div>
      <ul className="mx-auto w-full justify-center gap-8 md:columns-2 lg:columns-3">
        {tweets.map(tweet => {
          return (
            <li key={tweet.meta.id} className="mb-8 break-inside-avoid">
              <TweetCard tweetData={tweet.data} tweetMeta={tweet.meta} />
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function Filters() {
  const submit = useSubmit()
  const [searchParams, setSearchParams] = useSearchParams()
  const formRef = React.useRef<HTMLFormElement>(null)
  const search = searchParams.get('q')
  const tags = searchParams.getAll('tags')
  const isFiltered = Boolean(search || tags.length)

  function resetForm() {
    setSearchParams('')
    formRef.current?.reset()
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Form
          ref={formRef}
          method="get"
          onChange={e => submit(e.currentTarget)}
        >
          <Input
            type="text"
            name="q"
            placeholder="Filter tweets..."
            className="flex h-8 w-[150px] rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 lg:w-[250px]"
          />
        </Form>
        <Button
          size="sm"
          variant="outline"
          className="h-8 border-dashed shadow-sm"
        >
          <ListFilter size={15} className="mr-2" /> Tags
        </Button>
        {isFiltered ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-8"
            type="submit"
            onClick={resetForm}
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        ) : null}
      </div>
      <Button variant="default" size="sm" className="h-8 shadow-sm">
        <CirclePlus size={15} className="mr-2" /> Add tweet
      </Button>
    </div>
  )
}
