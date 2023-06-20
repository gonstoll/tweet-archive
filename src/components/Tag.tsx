import {Tag} from '~/db/db'
import {tagColors} from '~/db/schema'
import {classNames} from '~/utils/classnames'

const colors = {
  blue: 'bg-blue-100',
  red: 'bg-red-100',
  green: 'bg-green-100',
  yellow: 'bg-yellow-100',
  gray: 'bg-gray-400',
  orange: 'bg-orange-200',
  purple: 'bg-purple-300',
  pink: 'bg-pink-200',
} satisfies Record<(typeof tagColors)[number], string>

export default function Tag({tag}: {tag: Omit<Tag, 'id'>}) {
  return (
    <span
      className={classNames(
        colors[tag.color],
        'rounded-md px-2 py-1 text-sm text-black'
      )}
    >
      #{tag.name}
    </span>
  )
}
