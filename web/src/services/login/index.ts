import { useMutation } from '@tanstack/react-query'
import { httpClient } from '@/lib/http-client'

export interface LoginResponse {
  accessToken: string
  expiresAtUtc: string
  refreshToken: string
}

export interface LoginParams {
  password: string
  username: string
}

export function useLogin() {
  return useMutation({
    mutationFn: (body: LoginParams) =>
      httpClient.post<LoginResponse>(`/api/user/login`, body),
  })
}

export interface RegisterParams {
  password: string
  username: string
}

export function useRegister() {
  return useMutation({
    mutationFn: (body: RegisterParams) =>
      httpClient.post<LoginResponse>(`/api/user/register`, body),
  })
}

export interface RefreshTokenParams {
  refreshToken: string
}

export function useRefreshToken() {
  return useMutation({
    mutationFn: (params: RefreshTokenParams) =>
      httpClient.post<LoginResponse>(
        `/api/user/refresh/${params?.refreshToken}`
      ),
  })
}
