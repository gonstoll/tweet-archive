import {useSearchParams} from '@remix-run/react'
import {ChevronsLeft, ChevronsRight} from 'lucide-react'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination'

function setSearchParamsString(
  searchParams: URLSearchParams,
  changes: Record<string, string | number | undefined>,
) {
  const newSearchParams = new URLSearchParams(searchParams)

  for (const [key, value] of Object.entries(changes)) {
    if (value === undefined) {
      newSearchParams.delete(key)
      continue
    }

    newSearchParams.set(key, String(value))
  }

  // Print string manually to avoid over-encoding the URL
  // Browsers are ok with $ nowadays
  return Array.from(newSearchParams.entries())
    .map(([key, value]) =>
      value ? `${key}=${encodeURIComponent(value)}` : key,
    )
    .join('&')
}

export function PaginationBar({total}: {total: number}) {
  const [searchParams] = useSearchParams()
  const $skip = Number(searchParams.get('$skip')) || 0
  const $top = Number(searchParams.get('$top')) || 10

  const maxPages = 7
  const totalPages = Math.ceil(total / $top)
  const currentPage = Math.floor($skip / $top) + 1
  const halfMaxPages = Math.floor(maxPages / 2)

  const canPageBackwards = $skip > 0
  const canPageForwards = $skip + $top < total

  const pageNumbers = [] as Array<number>

  if (totalPages <= maxPages) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i)
    }
  } else {
    let startPage = currentPage - halfMaxPages
    let endPage = currentPage + halfMaxPages

    if (startPage < 1) {
      endPage += Math.abs(startPage) + 1
      startPage = 1
    }

    if (endPage > totalPages) {
      startPage -= endPage - totalPages
      endPage = totalPages
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationLink
            preventScrollReset
            prefetch="intent"
            size="icon"
            aria-label="Go to first page"
            aria-disabled={!canPageBackwards}
            className={
              !canPageBackwards ? 'pointer-events-none cursor-not-allowed' : ''
            }
            to={{
              search: setSearchParamsString(searchParams, {
                $skip: 0,
              }),
            }}
          >
            <span className="sr-only">First page</span>
            <ChevronsLeft className="h-4 w-4" />
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationPrevious
            preventScrollReset
            prefetch="intent"
            aria-disabled={!canPageBackwards}
            className={
              !canPageBackwards ? 'pointer-events-none cursor-not-allowed' : ''
            }
            to={{
              search: setSearchParamsString(searchParams, {
                $skip: Math.max($skip - $top, 0),
              }),
            }}
          />
        </PaginationItem>
        {pageNumbers.map(pageNumber => {
          const pageSkip = (pageNumber - 1) * $top
          const isCurrentPage = pageNumber === currentPage

          return (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                preventScrollReset
                prefetch="intent"
                isActive={isCurrentPage}
                to={{
                  search: setSearchParamsString(searchParams, {
                    $skip: pageSkip,
                  }),
                }}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          )
        })}
        <PaginationItem>
          <PaginationNext
            preventScrollReset
            prefetch="intent"
            aria-disabled={!canPageForwards}
            className={
              !canPageForwards ? 'pointer-events-none cursor-not-allowed' : ''
            }
            to={{
              search: setSearchParamsString(searchParams, {
                $skip: $skip + $top,
              }),
            }}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            preventScrollReset
            prefetch="intent"
            size="icon"
            aria-disabled={!canPageForwards}
            aria-label="Go to last page"
            className={
              !canPageForwards ? 'pointer-events-none cursor-not-allowed' : ''
            }
            to={{
              search: setSearchParamsString(searchParams, {
                $skip: (totalPages - 1) * $top,
              }),
            }}
          >
            <span className="sr-only"> Last page</span>
            <ChevronsRight className="h-4 w-4" />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
