import {ClerkApp} from '@clerk/remix'
import {rootAuthLoader} from '@clerk/remix/ssr.server'
import type {LoaderFunctionArgs, MetaFunction} from '@remix-run/node'
import {Links, Meta, Outlet, Scripts, ScrollRestoration} from '@remix-run/react'
import './globals.css'

export function meta(): ReturnType<MetaFunction> {
  return [
    {title: 'New Remix App'},
    {name: 'description', content: 'Welcome to Remix!'},
  ]
}

export async function loader(args: LoaderFunctionArgs) {
  return rootAuthLoader(args)
}

export function Layout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="flex min-h-full">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

function App() {
  return <Outlet />
}

export default ClerkApp(App)
