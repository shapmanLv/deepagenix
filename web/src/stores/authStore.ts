import { LoginResponse } from '@/services/login'
import { create } from 'zustand'
import dayjs from '@/lib/dayjs'
import { localAccessToken, localRefreshToken, localExpiresAtUtc } from './lcoal'

interface AuthState {
  accessToken?: string
  refreshToken?: string
  expiresAtUtc?: string
  error?: string
  setTokens: (tokens: LoginResponse) => void
  setError: (error?: string) => void
  clearTokens: () => void
  isAccessTokenExpired: () => boolean
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: localAccessToken.get(),
  refreshToken: localRefreshToken.get(),
  error: undefined,
  setTokens: ({ accessToken, refreshToken, expiresAtUtc }) => {
    localAccessToken.set(accessToken)
    localRefreshToken.set(refreshToken)
    localExpiresAtUtc.set(expiresAtUtc)
    set({ accessToken, refreshToken, expiresAtUtc })
  },
  setError: (error) => set({ error }),
  clearTokens: () => {
    localAccessToken.set()
    localRefreshToken.set()
    localExpiresAtUtc.set()
    set({
      accessToken: undefined,
      refreshToken: undefined,
      expiresAtUtc: undefined,
      error: undefined,
    })
  },
  isAccessTokenExpired: () => {
    const expiresAtUtc = localExpiresAtUtc.get()
    if (!expiresAtUtc) return true
    return dayjs().isAfter(dayjs(expiresAtUtc))
  },
}))
