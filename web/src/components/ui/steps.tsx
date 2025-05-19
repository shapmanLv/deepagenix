import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Step {
  title: string
  description?: string
}

interface StepsProps {
  steps: Step[]
  activeStep: number
  className?: string
}

const Steps = ({ steps, activeStep, className }: StepsProps) => {
  return (
    <div className={cn('w-full', className)}>
      <div className='flex justify-between'>
        {steps.map((step, index) => {
          const isCompleted = index < activeStep
          const isCurrent = index === activeStep
          const stepWidth = 100 / (steps.length - 1)

          return (
            <div
              key={step.title}
              className='relative flex flex-1 flex-col items-center'
              style={{
                width: index === steps.length - 1 ? 'auto' : `${stepWidth}%`,
              }}
            >
              {/* 步骤之间的连接线 */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'absolute top-4 right-0 left-[calc(50%+16px)] h-[2px] -translate-y-1/2 transform',
                    index < activeStep ? 'bg-primary' : 'bg-muted'
                  )}
                />
              )}

              {/* 步骤指示器 */}
              <div className='flex flex-col items-center gap-2'>
                <div
                  className={cn(
                    'relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2',
                    'transition-colors duration-300',
                    isCompleted
                      ? 'border-primary bg-primary text-primary-foreground'
                      : isCurrent
                        ? 'border-primary bg-background text-primary'
                        : 'border-muted bg-background text-muted-foreground'
                  )}
                >
                  {isCompleted ? (
                    <Check className='h-4 w-4' />
                  ) : (
                    <span className='font-medium'>{index + 1}</span>
                  )}
                </div>

                {/* 文字内容 */}
                <div className='mt-2 text-center'>
                  <h3
                    className={cn(
                      'text-sm font-medium',
                      isCurrent || isCompleted
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                    )}
                  >
                    {step.title}
                  </h3>
                  {step.description && (
                    <p className='text-muted-foreground mt-1 text-xs'>
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { Steps }
