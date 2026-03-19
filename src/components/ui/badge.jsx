import React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        imperative: 'bg-[hsl(var(--gk-blue))] text-white',
        guideline: 'bg-[hsl(var(--gk-green))] text-white',
        category:
          'border border-border bg-secondary text-secondary-foreground hover:bg-accent/20',
        outline:
          'border border-border text-muted-foreground',
        default:
          'bg-primary text-primary-foreground',
        secondary:
          'bg-secondary text-secondary-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

const Badge = React.forwardRef(({ className, variant, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
})
Badge.displayName = 'Badge'

export { Badge, badgeVariants }
