import {ClerkProvider, UserButton, auth} from '@clerk/nextjs'
import {Inter} from 'next/font/google'
import Link from 'next/link'
import * as React from 'react'
import {Document} from '~/components/document'
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
      <Document>
        <Providers>
          <header>
            <div className="border-b-1 flex items-center justify-between border-b-zinc-300 px-10 py-4 dark:border-b-zinc-700">
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
                    userButtonPopoverFooter: 'hidden',
                    userButtonOuterIdentifier:
                      'text-sm font-normal text-zinc-900 dark:text-zinc-100',
                    userButtonPopoverCard:
                      'bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 pb-2 shadow-lg',
                    userPreview: 'mb-3',
                    userPreviewTextContainer:
                      'text-zinc-900 dark:text-zinc-100 text-sm',
                    userPreviewSecondaryIdentifier:
                      'text-zinc-900 dark:text-zinc-100 text-sm',
                    userButtonPopoverActionButton: 'py-3',
                    userButtonPopoverActionButtonIcon:
                      'w-4 h-4 text-zinc-900 dark:text-zinc-100',
                    userButtonPopoverActionButtonText:
                      'text-sm text-zinc-900 dark:text-zinc-100',
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
      </Document>
    </ClerkProvider>
  )
}
