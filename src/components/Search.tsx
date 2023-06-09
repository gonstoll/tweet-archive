'use client'

import {usePathname, useRouter} from 'next/navigation'
import * as React from 'react'

export default function Search() {
  const [isPending, startTransition] = React.useTransition()
  const {replace} = useRouter()
  const pathname = usePathname()

  function handleSearch(term: string) {
    const params = new URLSearchParams(window.location.search)

    if (term) {
      params.set('search', term)
    } else {
      params.delete('search')
    }

    startTransition(() => {
      replace(`${pathname}?${params.toString()}`)
    })
  }

  return (
    <div className="relative">
      <label htmlFor="search">
        Search
      </label>
      <input
        type="search"
        placeholder="Search..."
        className="mb-4 w-full rounded-md border-1 border-slate-200 p-2"
        name="search"
        id="search"
        onChange={e => handleSearch(e.currentTarget.value)}
      />
      {isPending ? (
        <div
          className="absolute right-4 top-2 inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"
          role="status"
        />
      ) : null}
    </div>
  )
}
