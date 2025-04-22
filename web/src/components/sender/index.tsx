import {
  IconPaperclip,
  IconPhotoPlus,
  IconPlus,
  IconSend,
} from '@tabler/icons-react'
import { Button } from '../ui/button'

const Sender = () => {
  return (
    <div className='border-input focus-within:ring-ring flex flex-col items-end gap-2 rounded-md border px-4 py-3 focus-within:ring-1 focus-within:outline-hidden'>
      <textarea
        placeholder='Type your messages...'
        className='rounded-0 h-[58px] w-full flex-auto resize-none self-center bg-inherit p-0 transition-all duration-300 ease-in-out focus-visible:outline-hidden'
      />

      <div className='flex w-full items-center justify-between'>
        <div className='flex gap-2'>
          <Button
            size='icon'
            type='button'
            variant='ghost'
            className='h-8 rounded-md'
          >
            <IconPlus size={20} className='stroke-muted-foreground' />
          </Button>
          <Button
            size='icon'
            type='button'
            variant='ghost'
            className='hidden h-8 rounded-md lg:inline-flex'
          >
            <IconPhotoPlus size={20} className='stroke-muted-foreground' />
          </Button>
          <Button
            size='icon'
            type='button'
            variant='ghost'
            className='hidden h-8 rounded-md lg:inline-flex'
          >
            <IconPaperclip size={20} className='stroke-muted-foreground' />
          </Button>
        </div>

        <div className='flex flex-none'>
          <Button variant='ghost' size='icon' className='inline-flex'>
            <IconSend size={20} />
          </Button>
        </div>
      </div>
    </div>
  )
}

export { Sender }
