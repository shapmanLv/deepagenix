'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { MarkdownRenderer } from '@/components/markdown-renderer'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { Sender } from '@/components/sender'
import { ThemeSwitch } from '@/components/theme-switch'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  isStreaming?: boolean
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const shouldScrollRef = useRef(false)
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(
    null
  )

  // 判断是否有消息
  const hasMessages = messages.length > 0

  const scrollToLatestUserMessage = useCallback(
    (smooth = true) => {
      if (shouldScrollRef.current) return
      // 从后向前查找最后一个用户消息
      let latestUserMessageIndex = -1
      for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i].role === 'user') {
          latestUserMessageIndex = i
          break
        }
      }

      if (latestUserMessageIndex !== -1 && scrollAreaRef.current) {
        const messageElements =
          scrollAreaRef.current.querySelectorAll('[data-message-id]')

        if (messageElements.length > latestUserMessageIndex) {
          const targetElement = messageElements[latestUserMessageIndex]

          targetElement.scrollIntoView({
            behavior: smooth ? 'smooth' : 'auto',
            block: 'start',
          })
        }
      }
    },
    [messages, shouldScrollRef]
  )

  useEffect(() => {
    if (messages.length > 0) {
      requestAnimationFrame(() => {
        scrollToLatestUserMessage(true)
        shouldScrollRef.current = true
      })
    }
  }, [messages, scrollToLatestUserMessage, shouldScrollRef])

  // 模拟打字机效果的流式输出
  const simulateTypingEffect = useCallback(
    async (messageId: string, fullContent: string) => {
      setStreamingMessageId(messageId)

      // 逐字符显示，模拟打字机效果
      for (let i = 0; i <= fullContent.length; i++) {
        const partialContent = fullContent.slice(0, i)

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? {
                  ...msg,
                  content: partialContent,
                  isStreaming: i < fullContent.length,
                }
              : msg
          )
        )

        // 控制打字机速度（每个字符间隔50-100ms）
        const delay = 20
        await new Promise((resolve) => setTimeout(resolve, delay))
      }

      setStreamingMessageId(null)
    },
    []
  )

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return

    // 如果是第一条消息，触发布局转换动画
    if (messages.length === 0) {
      setIsTransitioning(true)
    }

    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      role: 'user',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    shouldScrollRef.current = false

    // 模拟AI回复 - 包含 Markdown 格式的打字机效果
    setTimeout(() => {
      const assistantMessageId = (Date.now() + 1).toString()
      const fullResponse = `我收到了您的消息："**${content.trim()}**"。\n\n这是一个模拟的 Markdown 格式回复，支持：\n\n## 功能特性\n\n- **粗体文字**\n- *斜体文字*\n- \`行内代码\`\n- [链接](https://example.com)\n\n### 代码块示例\n\n\`\`\`javascript\nfunction greet(name) {\n  console.log(\`Hello, \${name}!\`)\n}\n\ngreet('World')\n\`\`\`\n\n> 这是一个引用块，用于强调重要信息。\n\n在实际应用中，这里会连接到真正的AI服务，通过WebSocket或Server-Sent Events来实现真正的流式输出效果。`

      // 先添加空的助手消息
      const assistantMessage: Message = {
        id: assistantMessageId,
        content: '',
        role: 'assistant',
        timestamp: new Date(),
        isStreaming: true,
      }

      setMessages((prev) => [...prev, assistantMessage])

      // 开始打字机效果
      simulateTypingEffect(assistantMessageId, fullResponse)

      // 动画完成后重置状态
      if (isTransitioning) {
        setTimeout(() => setIsTransitioning(false), 500)
      }
    }, 1000)
  }

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <div className='ml-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main Chat Area ===== */}
      <Main fixed>
        <div className='relative flex h-full flex-col'>
          {hasMessages && (
            <div
              className={cn(
                'flex-1 overflow-hidden',
                isTransitioning
                  ? 'transition-opacity duration-300 ease-out'
                  : ''
              )}
            >
              <ScrollArea className='h-full' ref={scrollAreaRef}>
                <div className='mx-auto max-w-3xl px-4'>
                  {/* 加载指示器 */}
                  {isLoading && (
                    <div className='flex justify-center py-4'>
                      <Loader2 className='text-muted-foreground h-6 w-6 animate-spin' />
                    </div>
                  )}

                  {/* 没有更多消息提示 */}
                  {!hasMore && (
                    <div className='text-muted-foreground py-4 text-center text-sm'>
                      没有更多历史消息了
                    </div>
                  )}

                  {/* 消息列表 */}
                  <div className='space-y-6 py-6'>
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        data-message-id={message.id}
                        className={cn(
                          'flex gap-4',
                          message.role === 'user'
                            ? 'justify-end'
                            : 'justify-start'
                        )}
                      >
                        {message.role === 'assistant' && (
                          <Avatar className='h-8 w-8 shrink-0'>
                            <AvatarImage src='https://api.dicebear.com/7.x/miniavs/svg?seed=2' />
                            <AvatarFallback className='bg-primary text-primary-foreground'>
                              AI
                            </AvatarFallback>
                          </Avatar>
                        )}

                        <div
                          className={cn(
                            'max-w-[70%] rounded-2xl px-4 py-3 shadow-sm transition-all duration-200',
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground rounded-tr-md'
                              : 'bg-muted rounded-tl-md'
                          )}
                        >
                          {/* 使用 MarkdownRenderer 渲染消息内容 */}
                          <div className='text-sm leading-relaxed'>
                            <MarkdownRenderer
                              content={message.content}
                              className={cn(
                                message.role === 'user' ? 'prose-invert' : ''
                              )}
                            />
                          </div>
                          <div className='mt-2 text-xs opacity-70'>
                            {message.timestamp.toLocaleTimeString('zh-CN', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>

                        {message.role === 'user' && (
                          <Avatar className='h-8 w-8 shrink-0'>
                            <AvatarImage src='https://api.dicebear.com/7.x/miniavs/svg?seed=1' />
                            <AvatarFallback className='bg-secondary text-secondary-foreground'>
                              您
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* 滚动到底部的锚点 - 添加一些底部间距 */}
                  <div ref={messagesEndRef} className='h-4' />
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Input Area  */}
          <div
            className={cn(
              'p-4 transition-all duration-300 ease-out',
              hasMessages
                ? cn(
                    'relative translate-y-0 transform',
                    isTransitioning ? 'animate-slide-down-input' : ''
                  )
                : 'absolute inset-0 flex items-center justify-center'
            )}
          >
            <div className='mx-auto w-full max-w-3xl'>
              {/* 当没有消息时显示欢迎信息 */}
              {!hasMessages && (
                <div className='animate-fade-in mb-8 text-center'>
                  <h1 className='mb-2 text-2xl font-semibold'>
                    您好！我是您的AI助手
                  </h1>
                  <p className='text-muted-foreground'>
                    有什么可以帮助您的吗？
                  </p>
                </div>
              )}
              <div
                className={cn(
                  hasMessages && isTransitioning
                    ? 'animate-slide-down-input'
                    : ''
                )}
              >
                <Sender onSendMessage={handleSendMessage} />
              </div>
            </div>
          </div>
        </div>
      </Main>
    </>
  )
}
