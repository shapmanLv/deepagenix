'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from 'react'

type LoadingContextType = {
  isLoading: boolean
  message: string
  startLoading: (message?: string, duration?: number) => void
  stopLoading: () => void
  setLoadingMessage: (message: string) => void
}

const LoadingContext = createContext<LoadingContextType | null>(null)

export function useLoading() {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}

function GlobalLoader() {
  const { isLoading, message } = useLoading()

  if (!isLoading) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div className='flex min-w-[200px] flex-col items-center rounded-lg bg-white p-6 shadow-lg'>
        <div className='mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900'></div>
        <p className='text-sm text-gray-700'>{message}</p>
      </div>
    </div>
  )
}

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('Loading...')
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const startLoading = useCallback((newMessage?: string, duration?: number) => {
    if (newMessage !== undefined) setMessage(newMessage)
    setIsLoading(true)

    if (timerRef.current) clearTimeout(timerRef.current)

    if (duration && duration > 0) {
      timerRef.current = setTimeout(() => {
        setIsLoading(false)
        timerRef.current = null
      }, duration)
    }
  }, [])

  const stopLoading = useCallback(() => {
    setIsLoading(false)
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const setLoadingMessage = useCallback((newMessage: string) => {
    setMessage(newMessage)
  }, [])

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        message,
        startLoading,
        stopLoading,
        setLoadingMessage,
      }}
    >
      {children}
      <GlobalLoader />
    </LoadingContext.Provider>
  )
}
