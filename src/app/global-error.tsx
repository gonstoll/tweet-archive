'use client'
import Link from 'next/link'
import {ErrorWrapper} from '~/components/error-wrapper'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & {digest?: string}
  reset: () => void
}) {
  return (
    <html>
      <body>
        <ErrorWrapper message={error.message}>
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              onClick={reset}
              className="rounded-md border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-100 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              Try again
            </button>
            <p>or</p>
            <Link
              href="/"
              className="rounded-md border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-100 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              Go back home
            </Link>
          </div>
        </ErrorWrapper>
      </body>
    </html>
  )
}
