'use client'

import * as Ariakit from '@ariakit/react'
import {matchSorter} from 'match-sorter'
import {usePathname, useRouter, useSearchParams} from 'next/navigation'
import * as React from 'react'
import {useZact} from 'zact/client'
import {ZactAction} from 'zact/server'
import type {Tag} from '~/db/db'
import {tagColors} from '~/db/schema'
import {getSearchParams} from '~/utils/get-search-params'
import {Tag as TagComponent} from '../tag'
import {ZodType} from 'zod'

type Props = {
  tags: Array<Tag>
  handleCreateTag: ZactAction<ZodType<any>, Omit<Tag, 'userId'>>
} & (
  | {type: 'filter'}
  | {type: 'select'; onChange: (tags: Array<string>) => void}
)

function renderTag(tags: Array<Omit<Tag, 'userId'>>) {
  if (!tags.length) {
    return <p className="text-gray-400">Select tags</p>
  }

  return (
    <div className="flex items-center gap-2 overflow-auto">
      {tags.map(t => (
        <TagComponent key={t.id} tag={t} />
      ))}
    </div>
  )
}

export function TagsFilter({tags, handleCreateTag, ...props}: Props) {
  const params = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const {mutate, data: newTag} = useZact(handleCreateTag)

  const combobox = Ariakit.useComboboxStore({
    resetValueOnHide: true,
  })
  const select = Ariakit.useSelectStore({
    combobox,
    defaultValue: params.get('tags')?.split(',') ?? [],
    setValue: value => handleFilter(value),
    animated: true,
  })
  const comboboxValue = combobox.useState('value')
  const selectValue = select.useState('value')
  const mounted = select.useState('mounted')

  const [isPending, startTransition] = React.useTransition()
  const deferredValue = React.useDeferredValue(comboboxValue)
  const tagColorRef = React.useRef(
    tagColors[Math.floor(Math.random() * tagColors.length)]
  )
  const matches = React.useMemo(
    () => matchSorter(tags, deferredValue, {keys: ['name']}),
    [tags, deferredValue]
  )
  const selectedTags = React.useMemo(() => {
    const filteredTags = tags.filter(tag => selectValue.includes(tag.name))
    // return newTag ? [...filteredTags, newTag] : filteredTags
    return filteredTags
  }, [tags, selectValue])

  const showAddTagBtn =
    comboboxValue.length > 0 &&
    matches[0]?.name.toLowerCase() !== comboboxValue.toLowerCase()

  function handleFilter(tags: Array<string>) {
    select.setValue(tags)

    // If this is a normal select, just return the tags and don't update the URL
    if (props.type === 'select') {
      props.onChange(tags)
      return
    }

    const params = new URLSearchParams(window.location.search)
    const filteredTags = tags.filter(Boolean)

    params.delete('tags')

    if (filteredTags.length) {
      params.set('tags', filteredTags.join(','))
    } else {
      params.delete('tags')
    }

    startTransition(() => {
      router.replace(`${pathname}?${getSearchParams(params)}`)
    })
  }

  function handleOnCreateTag(tagName: string) {
    combobox.hide()
    const newTag = {
      name: tagName,
      color: tagColorRef.current,
    }
    select.setValue(prevTags => [...prevTags, tagName])
    mutate(newTag)
      .then(() => combobox.setValue(''))
      .catch(error => {
        combobox.show()
        select.setValue(prevTags => prevTags.filter(t => t !== tagName))
        throw new Error(error)
      })
  }

  return (
    <div className="w-full">
      <Ariakit.SelectLabel store={select}>Tags</Ariakit.SelectLabel>
      <div className="relative">
        <Ariakit.Select
          store={select}
          className="mt-1 flex h-11 w-full items-center justify-between gap-1 whitespace-nowrap rounded-md border-1 border-slate-200 p-2"
        >
          {renderTag(selectedTags)}
          <Ariakit.SelectArrow />
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
          className="relative z-50 flex -translate-y-6 flex-col overflow-auto overscroll-contain rounded-md border-1 border-slate-300 bg-white opacity-0 duration-200 data-[enter]:translate-y-0 data-[enter]:opacity-100"
        >
          <div className="sticky top-0 mb-2 w-full p-2">
            <Ariakit.Combobox
              store={combobox}
              autoSelect
              placeholder="Search..."
              className="h-10 w-full rounded-md border-1 border-slate-300 p-4"
            />
          </div>
          <Ariakit.ComboboxList store={combobox}>
            {matches.map(value => (
              <Ariakit.ComboboxItem
                key={value.id}
                focusOnHover
                className="flex cursor-pointer items-center gap-2 p-2"
                render={p => (
                  <Ariakit.SelectItem {...p} value={value.name}>
                    <Ariakit.SelectItemCheck />
                    <TagComponent tag={value} />
                  </Ariakit.SelectItem>
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
