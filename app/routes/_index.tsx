import {getAuth} from '@clerk/remix/ssr.server'
import {redirect, type LoaderFunctionArgs} from '@remix-run/node'
import {useLoaderData} from '@remix-run/react'
import {eq} from 'drizzle-orm'
import {db} from '../db'
import {tweet} from '../db/schema'

export async function loader(args: LoaderFunctionArgs) {
  const {userId} = await getAuth(args)

  if (!userId) {
    return redirect('/sign-in')
  }

  const tweets = await db.select().from(tweet).where(eq(tweet.userId, userId))
  return {tweets}
}

export default function Index() {
  const {tweets} = useLoaderData<typeof loader>()

  return <pre>{JSON.stringify(tweets, null, 2)}</pre>
}
