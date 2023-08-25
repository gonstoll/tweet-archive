import {ClerkProvider, UserButton, auth} from '@clerk/nextjs'
import {Inter} from 'next/font/google'
import Link from 'next/link'
import * as React from 'react'
import '~/env'
import '~/styles/globals.css'
import {classNames} from '~/utils/classnames'

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
      <html lang="en" className="h-full">
        <body className={classNames(inter.className, 'flex h-full flex-col')}>
          <header>
            <div className="flex items-center justify-between border-b-1 border-b-slate-200 px-10 py-4">
              <Link href="/">
                <h1 className="text-lg font-bold">Tweet archive</h1>
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
            className={classNames('p-6 lg:p-10', {
              'flex flex-1 items-center justify-center': !isSignedIn,
            })}
          >
            {modal}
            <div className="mx-auto max-w-xl md:max-w-8xl">{children}</div>
          </main>
        </body>
      </html>
    </ClerkProvider>
  )
}
