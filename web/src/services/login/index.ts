import { useMutation } from '@tanstack/react-query'
import { httpClient, type BaseResponse } from '@/lib/http-client'

export interface LoginResponse {
  accessToken: string
  expiresAtUtc: string
  refreshToken: string
}

export function useLogin() {
  return useMutation({
    mutationFn: () =>
      httpClient.post<BaseResponse<LoginResponse>>(`/api/user/anonymous/login`),
  })
}
