import {Tag} from '~/db/db'
import {classNames} from '~/utils/classnames'

const tagColors = {
  blue: 'bg-blue-100 text-blue-800',
  red: 'bg-red-100 text-red-800',
  green: 'bg-green-100 text-green-800',
  yellow: 'bg-yellow-100 text-yellow-800',
}

export default function Tag({tag}: {tag: Omit<Tag, 'id'>}) {
  return (
    <span
      className={classNames(
        tagColors[tag.color],
        'rounded-md px-3 py-1 text-sm'
      )}
    >
      #{tag.name}
    </span>
  )
}
