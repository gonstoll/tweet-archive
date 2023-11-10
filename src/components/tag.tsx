import type {Tag} from '~/db/models/tag'
import type {tagColors} from '~/db/schema'
import {classNames} from '~/utils/classnames'

const colors = {
  blue: 'bg-blue-100 dark:bg-blue-800',
  red: 'bg-red-100 dark:bg-red-800',
  green: 'bg-green-100 dark:bg-green-800',
  yellow: 'bg-yellow-100 dark:bg-yellow-700',
  gray: 'bg-gray-200 dark:bg-gray-800',
  orange: 'bg-orange-200 dark:bg-orange-700',
  purple: 'bg-purple-200 dark:bg-purple-800',
  pink: 'bg-pink-200 dark:bg-pink-800',
} satisfies Record<(typeof tagColors)[number], string>

export function Tag({tag}: {tag: Omit<Tag, 'id' | 'userId'>}) {
  return (
    <span
      className={classNames(
        colors[tag.color],
        'rounded-md px-2 py-1 text-sm text-zinc-900 dark:text-zinc-100',
      )}
    >
      #{tag.name}
    </span>
  )
}
