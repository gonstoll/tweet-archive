import {Inter} from 'next/font/google'
import * as React from 'react'
import {classNames} from '~/utils/classnames'
import '~/styles/globals.css'
import '~/env'

const inter = Inter({subsets: ['latin']})

export const metadata = {
  title: 'Tweet Archive',
  description: 'A curated archive of all related tweets',
}

export default function RootLayout({
  children,
  modal,
}: React.PropsWithChildren<{modal: React.ReactNode}>) {
  return (
    <html lang="en">
      <body className={classNames(inter.className, 'p-10')}>
        {modal}
        {children}
      </body>
    </html>
  )
}
