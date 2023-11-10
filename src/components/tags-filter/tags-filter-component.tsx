'use client'
import * as Ariakit from '@ariakit/react'
import {matchSorter} from 'match-sorter'
import {usePathname, useRouter, useSearchParams} from 'next/navigation'
import * as React from 'react'
import type {Tag} from '~/db/models/tag'
import {tagColors} from '~/db/schema'
import {searchParamsToString} from '~/utils/search-params-to-string'
import {Tag as TagComponent} from '../tag'

type Props = {
  tags: Array<Tag>
  initialTags?: Array<Tag>
  deleteTag(tagId: number): Promise<void>
  createTag(tag: Omit<Tag, 'userId' | 'id'>): Promise<void>
  type: 'filter' | 'select'
}

function renderTag(tags: Array<Omit<Tag, 'userId'>>) {
  if (!tags.length) {
    return <p className="text-zinc-400">Select tags</p>
  }

  return (
    <div className="flex items-center gap-2 overflow-auto">
      {tags.map(t => (
        <TagComponent key={t.id} tag={t} />
      ))}
    </div>
  )
}

function randomizeTagColor() {
  return tagColors[Math.floor(Math.random() * tagColors.length)]
}

export function TagsFilterComponent({
  tags,
  initialTags = [],
  createTag,
  deleteTag,
  ...props
}: Props) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const combobox = Ariakit.useComboboxStore({
    resetValueOnHide: true,
  })
  const select = Ariakit.useSelectStore({
    combobox,
    defaultValue:
      searchParams.get('tags')?.split(',') ?? initialTags.map(t => t.name),
    setValue: value => handleFilter(value),
    animated: true,
  })
  const comboboxValue = combobox.useState('value')
  const selectValue = select.useState('value')
  const mounted = select.useState('mounted')

  const [isPending, startTransition] = React.useTransition()
  const deferredValue = React.useDeferredValue(comboboxValue)

  const tagColorRef = React.useRef(randomizeTagColor())

  const matches = React.useMemo(() => {
    return matchSorter(tags, deferredValue, {keys: ['name']})
  }, [deferredValue, tags])

  const selectedTags = React.useMemo(() => {
    const filteredTags = tags.filter(tag => selectValue.includes(tag.name))
    return filteredTags
  }, [tags, selectValue])

  const showAddTagBtn =
    comboboxValue.length > 0 &&
    matches[0]?.name.toLowerCase() !== comboboxValue.toLowerCase()

  function handleFilter(tags: Array<string>) {
    select.setValue(tags)

    // If this is a normal select, just return the tags and don't update the URL
    if (props.type === 'select') {
      return
    }

    const newSearchParams = new URLSearchParams(
      Array.from(searchParams.entries()),
    )
    const filteredTags = tags.filter(Boolean)

    newSearchParams.delete('tags')

    if (filteredTags.length) {
      newSearchParams.set('tags', filteredTags.join(','))
    } else {
      newSearchParams.delete('tags')
    }

    startTransition(() => {
      router.replace(`${pathname}?${searchParamsToString(newSearchParams)}`)
    })
  }

  async function handleOnCreateTag(tagName: string) {
    const newTagData = {
      name: tagName,
      color: tagColorRef.current,
    }

    select.setValue(prevTags => [...prevTags, tagName])

    try {
      startTransition(async () => {
        await createTag(newTagData)
        router.refresh()
      })
      combobox.setValue('')
      tagColorRef.current = randomizeTagColor()
    } catch (error) {
      select.setValue(prevTags => prevTags.filter(t => t !== tagName))

      if (error instanceof Error) {
        throw new Error(error.message)
      }
    }
  }

  async function handleOnDeleteTag(tagId: number) {
    const tagName = tags.find(t => t.id === tagId)?.name

    startTransition(async () => {
      await deleteTag(tagId)
      // We are getting rid of the tag if it's selected
      if (tagName && select.getState().value.includes(tagName)) {
        select.setValue(prevTags => prevTags.filter(t => t !== tagName))
      }
      router.refresh()
    })
  }

  return (
    <div className="w-full">
      <input
        type="hidden"
        name="tag-ids"
        value={selectedTags.map(t => t.id).join(',')}
      />
      <Ariakit.SelectLabel store={select}>
        <span className="text-zinc-900 dark:text-zinc-100">Tags</span>
      </Ariakit.SelectLabel>
      <div className="relative">
        <Ariakit.Select
          store={select}
          className="mt-1 flex h-11 w-full items-center justify-between gap-1 whitespace-nowrap rounded-md border border-zinc-300 p-2 dark:border-zinc-700"
        >
          {renderTag(selectedTags)}
          <Ariakit.SelectArrow className="text-zinc-900 dark:text-zinc-100" />
        </Ariakit.Select>
        {isPending ? (
          <div
            className="absolute right-7 top-2 inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"
            role="status"
          />
        ) : null}
      </div>
      {mounted ? (
        <Ariakit.SelectPopover
          portal
          sameWidth
          store={select}
          gutter={4}
          className="relative z-50 flex max-h-72 -translate-y-6 flex-col overflow-auto overscroll-contain rounded-md border border-zinc-300 bg-zinc-50 opacity-0 duration-200 data-[enter]:translate-y-0 data-[enter]:opacity-100 dark:border-zinc-700 dark:bg-zinc-900"
        >
          <div className="sticky top-0 z-40 mb-2 w-full bg-zinc-50 p-2 dark:bg-zinc-900">
            <Ariakit.Combobox
              store={combobox}
              autoSelect
              placeholder="Search..."
              className="h-10 w-full rounded-md border border-zinc-300 p-4 dark:border-zinc-700"
            />
          </div>
          <Ariakit.ComboboxList store={combobox}>
            {matches.map(value => (
              <Ariakit.ComboboxItem
                key={value.id}
                focusOnHover
                className="relative mr-2 flex flex-1 cursor-pointer items-center gap-2 p-2"
                render={p => (
                  <div className="group flex items-center justify-between pr-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                    <Ariakit.SelectItem {...p} value={value.name}>
                      <Ariakit.SelectItemCheck />
                      <TagComponent tag={value} />
                    </Ariakit.SelectItem>
                    <button
                      className="rounded-md border border-red-500 bg-zinc-50 px-3 py-1 text-xs text-red-700 hover:group-hover:bg-red-50 dark:border-red-500 dark:bg-zinc-900 dark:text-red-500 dark:hover:group-hover:bg-red-950"
                      onClick={() => handleOnDeleteTag(value.id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              />
            ))}
            {showAddTagBtn ? (
              <Ariakit.ComboboxItem
                className="flex cursor-pointer items-center gap-2 p-2"
                onClick={() => handleOnCreateTag(comboboxValue)}
              >
                Create new tag:{' '}
                <TagComponent
                  tag={{
                    name: comboboxValue,
                    color: tagColorRef.current,
                  }}
                />
              </Ariakit.ComboboxItem>
            ) : null}
          </Ariakit.ComboboxList>
        </Ariakit.SelectPopover>
      ) : null}
    </div>
  )
}
