'use client'

import {usePathname, useRouter} from 'next/navigation'
import * as React from 'react'
import {getSearchParams} from '~/utils/get-search-params'

export function Search() {
  const [isPending, startTransition] = React.useTransition()
  const router = useRouter()
  const pathname = usePathname()

  function handleSearch(term: string) {
    const params = new URLSearchParams(window.location.search)

    if (term) {
      params.set('search', term)
    } else {
      params.delete('search')
    }

    startTransition(() => {
      router.replace(`${pathname}?${getSearchParams(params)}`)
    })
  }

  return (
    <div>
      <label htmlFor="search">Search</label>
      <div className="relative">
        <input
          type="search"
          placeholder="Search..."
          className="mb-4 h-11 w-full rounded-md border-1 border-slate-200 p-2"
          name="search"
          id="search"
          onChange={e => handleSearch(e.currentTarget.value)}
        />
        {isPending ? (
          <div
            className="absolute right-7 top-2 inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"
            role="status"
          />
        ) : null}
      </div>
    </div>
  )
}
