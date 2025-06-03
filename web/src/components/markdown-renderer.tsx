import { useRef, useState } from 'react'
import { IconCopy, IconCheck } from '@tabler/icons-react'
import copy from 'copy-to-clipboard'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'

interface MarkdownRendererProps {
  content: string
  className?: string
}

interface CodeBlockProps {
  children: React.ReactNode
  className?: string
}

function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const codeRef = useRef<HTMLElement>(null)

  const getLanguageFromClassName = (className?: string) => {
    return className?.match(/language-(\w+)/)?.[1] || 'text'
  }

  const language = getLanguageFromClassName(className)

  const handleCopy = () => {
    if (codeRef.current) {
      const text = codeRef.current.textContent || ''
      copy(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className='group relative'>
      <div className='flex items-center justify-between rounded-t-md border-b py-2'>
        <span className='text-muted text-sm font-medium'>{language}</span>
        <Button
          variant='ghost'
          size='sm'
          onClick={handleCopy}
          className='h-8 w-8 p-0'
        >
          {copied ? (
            <IconCheck className='h-4 w-4 text-green-500' />
          ) : (
            <IconCopy className='h-4 w-4' />
          )}
        </Button>
      </div>
      <code ref={codeRef} className={className} {...props}>
        {children}
      </code>
    </div>
  )
}

export function MarkdownRenderer({
  content,
  className,
}: MarkdownRendererProps) {
  return (
    <div className={cn('prose dark:prose-invert max-w-none', className)}>
      <ReactMarkdown
        rehypePlugins={[[rehypeHighlight, { detect: true }]]}
        remarkPlugins={[remarkGfm]}
        components={{
          code: ({ node, className, children, ...props }) => {
            if (!className) {
              return <code className={className}>{children}</code>
            }
            return (
              <CodeBlock className={className} {...props}>
                {children}
              </CodeBlock>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
