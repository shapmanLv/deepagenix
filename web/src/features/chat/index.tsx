'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { Sender } from '@/components/sender'
import { ThemeSwitch } from '@/components/theme-switch'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // 判断是否有消息
  const hasMessages = messages.length > 0

  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // 发送消息后滚动到底部
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 模拟加载历史消息
  const loadMoreMessages = useCallback(async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)

    // 模拟API调用延迟
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // 模拟历史消息数据
    const newMessages: Message[] = Array.from({ length: 10 }, (_, index) => ({
      id: `history-${page}-${index}`,
      content: `这是第${page}页的历史消息 ${index + 1}`,
      role: index % 2 === 0 ? 'user' : 'assistant',
      timestamp: new Date(Date.now() - (page * 10 + index) * 60000), // 每条消息间隔1分钟
    }))

    setMessages((prev) => [...newMessages, ...prev])
    setPage((prev) => prev + 1)

    // 模拟没有更多数据的情况
    if (page >= 5) {
      setHasMore(false)
    }

    setIsLoading(false)
  }, [isLoading, hasMore, page])

  // 处理滚动事件
  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop } = event.currentTarget

      // 当滚动到顶部附近时加载更多
      if (scrollTop < 100 && hasMore && !isLoading) {
        loadMoreMessages()
      }
    },
    [hasMore, isLoading, loadMoreMessages]
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

    // 模拟AI回复
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `我收到了您的消息："${content.trim()}"。这是一个模拟回复，在实际应用中这里会连接到真正的AI服务。`,
        role: 'assistant',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])

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
          {/* Messages Area - 只有在有消息时才显示 */}
          {hasMessages && (
            <div
              className={cn(
                'flex-1 overflow-hidden transition-all duration-500 ease-out',
                isTransitioning ? 'animate-slide-down' : ''
              )}
            >
              <ScrollArea
                className='h-full'
                ref={scrollAreaRef}
                onScrollCapture={handleScroll}
              >
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
                        className={cn(
                          'flex gap-4',
                          message.role === 'user'
                            ? 'justify-end'
                            : 'justify-start'
                        )}
                      >
                        {message.role === 'assistant' && (
                          <Avatar className='h-8 w-8 shrink-0'>
                            <AvatarImage src='/images/ai-avatar.png' />
                            <AvatarFallback className='bg-primary text-primary-foreground'>
                              AI
                            </AvatarFallback>
                          </Avatar>
                        )}

                        <div
                          className={cn(
                            'max-w-[80%] rounded-lg px-4 py-3',
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          )}
                        >
                          <p className='text-sm leading-relaxed whitespace-pre-wrap'>
                            {message.content}
                          </p>
                          <div className='mt-2 text-xs opacity-70'>
                            {message.timestamp.toLocaleTimeString('zh-CN', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>

                        {message.role === 'user' && (
                          <Avatar className='h-8 w-8 shrink-0'>
                            <AvatarImage src='/images/user-avatar.png' />
                            <AvatarFallback className='bg-secondary text-secondary-foreground'>
                              您
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* 滚动到底部的锚点 */}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Input Area - 添加向下滑动动画 */}
          <div
            className={cn(
              'p-4 transition-all duration-500 ease-out',
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
