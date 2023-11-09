import {ClerkProvider, UserButton, auth} from '@clerk/nextjs'
import {Inter} from 'next/font/google'
import Link from 'next/link'
import * as React from 'react'
import '~/env'
import '~/styles/globals.css'
import {classNames} from '~/utils/classnames'
import {Providers} from './providers'

const inter = Inter({subsets: ['latin']})

export const metadata = {
  title: 'Tweet Archive',
  description: 'A curated archive of all related tweets',
}

export default function RootLayout({
  children,
  modal,
}: React.PropsWithChildren<{modal: React.ReactNode}>) {
  const user = auth()
  const isSignedIn = Boolean(user.userId)

  return (
    <ClerkProvider>
      <html lang="en" className="h-full" suppressHydrationWarning>
        <body
          className={classNames(
            inter.className,
            'flex h-full flex-col bg-zinc-50 dark:bg-zinc-900',
          )}
        >
          <Providers>
            <header>
              <div className="flex items-center justify-between border-b-1 border-b-zinc-300 px-10 py-4 dark:border-b-zinc-700">
                <Link href="/">
                  <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    Tweet archive
                  </h1>
                </Link>
                <UserButton
                  showName
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      userButtonOuterIdentifier: {
                        fontWeight: 400,
                        fontSize: '0.875rem',
                      },
                      userButtonPopoverFooter: {
                        display: 'none',
                      },
                    },
                  }}
                />
              </div>
            </header>
            <main
              className={classNames('flex-1 p-6 lg:p-10', {
                'flex items-center justify-center': !isSignedIn,
              })}
            >
              <div className="mx-auto flex h-full max-w-xl flex-col md:max-w-8xl">
                {children}
              </div>
            </main>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}
