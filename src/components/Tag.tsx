import {Tag} from '~/db/db'
import {tagColors} from '~/db/schema'
import {classNames} from '~/utils/classnames'

const colors = {
  blue: 'bg-blue-100 text-blue-800',
  red: 'bg-red-100 text-red-800',
  green: 'bg-green-100 text-green-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  gray: 'bg-gray-100 text-gray-800',
  brown: 'bg-brown-100 text-brown-800',
  orange: 'bg-orange-100 text-orange-800',
  purple: 'bg-purple-100 text-purple-800',
  pink: 'bg-pink-100 text-pink-800',
} satisfies Record<(typeof tagColors)[number], string>

export default function Tag({tag}: {tag: Omit<Tag, 'id'>}) {
  return (
    <span
      className={classNames(colors[tag.color], 'rounded-md px-3 py-1 text-sm')}
    >
      #{tag.name}
    </span>
  )
}
