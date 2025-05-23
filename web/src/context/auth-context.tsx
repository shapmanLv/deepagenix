import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useRefreshToken } from '@/services/login'
import { useAuthStore } from '@/stores/authStore'
import { useLoading } from './loading-context'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const { mutateAsync: refreshToken } = useRefreshToken()
  const { startLoading } = useLoading()

  useEffect(() => {
    const checkAuthentication = async () => {
      const { accessToken } = useAuthStore.getState()

      if (!accessToken) {
        startLoading('', 1000)
        navigate({ to: '/sign-in', replace: true })
        return
      }
    }

    checkAuthentication()
  }, [navigate, refreshToken, startLoading])

  return <>{children}</>
}
