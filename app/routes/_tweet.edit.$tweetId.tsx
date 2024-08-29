import {useParams} from '@remix-run/react'

export default function EditTweetPage() {
  const params = useParams<{tweetId: string}>()
  return <p>Editing tweet: {params.tweetId}</p>
}
