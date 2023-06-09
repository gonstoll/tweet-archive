'use client'

import * as Ariakit from '@ariakit/react'
import {matchSorter} from 'match-sorter'
import * as React from 'react'
import {useZact} from 'zact/client'
import type {Tag} from '~/db/db'
import {tagColors} from '~/db/schema'
import {classNames} from '~/utils/classnames'
import TagComponent from '../Tag'
import {handleCreateTag} from './action'

type Props = {
  tags: Array<Tag>
}

function renderTag(tags: Array<Tag>) {
  return (
    <div className="flex items-center gap-2 overflow-auto">
      {tags.map(t => (
        <TagComponent key={t.id} tag={t} />
      ))}
    </div>
  )
}

export default function TagsFilter({tags}: Props) {
  const combobox = Ariakit.useComboboxStore({resetValueOnHide: true})
  const select = Ariakit.useSelectStore({
    combobox,
    defaultValue: [''],
  })
  const comboboxValue = combobox.useState('value')
  const selectValue = select.useState('value')
  const mounted = select.useState('mounted')

  const {mutate, isLoading} = useZact(handleCreateTag)

  const tagColorRef = React.useRef(
    tagColors[Math.floor(Math.random() * tagColors.length)]
  )
  const deferredValue = React.useDeferredValue(comboboxValue)
  const matches = React.useMemo(
    () => matchSorter(tags, deferredValue, {keys: ['name']}),
    [tags, deferredValue]
  )
  const selectedTags = React.useMemo(() => {
    const filteredTags = tags.filter(tag => selectValue.includes(tag.name))
    const optimisticTag = {
      name: comboboxValue.toLowerCase(),
      color: tagColorRef.current,
      id: 123,
    }
    return isLoading ? [...filteredTags, optimisticTag] : filteredTags
  }, [tags, comboboxValue, isLoading, selectValue])

  const showAddTagBtn =
    comboboxValue.length > 0 &&
    matches[0]?.name.toLowerCase() !== comboboxValue.toLowerCase()

  function handleOnCreateTag(tagName: string) {
    const newTag = {
      name: tagName,
      color: tagColorRef.current,
    }
    select.setValue(prevTags => [...prevTags, tagName])
    combobox.hide()
    mutate(newTag)
      .then(() => combobox.setValue(''))
      .catch(error => {
        console.log('Error!!', error)
        select.setValue(prevTags => prevTags.filter(t => t !== tagName))
      })
  }

  return (
    <div>
      <Ariakit.SelectLabel store={select}>Tags</Ariakit.SelectLabel>
      <Ariakit.Select
        store={select}
        className={classNames(
          'mb-4 flex h-11 w-96 items-center gap-1 whitespace-nowrap rounded-md border-1 border-slate-200 p-2',
          {
            'justify-between': selectedTags.length > 0,
            'justify-end': selectedTags.length === 0,
          }
        )}
      >
        {renderTag(selectedTags)}
        <Ariakit.SelectArrow />
      </Ariakit.Select>
      {mounted ? (
        <Ariakit.SelectPopover
          store={select}
          gutter={4}
          sameWidth
          className="relative z-50 flex flex-col overflow-auto overscroll-contain rounded-md border-1 border-slate-300 bg-white"
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
            {!matches.length ? (
              <div className="no-results">No results found</div>
            ) : null}
            {showAddTagBtn ? (
              <Ariakit.ComboboxItem
                className="flex cursor-pointer items-center gap-2 p-2"
                onClick={() => {
                  // mutate({name: comboboxValue, color: 'blue'})
                  handleOnCreateTag(comboboxValue.toLowerCase())
                }}
              >
                Create new tag:{' '}
                <TagComponent
                  tag={{
                    name: comboboxValue.toLowerCase(),
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
