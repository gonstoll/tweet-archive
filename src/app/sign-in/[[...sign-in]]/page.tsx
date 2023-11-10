import {SignIn} from '@clerk/nextjs'

export default function Page() {
  return (
    <SignIn
      appearance={{
        elements: {
          card: 'bg-zinc-100 dark:bg-zinc-950 shadow-lg border border-zinc-300 dark:border-zinc-700',
          headerTitle: 'text-zinc-900 dark:text-zinc-100',
          headerSubtitle: 'text-zinc-600 dark:text-zinc-400',
          socialButtonsBlockButton:
            'border-zinc-300 dark:border-zinc-700 bg-zinc-100 hover:bg-zinc-300 text-zinc-900',
          footerActionText: 'text-zinc-500',
          footerActionLink:
            'text-sky-600 hover:text-sky-700 dark:text-sky-500 dark:hover:text-sky-600',
        },
      }}
    />
  )
}
