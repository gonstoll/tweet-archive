import {auth} from '@clerk/nextjs'
import {ratelimit} from './db'

export async function checkAuth(rateLimit?: boolean) {
  const {userId} = auth()

  if (!userId) {
    throw new Error('You must login to see this content')
  }

  if (rateLimit) {
    const {success} = await ratelimit.limit(userId)
    if (!success) throw new Error('Rate limit exceeded')
  }

  return {userId}
}
