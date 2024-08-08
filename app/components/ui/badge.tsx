import {cva, type VariantProps} from 'class-variance-authority'
import type * as React from 'react'
import {cn} from '~/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
        blue: 'bg-blue-100 dark:bg-blue-800',
        red: 'bg-red-100 dark:bg-red-800',
        green: 'bg-green-100 dark:bg-green-800',
        yellow: 'bg-yellow-100 dark:bg-yellow-700',
        gray: 'bg-gray-200 dark:bg-gray-800',
        orange: 'bg-orange-200 dark:bg-orange-700',
        purple: 'bg-purple-200 dark:bg-purple-800',
        pink: 'bg-pink-200 dark:bg-pink-800',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({className, variant, ...props}: BadgeProps) {
  return <div className={cn(badgeVariants({variant}), className)} {...props} />
}

export {Badge, badgeVariants}
