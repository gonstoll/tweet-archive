import {Outlet, useLocation} from '@remix-run/react'
import {Separator} from '~/components/ui/separator'

export default function TweetLayout() {
  const location = useLocation()
  const tweetId = location.pathname.split('/').pop()
  const isNewTweet = tweetId === 'new'

  return (
    <div className="mx-auto mt-4 w-full max-w-96">
      <h2 className="mb-2 text-xl font-bold">
        {isNewTweet ? 'Add tweet' : `Edit tweet ${tweetId}`}
      </h2>
      <Separator className="mb-4" />
      <Outlet />
    </div>
  )
}
