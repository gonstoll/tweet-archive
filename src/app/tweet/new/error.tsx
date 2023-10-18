'use client'
import Link from 'next/link'
import * as React from 'react'
import {ErrorWrapper} from '~/components/error-wrapper'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & {digest?: string}
  reset: () => void
}) {
  React.useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <ErrorWrapper message={error.message}>
      <div className="mt-4 flex items-center justify-center gap-2">
        <button
          onClick={reset}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
        >
          Try again
        </button>
        <p>or</p>
        <Link
          href="/"
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
        >
          Go back home
        </Link>
      </div>
    </ErrorWrapper>
  )
}
