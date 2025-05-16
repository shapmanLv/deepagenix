'use client'

import { createContext, useContext, useState, useCallback } from 'react'

type LoadingContextType = {
  isLoading: boolean
  message: string
  startLoading: (message?: string) => void
  stopLoading: () => void
  setLoadingMessage: (message: string) => void
}

const LoadingContext = createContext<LoadingContextType | null>(null)

// eslint-disable-next-line react-refresh/only-export-components
export function useLoading() {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState('Loading...')

  const startLoading = useCallback((newMessage?: string) => {
    if (newMessage) setMessage(newMessage)
    setIsLoading(true)
  }, [])

  const stopLoading = useCallback(() => {
    setIsLoading(false)
  }, [])

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        message,
        startLoading,
        stopLoading,
        setLoadingMessage: setMessage,
      }}
    >
      {children}
    </LoadingContext.Provider>
  )
}
