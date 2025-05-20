import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/authStore'
import { useLoading } from './loading-context'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const { startLoading } = useLoading()

  useEffect(() => {
    const checkAuthentication = async () => {
      const authToken = useAuthStore.getState().accessToken
      if (!authToken) {
        startLoading('', 1000)
        navigate({ to: '/sign-in', replace: true })
        return
      }
    }

    checkAuthentication()
  }, [navigate, startLoading])

  return <>{children}</>
}
