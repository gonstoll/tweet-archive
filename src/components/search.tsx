'use client'
import {usePathname, useRouter, useSearchParams} from 'next/navigation'
import * as React from 'react'
import {searchParamsToString} from '~/utils/search-params-to-string'

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
      router.replace(`${pathname}?${searchParamsToString(params)}`)
    })
  }

  return (
    <div className="block w-full">
      <label htmlFor="search" className="text-zinc-900 dark:text-zinc-100">
        Search
      </label>
      <div className="relative mt-1 flex">
        <input
          type="search"
          id="search"
          name="search"
          placeholder="Search tweets by description"
          className="h-11 w-full flex-1 appearance-none rounded-md border border-zinc-300 bg-zinc-50 p-2 text-zinc-900 placeholder-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
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
