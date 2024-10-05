import {ClerkApp, SignedIn, SignedOut} from '@clerk/remix'
import {rootAuthLoader} from '@clerk/remix/ssr.server'
import type {LoaderFunctionArgs, MetaFunction} from '@remix-run/node'
import {
  json,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react'
import './globals.css'
import {getEnv} from './utils/env.server'

export function meta(): ReturnType<MetaFunction> {
  return [
    {title: 'Tweet Archive'},
    {name: 'description', content: 'A list of all your saved tweets.'},
  ]
}

export async function loader(args: LoaderFunctionArgs) {
  return rootAuthLoader(args, () => {
    return json({ENV: getEnv()})
  })
}

function App() {
  const data = useLoaderData<typeof loader>()

  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="flex min-h-full flex-col bg-background p-8">
        <SignedIn>
          <header className="mx-auto mb-6 flex w-full max-w-7xl items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Tweet Archive</h1>
              <h2 className="text-muted-foreground">
                A list of all your saved tweets
              </h2>
            </div>
          </header>
          <main className="mx-auto w-full max-w-7xl">
            <Outlet />
          </main>
        </SignedIn>

        <SignedOut>
          <Outlet />
        </SignedOut>

        <ScrollRestoration />
        <Scripts />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
          }}
        />
      </body>
    </html>
  )
}

export default ClerkApp(App)
