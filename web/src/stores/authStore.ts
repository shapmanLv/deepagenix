import { create } from 'zustand'
import { localAccessToken, localRefreshToken } from './lcoal'

interface AuthState {
  accessToken?: string
  refreshToken?: string
  expiresAtUtc?: string
  isLoading: boolean
  error?: string
  setTokens: (tokens: {
    accessToken: string
    refreshToken: string
    expiresAtUtc: string
  }) => void
  setLoading: (isLoading: boolean) => void
  setError: (error?: string) => void
  clearTokens: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: localAccessToken.get(),
  refreshToken: localRefreshToken.get(),
  expiresAtUtc: undefined,
  isLoading: false,
  error: undefined,
  setTokens: ({ accessToken, refreshToken, expiresAtUtc }) => {
    localAccessToken.set(accessToken)
    localRefreshToken.set(refreshToken)
    set({ accessToken, refreshToken, expiresAtUtc })
  },
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearTokens: () => {
    localAccessToken.set()
    localRefreshToken.set()
    set({
      accessToken: undefined,
      refreshToken: undefined,
      expiresAtUtc: undefined,
      error: undefined,
    })
  },
}))
