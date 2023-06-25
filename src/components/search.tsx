'use client'

import {usePathname, useRouter, useSearchParams} from 'next/navigation'
import * as React from 'react'
import {getSearchParams} from '~/utils/get-search-params'

export function Search() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()

  const [isPending, startTransition] = React.useTransition()

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
    <div className="block w-full">
      <label htmlFor="search">Search</label>
      <div className="relative mt-1">
        <input
          type="search"
          placeholder="Search tweets by description"
          className="h-11 w-full rounded-md border-1 border-slate-200 p-2"
          name="search"
          id="search"
          onChange={e => handleSearch(e.currentTarget.value)}
          defaultValue={params.get('search') ?? ''}
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
