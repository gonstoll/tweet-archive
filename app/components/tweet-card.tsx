import {Link} from '@remix-run/react'
import {EllipsisVertical, SquareArrowOutUpRight} from 'lucide-react'
import type {MediaDetails, Tweet} from 'react-tweet/api'
import type {TweetMeta} from '~/db/models/tweets'
import {classNames} from '~/utils/classnames'
import {enrichTweet} from '~/utils/tweet'
import {Badge} from './ui/badge'
import {Button, buttonVariants} from './ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import {Skeleton} from './ui/skeleton'

function getTweetUrl(handle: string, tweetId: string) {
  return `https://x.com/${handle}/status/${tweetId}`
}

export function TweetCard({
  tweetData,
  tweetMeta,
}: {
  tweetData: Tweet
  tweetMeta: Omit<TweetMeta, 'createdAt'> & {createdAt: string}
}) {
  const enrichedTweet = enrichTweet(tweetData)

  const tweetDate = new Date(tweetData.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  })

  return (
    <Card className="overflow-hidden shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <a href={getTweetUrl(tweetData.user.screen_name, tweetData.id_str)}>
            <div className="flex items-center gap-2">
              <img
                width="40"
                height="40"
                src={tweetData.user.profile_image_url_https}
                alt={`${tweetData.user.screen_name}'s profile`}
                className="aspect-square rounded-full object-cover"
              />
              <div className="flex flex-col">
                <CardTitle className="mb-auto text-base">
                  {tweetData.user.name}
                </CardTitle>
                <CardDescription>@{tweetData.user.screen_name}</CardDescription>
              </div>
            </div>
          </a>

          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost" className="w-9 px-0">
                <EllipsisVertical size={24} className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end">
              <DropdownMenuItem asChild>
                <Link to={`/tweet/${tweetMeta.id}`}>Edit</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent>
        {enrichedTweet.entities.map((item, i) => {
          switch (item.type) {
            case 'hashtag':
            case 'mention':
            case 'url':
            case 'symbol':
              return (
                <a
                  key={i}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-500 dark:text-sky-600"
                >
                  {item.text}
                </a>
              )
            case 'media':
              // Media text is currently never displayed, some tweets however might have indices
              // that do match `display_text_range` so for those cases we ignore the content.
              return
            default:
              // We use `dangerouslySetInnerHTML` to preserve the text encoding.
              // https://github.com/vercel-labs/react-tweet/issues/29
              return (
                <span
                  key={i}
                  className="mb-4 overflow-hidden overflow-ellipsis whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{__html: item.text}}
                />
              )
          }
        })}

        {tweetData.mediaDetails ? (
          <div className="mt-2">
            <TweetMedia mediaDetails={tweetData.mediaDetails} />
          </div>
        ) : null}

        {tweetData.quoted_tweet ? (
          <a
            href={getTweetUrl(
              tweetData.quoted_tweet.user.screen_name,
              tweetData.quoted_tweet.id_str,
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="my-2 block"
          >
            <QuotedTweet {...tweetData.quoted_tweet} />
          </a>
        ) : null}

        <div className="mt-4">
          <p className="text-xs text-muted-foreground">{tweetDate}</p>

          <div
            role="none"
            data-orientation="horizontal"
            className="my-1 h-[1px] w-full shrink-0 bg-border"
          />

          <div className="flex gap-2">
            <TweetStats type="likes" count={tweetData.favorite_count} />
            <TweetStats type="retweet" count={tweetData.conversation_count} />
          </div>
        </div>

        <Link
          to={getTweetUrl(tweetData.user.screen_name, tweetData.id_str)}
          className={classNames(
            'mt-4 w-full border-dashed shadow-sm',
            buttonVariants({variant: 'outline'}),
          )}
        >
          Go to tweet <SquareArrowOutUpRight size={15} className="ml-2" />
        </Link>
      </CardContent>

      <div
        role="none"
        data-orientation="horizontal"
        className="h-[1px] w-full shrink-0 bg-border"
      />

      <CardFooter className="block bg-secondary px-6 py-4">
        {tweetMeta.tags.length > 0 ? (
          <ul className="mb-2 flex items-center gap-1">
            {tweetMeta.tags.map(tag => (
              <li key={tag.id}>
                <Badge variant={tag.color}>{tag.name}</Badge>
              </li>
            ))}
          </ul>
        ) : null}

        <p className="text-sm text-secondary-foreground">
          {tweetMeta.description}
        </p>
      </CardFooter>
    </Card>
  )
}

function TweetStats({
  count,
  type = 'likes',
}: {
  count: number
  type: 'likes' | 'retweet'
}) {
  const likeClassNames = 'text-red-500 dark:text-red-600'
  const retweetClassNames = 'text-green-500 dark:text-green-600'

  return (
    <div className="flex items-center">
      <svg
        className={classNames('h-3 w-3', {
          [likeClassNames]: type === 'likes',
          [retweetClassNames]: type === 'retweet',
        })}
        fill="none"
        height="24"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        {type === 'likes' ? (
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        ) : (
          <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
        )}
      </svg>
      <span className="ml-1 text-xs text-muted-foreground">{count}</span>
    </div>
  )
}

function TweetMedia({mediaDetails}: {mediaDetails: Array<MediaDetails>}) {
  return (
    <div
      className={classNames('relative grid overflow-hidden rounded-md', {
        'grid-cols-2': mediaDetails.length === 2,
        'grid-cols-3': mediaDetails.length === 3,
        'grid-cols-4': mediaDetails.length > 3,
      })}
    >
      {mediaDetails.map(m => {
        switch (m.type) {
          case 'photo': {
            return (
              <a
                key={m.media_url_https}
                href={m.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <img
                  key={m.url}
                  src={m.media_url_https}
                  alt={m.ext_alt_text || 'Image'}
                  width={m.sizes.small.w}
                  height={m.sizes.small.h}
                />
              </a>
            )
          }

          case 'video': {
            return (
              <a
                key={m.media_url_https}
                href={m.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <img
                  key={m.url}
                  src={m.media_url_https}
                  alt="Video"
                  width={m.sizes.small.w}
                  height={m.sizes.small.h}
                />
              </a>
            )
          }

          default: {
            return null
          }
        }
      })}
    </div>
  )
}

function QuotedTweet({text, user}: Pick<Tweet, 'user' | 'text'>) {
  return (
    <Card className="block shadow-md hover:bg-secondary">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center gap-2">
          <img
            width="30"
            height="30"
            src={user.profile_image_url_https}
            alt={`${user.name}'s profile`}
            className="aspect-square rounded-full object-cover"
          />
          <div className="flex flex-col">
            <CardTitle className="mb-auto text-xs font-semibold">
              {user.name}
            </CardTitle>
            <CardDescription>@{user.screen_name}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="whitespace-pre-wrap text-sm text-secondary-foreground">
          {text}
        </p>
      </CardContent>
    </Card>
  )
}

export function TweetSkeleton() {
  return (
    <Card className="overflow-hidden shadow">
      <CardHeader>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex flex-col">
            <Skeleton className="mb-auto h-4 w-[150px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="my-2 h-4 w-[150px]" />
        <Skeleton className="h-4 w-[200px]" />
      </CardContent>
      <CardFooter className="block bg-secondary px-6 py-4">
        <Skeleton className="mb-2 h-3 w-[220px]" />
        <Skeleton className="h-3 w-[190px]" />
      </CardFooter>
    </Card>
  )
}
