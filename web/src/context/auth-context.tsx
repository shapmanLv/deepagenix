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
      const {
        accessToken,
        refreshToken: storedRefreshToken,
        isAccessTokenExpired,
        setTokens,
      } = useAuthStore.getState()

      if (!accessToken) {
        startLoading('', 1000)
        navigate({ to: '/sign-in', replace: true })
        return
      }

      if (isAccessTokenExpired()) {
        if (!storedRefreshToken) return
        const res = await refreshToken({
          refreshToken: storedRefreshToken,
        })
        if (!res.code) {
          setTokens({
            accessToken: res?.data.accessToken,
            refreshToken: res?.data.refreshToken,
            expiresAtUtc: res?.data.expiresAtUtc,
          })
        }
      }
    }

    checkAuthentication()
  }, [navigate, refreshToken, startLoading])

  return <>{children}</>
}
