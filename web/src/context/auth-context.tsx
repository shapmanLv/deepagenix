import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/authStore'
import { useLoading } from './loading-context'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const { startLoading, stopLoading } = useLoading()

  useEffect(() => {
    const checkAuthentication = async () => {
      startLoading()
      const authToken = useAuthStore.getState().accessToken

      if (!authToken) {
        navigate({ to: '/sign-in', replace: true })
        stopLoading()
        return
      }
      stopLoading()
    }

    checkAuthentication()
  }, [navigate, startLoading, stopLoading])

  return <>{children}</>
}
