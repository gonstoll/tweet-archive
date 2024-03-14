'use client'
import {useFormStatus} from 'react-dom'
import {Spinner} from '~/components/spinner'

export function SubmitButton({type}: {type: 'create' | 'edit'}) {
  const {pending} = useFormStatus()

  return (
    <button
      type="submit"
      aria-disabled={pending}
      disabled={pending}
      className="flex items-center gap-2 rounded-md border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-100 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
    >
      {pending ? <Spinner size="small" inline /> : null}
      {type === 'create' ? 'Add tweet' : 'Save changes'}
    </button>
  )
}
