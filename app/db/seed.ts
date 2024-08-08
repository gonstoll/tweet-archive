import {createClient} from '@libsql/client'
import {drizzle} from 'drizzle-orm/libsql'
import * as schema from './schema'
import {tag, tweet, tweetsToTags} from './schema'

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_DATABASE_AUTH_TOKEN,
})

const db = drizzle(client, {schema})

const userId = process.env.CLERK_USER_ID ?? 'fulanito'

const tweetsData = [
  {
    id: 1,
    description: 'Dan Abramov RSC quiz',
    url: 'https://twitter.com/dan_abramov/status/1648923232937058304',
    createdAt: new Date('2023-06-03'),
    userId,
  },
  {
    id: 4,
    description: 'Matt Pocock showing Prettify utility!',
    url: 'https://twitter.com/mattpocockuk/status/1653403198885904387',
    createdAt: new Date('2023-06-05'),
    userId,
  },
  {
    id: 59,
    description:
      'Lee Robinson about React Server Components, and how client components are not bad',
    url: 'https://twitter.com/leeerob/status/1670472706746208256?s=20',
    createdAt: new Date('2023-06-27'),
    userId,
  },
  {
    id: 61,
    description: 'Omit on each member of a union snippet',
    url: 'https://twitter.com/mattpocockuk/status/1673733512577384448?s=46&t=gJdY9yFl9i4SUuTU583eEg',
    createdAt: new Date('2023-07-01'),
    userId,
  },
  {
    id: 62,
    description:
      'Ryan Florence and reasons why to use tailwind, and why traditional CSS sucks',
    url: 'https://twitter.com/ryanflorence/status/1673847474941997056?s=46&t=gJdY9yFl9i4SUuTU583eEg',
    createdAt: new Date('2023-07-06'),
    userId,
  },
  {
    id: 63,
    description:
      'Pedro Cattori sharing 3 youtube videos about Remix new Dev Server',
    url: 'https://twitter.com/pcattori/status/1673848073573871617?s=46&t=gJdY9yFl9i4SUuTU583eEg',
    createdAt: new Date('2023-07-06'),
    userId,
  },
  {
    id: 64,
    description: 'Differentiate Typescript errors from ESLint errros',
    url: 'https://twitter.com/housecor/status/1674456771031707655?s=46&t=gJdY9yFl9i4SUuTU583eEg',
    createdAt: new Date('2023-07-08'),
    userId,
  },
  {
    id: 65,
    description: 'Tailwind and CSS variables, for better dark mode',
    url: 'https://twitter.com/steventey/status/1677339375645126659?s=46&t=gJdY9yFl9i4SUuTU583eEg',
    createdAt: new Date('2023-07-09'),
    userId,
  },
  {
    id: 66,
    description: 'Avoid loading flashes',
    url: 'https://twitter.com/samselikoff/status/1675923225341992962?s=46&t=gJdY9yFl9i4SUuTU583eEg',
    createdAt: new Date('2023-07-09'),
    userId,
  },
  {
    id: 67,
    description:
      'Function that accepts an object with limited parameters, and no extra ones',
    url: 'https://twitter.com/manantank_/status/1677610004743086080?s=46&t=gJdY9yFl9i4SUuTU583eEg',
    createdAt: new Date('2023-07-11'),
    userId,
  },
  {
    id: 68,
    description:
      'Raise function to narrow down the type and remove undefined or null out of it',
    url: 'https://twitter.com/mattpocockuk/status/1676162572095979522?s=46&t=gJdY9yFl9i4SUuTU583eEg',
    createdAt: new Date('2023-07-11'),
    userId,
  },
  {
    id: 69,
    description: 'Newer express alternative',
    url: 'https://twitter.com/bholmesdev/status/1680947540433203201?s=46&t=gJdY9yFl9i4SUuTU583eEg',
    createdAt: new Date('2023-07-17'),
    userId,
  },
  {
    id: 70,
    description:
      'Forms, buttons, and the form prop on submit buttons outside of forms',
    url: 'https://twitter.com/alexdotjs/status/1681393499906637851?s=46&t=gJdY9yFl9i4SUuTU583eEg',
    createdAt: new Date('2023-07-18'),
    userId,
  },
  {
    id: 71,
    description: 'Server timings to benchmark response metrics',
    url: 'https://twitter.com/kentcdodds/status/1596640104621441024?s=46&t=gJdY9yFl9i4SUuTU583eEg',
    createdAt: new Date('2023-07-19'),
    userId,
  },
  {
    id: 72,
    description: 'Server timings to benchmark response metrics',
    url: 'https://twitter.com/jacobmparis/status/1681538019143086080?s=46&t=gJdY9yFl9i4SUuTU583eEg',
    createdAt: new Date('2023-07-19'),
    userId,
  },
  {
    id: 73,
    description: 'Streaming. Advantages of using deferred data on Remix',
    url: 'https://twitter.com/ryanflorence/status/1682149517825806336?s=46&t=gJdY9yFl9i4SUuTU583eEg',
    createdAt: new Date('2023-07-21'),
    userId,
  },
  {
    id: 74,
    description: 'Why not to use SVGs in JSX, and prefer sprites',
    url: 'https://twitter.com/_developit/status/1382838799420514317?s=46&t=gJdY9yFl9i4SUuTU583eEg',
    createdAt: new Date('2023-07-25'),
    userId,
  },
  {
    id: 75,
    description: 'Use SVG sprites for icons on JSX',
    url: 'https://twitter.com/jacobmparis/status/1682904429366857732?s=46&t=gJdY9yFl9i4SUuTU583eEg',
    createdAt: new Date('2023-07-25'),
    userId,
  },
  {
    id: 76,
    description: 'Correctly type forwardRef',
    url: 'https://twitter.com/mattpocockuk/status/1683414495291486208?s=46&t=gJdY9yFl9i4SUuTU583eEg',
    createdAt: new Date('2023-07-27'),
    userId,
  },
  {
    id: 77,
    description: 'Accessible links and disabled links',
    url: 'https://twitter.com/diegohaz/status/1685159682187399168?s=46&t=gJdY9yFl9i4SUuTU583eEg',
    createdAt: new Date('2023-07-30'),
    userId,
  },
  {
    id: 78,
    description: 'Type useRef properly with ElementRef',
    url: 'https://twitter.com/mattpocockuk/status/1683850225847349252?s=46&t=gJdY9yFl9i4SUuTU583eEg',
    createdAt: new Date('2023-07-30'),
    userId,
  },
  {
    id: 79,
    description: 'Transform union of types into record',
    url: 'https://twitter.com/tannerlinsley/status/1684603720364081152?s=46&t=gJdY9yFl9i4SUuTU583eEg',
    createdAt: new Date('2023-07-30'),
    userId,
  },
  {
    id: 80,
    description: 'Add a cache to your server',
    url: 'https://twitter.com/jacobmparis/status/1686082251107233793?s=46&t=gJdY9yFl9i4SUuTU583eEg',
    createdAt: new Date('2023-08-01'),
    userId,
  },
  {
    id: 81,
    description: 'Avoid using filter(Boolean)',
    url: 'https://twitter.com/diegohaz/status/1667197904006569991?s=20',
    createdAt: new Date('2023-08-06'),
    userId,
  },
  {
    id: 82,
    description: 'useOutletContext: Share data between parent > child routes',
    url: 'https://twitter.com/p_mbanugo/status/1687822581405974528?s=46&t=gJdY9yFl9i4SUuTU583eEg',
    createdAt: new Date('2023-08-06'),
    userId,
  },
  {
    id: 83,
    description: 'Redirect URL after logging in',
    url: 'https://twitter.com/kettanaito/status/1688526402038161408?s=46&t=gJdY9yFl9i4SUuTU583eEg',
    createdAt: new Date('2023-08-07'),
    userId,
  },
  {
    id: 84,
    description: 'Nested border radius',
    url: 'https://twitter.com/jh3yy/status/1688542283602231296?s=46&t=gJdY9yFl9i4SUuTU583eEg',
    createdAt: new Date('2023-08-08'),
    userId,
  },
  {
    id: 85,
    description: '',
    url: 'https://twitter.com/mattwensing/status/1690148348588691457',
    createdAt: new Date('2023-08-12'),
    userId,
  },
  {
    id: 86,
    description: 'Turn array of objects into key-value objects',
    url: 'https://x.com/davidkpiano/status/1690725517429727232?s=46&t=gJdY9yFl9i4SUuTU583eEg',
    createdAt: new Date('2023-08-14'),
    userId,
  },
  {
    id: 87,
    description: 'Better setTimeout that clears itself up',
    url: 'https://x.com/diegohaz/status/1691175190481211393?s=46&t=gJdY9yFl9i4SUuTU583eEg',
    createdAt: new Date('2023-08-16'),
    userId,
  },
  {
    id: 88,
    description: 'Delete all button with Remix',
    url: 'https://x.com/ryanflorence/status/1691216887752069122?s=46&t=gJdY9yFl9i4SUuTU583eEg',
    createdAt: new Date('2023-08-22'),
    userId,
  },
  {
    id: 89,
    description: 'RSC explanation',
    url: 'https://x.com/ralex1993/status/1682458915668148225?s=46&t=gJdY9yFl9i4SUuTU583eEg',
    createdAt: new Date('2023-08-22'),
    userId,
  },
  {
    id: 90,
    description: 'Counter with Remix',
    url: 'https://x.com/ryanflorence/status/1691274680039243776?s=46&t=gJdY9yFl9i4SUuTU583eEg',
    createdAt: new Date('2023-08-22'),
    userId,
  },
  {
    id: 91,
    description: 'Remix Toast',
    url: 'https://x.com/ryanflorence/status/1691948179842056285?s=46&t=gJdY9yFl9i4SUuTU583eEg',
    createdAt: new Date('2023-08-23'),
    userId,
  },
  {
    id: 92,
    description: 'Add network latency on mocks with msw',
    url: 'https://x.com/kettanaito/status/1692197084500234716?s=46&t=gJdY9yFl9i4SUuTU583eEg',
    createdAt: new Date('2023-08-23'),
    userId,
  },
  {
    id: 93,
    description: 'Cookies and HTTP sessions',
    url: 'https://x.com/samselikoff/status/1692563293980778750?s=46&t=gJdY9yFl9i4SUuTU583eEg',
    createdAt: new Date('2023-08-23'),
    userId,
  },
  {
    id: 94,
    description: 'Avoid prop drilling with Remix’s hooks',
    url: 'https://x.com/kettanaito/status/1694623649024684381?s=46&t=gJdY9yFl9i4SUuTU583eEg',
    createdAt: new Date('2023-08-25'),
    userId,
  },
  {
    id: 95,
    description: 'Good tests checklist',
    url: 'https://x.com/kettanaito/status/1695028850869105138?s=46&t=gJdY9yFl9i4SUuTU583eEg',
    createdAt: new Date('2023-08-27'),
    userId,
  },
  {
    id: 96,
    description: 'Remix Form vs fetcher',
    url: 'https://x.com/ryanflorence/status/1695147218200825858?s=46&t=gJdY9yFl9i4SUuTU583eEg',
    createdAt: new Date('2023-08-27'),
    userId,
  },
  {
    id: 97,
    description:
      'RSC, client components and server components interactive explanation',
    url: 'https://x.com/asidorenko_/status/1694366373240062087?s=46&t=gJdY9yFl9i4SUuTU583eEg',
    createdAt: new Date('2023-08-27'),
    userId,
  },
  {
    id: 98,
    description: 'New sets APIs for difference, intersections and more',
    url: 'https://twitter.com/wesbos/status/1695089111743275488?s=20',
    createdAt: new Date('2023-08-30'),
    userId,
  },
  {
    id: 99,
    description: 'Tutorial: nextjs 13, clerk, upload thing, planetscale',
    url: 'https://x.com/ytcodeantonio/status/1695240747862167649?s=46&t=gJdY9yFl9i4SUuTU583eEg',
    createdAt: new Date('2023-09-01'),
    userId,
  },
  {
    id: 100,
    description:
      'Breadcrumbs on parent layout with dynamic data from child routes (parallel routes)',
    url: 'https://x.com/ryantotweets/status/1697411600045506565?s=46&t=gJdY9yFl9i4SUuTU583eEg',
    createdAt: new Date('2023-09-02'),
    userId,
  },
]

