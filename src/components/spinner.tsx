import {classNames} from '~/utils/classnames'

export function Spinner({
  size = 'medium',
  inline = false,
}: {
  size?: 'small' | 'medium'
  inline?: boolean
}) {
  return (
    <div
      className={classNames(
        'right-7 top-2 inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent',
        {
          absolute: !inline,
          'h-3 w-3 border-2': size === 'small',
          'h-6 w-6 border-4': size === 'medium',
        },
      )}
      role="status"
    />
  )
}
