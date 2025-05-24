import { useNavigate } from '@tanstack/react-router'
import { IconChevronLeft } from '@tabler/icons-react'
import { Button } from '../ui/button'

interface BackProps {
  to?: string
}

export function Back({ to }: BackProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (to) {
      navigate({ to })
    } else {
      window.history.back()
    }
  }

  return (
    <Button
      variant='outline'
      className='size-7 scale-125 sm:scale-100'
      onClick={handleClick}
    >
      <IconChevronLeft />
    </Button>
  )
}