const tagsData = [
  {id: 1, name: 'vercel', color: 'blue' as const, userId},
  {id: 2, name: 'react', color: 'green' as const, userId},
  {id: 3, name: 'nextjs', color: 'red' as const, userId},
  {id: 4, name: 'typescript', color: 'orange' as const, userId},
  {id: 5, name: 'RSC', color: 'yellow' as const, userId},
  {id: 65, name: 'tailwind', color: 'blue' as const, userId},
  {id: 66, name: 'CSS', color: 'purple' as const, userId},
  {id: 67, name: 'Remix', color: 'yellow' as const, userId},
  {id: 68, name: 'ESLint', color: 'blue' as const, userId},
  {id: 69, name: 'express', color: 'orange' as const, userId},
  {id: 70, name: 'HTML', color: 'yellow' as const, userId},
  {id: 71, name: 'Accessibility', color: 'pink' as const, userId},
  {id: 72, name: 'SSR', color: 'blue' as const, userId},
  {id: 73, name: 'JavaScript', color: 'purple' as const, userId},
  {id: 75, name: 'One', color: 'gray' as const, userId},
  {id: 76, name: 'msw', color: 'blue' as const, userId},
  {id: 77, name: 'HTTP', color: 'green' as const, userId},
  {id: 78, name: 'Testing', color: 'yellow' as const, userId},
  {id: 79, name: 'tutorial', color: 'orange' as const, userId},
  {id: 81, name: 'Database', color: 'yellow' as const, userId},
  {id: 82, name: 'Interviews', color: 'yellow' as const, userId},
  {id: 83, name: 'react query', color: 'red' as const, userId},
  {id: 84, name: 'Solid', color: 'purple' as const, userId},
  {id: 85, name: 'Auth', color: 'green' as const, userId},
]

