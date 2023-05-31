import {Inter} from 'next/font/google'
import {classNames} from '~/utils/classnames'
import '../styles/globals.css'

const inter = Inter({subsets: ['latin']})

export const metadata = {
  title: 'Tweet Archive',
  description: 'A curated archive of all related tweets',
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className={classNames(inter.className, 'p-10')}>{children}</body>
    </html>
  )
}
