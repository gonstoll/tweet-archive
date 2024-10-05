import {useSearchParams} from '@remix-run/react'
import {CheckIcon, ListFilter} from 'lucide-react'
import * as React from 'react'
import {Badge} from '~/components/ui/badge'
import {Button} from '~/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '~/components/ui/command'
import {Popover, PopoverContent, PopoverTrigger} from '~/components/ui/popover'
import {Separator} from '~/components/ui/separator'
import type {Tag} from '~/db/models/tags'
import {cn} from '~/lib/utils'

type TagsFilterProps = {
  form?: boolean
  tags: Array<Tag>
  initialTags?: Array<Tag>
}

export function TagsFilter({tags, form = false, initialTags}: TagsFilterProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const preselectedTags = new Set(
    initialTags?.map(t => t.name) ?? searchParams.getAll('tags'),
  )
  const [selectedTags, setSelectedTags] = React.useState(preselectedTags)

  function isSelected(tag: Tag) {
    return selectedTags.has(tag.name)
  }

  function selectTag(tag: Tag) {
    const isTagSelected = isSelected(tag)

    setSelectedTags(prev => {
      if (isTagSelected) {
        prev.delete(tag.name)
        return new Set(prev)
      }
      prev.add(tag.name)
      return new Set(prev)
    })

    if (form) return

    setSearchParams(prev => {
      if (isTagSelected) {
        prev.delete('tags', tag.name)
        return prev
      }
      prev.append('tags', tag.name)
      return prev
    })
  }

  function clearTags() {
    setSelectedTags(new Set())
    setSearchParams(prev => {
      prev.delete('tags')
      return prev
    })
  }

  return (
    <React.Fragment>
      {form ? (
        <input
          type="hidden"
          name="tagIds"
          value={tags
            .filter(t => selectedTags.has(t.name))
            .map(t => t.id)
            .join(',')}
        />
      ) : null}

      <Popover>
        <PopoverTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className="h-8 border-dashed shadow-sm"
          >
            <ListFilter size={15} className="mr-2" /> Tags
            {selectedTags?.size > 0 ? (
              <>
                <Separator orientation="vertical" className="mx-2 h-4" />
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal lg:hidden"
                >
                  {selectedTags.size}
                </Badge>
                <div className="hidden space-x-1 lg:flex">
                  {selectedTags.size > 2 ? (
                    <Badge
                      variant="secondary"
                      className="rounded-sm px-1 font-normal"
                    >
                      {selectedTags.size} selected
                    </Badge>
                  ) : (
                    tags
                      .filter(t => selectedTags.has(t.name))
                      .map(t => (
                        <Badge
                          key={t.name}
                          variant="secondary"
                          className="rounded-sm px-1 font-normal"
                        >
                          {t.name}
                        </Badge>
                      ))
                  )}
                </div>
              </>
            ) : null}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Tags" />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {tags.map(t => {
                  return (
                    <CommandItem key={t.name} onSelect={() => selectTag(t)}>
                      <div
                        className={cn(
                          'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                          isSelected(t)
                            ? 'bg-primary text-primary-foreground'
                            : 'opacity-50 [&_svg]:invisible',
                        )}
                      >
                        <CheckIcon className="h-4 w-4" />
                      </div>
                      <Badge variant={t.color}>{t.name}</Badge>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
            {selectedTags.size > 0 ? (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={clearTags}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            ) : null}
          </Command>
        </PopoverContent>
      </Popover>
    </React.Fragment>
  )
}
