import {Inter} from 'next/font/google'
import {classNames} from '~/utils/classnames'

const inter = Inter({subsets: ['latin']})

export function Document({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body
        className={classNames(
          inter.className,
          'flex h-full flex-col bg-zinc-50 dark:bg-zinc-900',
        )}
      >
        {children}
      </body>
    </html>
  )
}
