import { AxiosError } from 'axios'
import { QueryClient } from '@tanstack/react-query'

interface ErrorResponseData {
  code?: number
  data?: {
    message?: string
  }
  message?: string
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 本地开发环境禁用
      refetchOnWindowFocus: false,
      retry: (count: number, error: unknown) => {
        // 类型断言确保是 AxiosError
        const axiosError = error as AxiosError<ErrorResponseData>

        const data = axiosError?.response?.data
        const code = axiosError?.response?.status

        if (data?.code === 404 && data?.data?.message === 'Group not found') {
          return false
        }

        if (data?.code === 401 || code === 401) {
          return false
        }

        return count < 3
      },
    },
  },
})
