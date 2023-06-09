'use client'

import {matchSorter} from 'match-sorter'
import * as React from 'react'
import {useZact} from 'zact/client'
import type {Tag} from '~/db/db'
import {Combobox, ComboboxItem} from '../Combobox'
import TagComponent from '../Tag'
import {handleAddTag} from './action'

type Props = {
  tags: Array<Tag>
}

export default function TagsFilter({tags}: Props) {
  const [value, setValue] = React.useState('')
  const [values, setValues] = React.useState<Array<string>>([])
  const deferredValue = React.useDeferredValue(value)
  const {mutate} = useZact(handleAddTag)

  const matches = React.useMemo(
    () => matchSorter(tags, deferredValue, {keys: ['name']}),
    [tags, deferredValue]
  )

  const showAddTagBtn =
    value.length > 0 && matches[0]?.name.toLowerCase() !== value.toLowerCase()

  return (
    <Combobox
      label="Tags"
      placeholder="React, Typescript..."
      value={value}
      onChange={setValue}
      values={values}
      onValuesChange={setValues}
    >
      {matches.map(tag => (
        <ComboboxItem key={tag.id} value={tag.name}>
          <TagComponent tag={tag} />
        </ComboboxItem>
      ))}
      {!matches.length ? (
        <div className="no-results">No results found</div>
      ) : null}
      {showAddTagBtn ? (
        <ComboboxItem
          onClick={() => mutate({tag: {name: value, color: 'blue'}})}
        >
          Create new tag: <TagComponent tag={{name: value, color: 'blue'}} />
        </ComboboxItem>
      ) : null}
    </Combobox>
  )
}