const tweetsToTagsData = [
  {tweetId: 1, tagId: 2},
  {tweetId: 1, tagId: 5},
  {tweetId: 4, tagId: 4},
  {tweetId: 59, tagId: 2},
  {tweetId: 59, tagId: 3},
  {tweetId: 59, tagId: 5},
  {tweetId: 61, tagId: 4},
  {tweetId: 62, tagId: 65},
  {tweetId: 62, tagId: 66},
  {tweetId: 63, tagId: 67},
  {tweetId: 64, tagId: 4},
  {tweetId: 64, tagId: 68},
  {tweetId: 65, tagId: 65},
  {tweetId: 65, tagId: 66},
  {tweetId: 66, tagId: 2},
  {tweetId: 67, tagId: 4},
  {tweetId: 68, tagId: 4},
  {tweetId: 69, tagId: 69},
  {tweetId: 70, tagId: 2},
  {tweetId: 70, tagId: 70},
  {tweetId: 71, tagId: 2},
  {tweetId: 71, tagId: 67},
  {tweetId: 72, tagId: 2},
  {tweetId: 72, tagId: 67},
  {tweetId: 73, tagId: 67},
  {tweetId: 74, tagId: 2},
  {tweetId: 75, tagId: 2},
  {tweetId: 76, tagId: 2},
  {tweetId: 76, tagId: 4},
  {tweetId: 77, tagId: 2},
  {tweetId: 77, tagId: 3},
  {tweetId: 77, tagId: 70},
  {tweetId: 77, tagId: 71},
  {tweetId: 78, tagId: 2},
  {tweetId: 78, tagId: 4},
  {tweetId: 79, tagId: 4},
  {tweetId: 80, tagId: 67},
  {tweetId: 80, tagId: 72},
  {tweetId: 81, tagId: 4},
  {tweetId: 82, tagId: 67},
  {tweetId: 83, tagId: 67},
  {tweetId: 84, tagId: 66},
  {tweetId: 85, tagId: 75},
  {tweetId: 86, tagId: 73},
  {tweetId: 87, tagId: 73},
  {tweetId: 88, tagId: 67},
  {tweetId: 89, tagId: 5},
  {tweetId: 90, tagId: 67},
  {tweetId: 91, tagId: 67},
  {tweetId: 92, tagId: 76},
  {tweetId: 93, tagId: 67},
  {tweetId: 93, tagId: 77},
  {tweetId: 94, tagId: 67},
  {tweetId: 95, tagId: 78},
  {tweetId: 96, tagId: 67},
  {tweetId: 97, tagId: 2},
  {tweetId: 97, tagId: 5},
  {tweetId: 98, tagId: 73},
  {tweetId: 99, tagId: 3},
  {tweetId: 99, tagId: 79},
  // {tweetId: 100, tagId: 3}, // Oops! Tweet with id 100 does not have a tag assigned!
]

async function dbTeardown() {
  console.log('🔥 Dropping tables...')
  await db.delete(tweet).all()
  await db.delete(tag).all()
  await db.delete(tweetsToTags).all()
  console.log('✅ Tables dropped')
}

async function seedTweets() {
  console.log('🌱 Seeding tweets...')
  await db.insert(tweet).values(tweetsData)
  console.log('✅ Tweets seeded')
}

async function seedTags() {
  console.log('🌱 Seeding tags...')
  await db.insert(tag).values(tagsData)
  console.log('✅ Tags seeded')
}

async function seedTweetsToTags() {
  console.log('🌱 Seeding tweets to tags...')
  await db.insert(tweetsToTags).values(tweetsToTagsData)
  console.log('✅ Tweets to tags seeded')
}

async function seed() {
  await dbTeardown()
  await seedTweets()
  await seedTags()
  await seedTweetsToTags()
}

seed()
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => {
    client.close()
  })
