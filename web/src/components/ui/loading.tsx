import { IconLoader } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

interface LoadingProps {
  message?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Loading({
  message = '加载中...',
  className,
  size = 'md',
}: LoadingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3',
        className
      )}
    >
      <IconLoader
        className={cn('text-primary animate-spin', sizeClasses[size])}
        stroke={1.5}
      />
      {message && (
        <p className='text-muted-foreground text-sm font-medium'>{message}</p>
      )}
    </div>
  )
}

// 页面级别的Loading覆盖层
export function PageLoading({
  message = '加载中...',
  className,
}: LoadingProps) {
  return (
    <div
      className={cn(
        'absolute inset-0 z-10 flex items-center justify-center',
        'bg-background/80 backdrop-blur-sm',
        className
      )}
    >
      <Loading message={message} size='lg' />
    </div>
  )
}

// 内容区域的Loading
export function ContentLoading({
  message = '加载中...',
  className,
}: LoadingProps) {
  return (
    <div
      className={cn(
        'bg-background/80 flex h-full min-h-[200px] w-full items-center justify-center backdrop-blur-sm',
        className
      )}
    >
      <Loading message={message} />
    </div>
  )
}
