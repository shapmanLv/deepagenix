import { useState, KeyboardEvent } from 'react'
import {
  IconPaperclip,
  IconPhotoPlus,
  IconPlus,
  IconSend,
} from '@tabler/icons-react'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'

interface SenderProps {
  onSendMessage: (message: string) => void
}

const Sender = ({ onSendMessage }: SenderProps) => {
  const [message, setMessage] = useState('')
  const [isComposing, setIsComposing] = useState(false)

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message)
      setMessage('')
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleCompositionStart = () => {
    setIsComposing(true)
  }

  const handleCompositionEnd = () => {
    setIsComposing(false)
  }

  return (
    <div className='border-input focus-within:ring-ring bg-background flex flex-col items-end gap-2 rounded-lg border px-4 py-3 shadow-sm focus-within:ring-1 focus-within:outline-hidden'>
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        placeholder='输入您的消息... (按 Enter 发送，Shift + Enter 换行)'
        className='max-h-[200px] min-h-[60px] w-full resize-none border-0 bg-transparent p-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0'
        rows={1}
      />

      <div className='flex w-full items-center justify-between'>
        <div className='flex gap-1'>
          <Button
            size='icon'
            type='button'
            variant='ghost'
            className='hover:bg-muted h-8 w-8 rounded-md'
            title='添加附件'
          >
            <IconPlus size={18} className='text-muted-foreground' />
          </Button>
          <Button
            size='icon'
            type='button'
            variant='ghost'
            className='hover:bg-muted hidden h-8 w-8 rounded-md lg:inline-flex'
            title='添加图片'
          >
            <IconPhotoPlus size={18} className='text-muted-foreground' />
          </Button>
          <Button
            size='icon'
            type='button'
            variant='ghost'
            className='hover:bg-muted hidden h-8 w-8 rounded-md lg:inline-flex'
            title='添加文件'
          >
            <IconPaperclip size={18} className='text-muted-foreground' />
          </Button>
        </div>

        <div className='flex items-center gap-2'>
          <div className='text-muted-foreground text-xs'>
            {message.length}/2000
          </div>
          <Button
            onClick={handleSend}
            disabled={!message.trim()}
            size='icon'
            className='h-8 w-8 rounded-md'
            title='发送消息'
          >
            <IconSend size={18} />
          </Button>
        </div>
      </div>
    </div>
  )
}

export { Sender }
