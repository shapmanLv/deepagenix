'use client'

import { IconLoader } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { useLoading } from '@/context/loading-context'

export function GlobalLoading() {
  const { isLoading, message } = useLoading()

  if (!isLoading) return null

  return (
    <div
      className={cn(
        'bg-background/80 fixed inset-0 z-[9999] backdrop-blur-sm',
        'flex items-center justify-center',
        'transition-all duration-300',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0'
      )}
    >
      <div className='flex flex-col items-center gap-4'>
        <IconLoader
          className='text-primary h-12 w-12 animate-spin'
          stroke={1.5}
        />
        <p className='text-muted-foreground text-lg font-medium'>{message}</p>
      </div>
    </div>
  )
}
