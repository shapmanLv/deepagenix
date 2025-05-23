import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { LoginResponse } from '@/services/login'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/authStore'

// 类型声明增强
declare module 'axios' {
  interface AxiosRequestConfig {
    /** 是否显示全局错误提示（默认 true） */
    showError?: boolean
    /** 是否携带认证信息（默认 true） */
    requireAuth?: boolean
    /** 跳过响应拦截器直接返回原始响应 */
    rawResponse?: boolean
  }
}

export enum CodeStatus {
  Success = 0,
  Error = 1,
}

export type BaseResponse<T = unknown> = {
  data: T
  msg: string
  code: CodeStatus
}

export type BusinessError = Error & {
  code?: number
  response?: AxiosResponse<BaseResponse>
}

type RequestConfig = AxiosRequestConfig & {
  showError?: boolean
  requireAuth?: boolean
  rawResponse?: boolean
}

// 在模块顶部定义并发控制变量（单例模式共享状态）
let isRefreshing = false
let refreshPromise: Promise<void> | null = null

class HttpClient {
  private readonly instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: '/deepagenix-api',
      timeout: 15000,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    this.instance.interceptors.request.use(this.handleRequest)
    this.instance.interceptors.response.use(
      this.handleResponse,
      this.handleError
    )
  }

  private handleRequest = async (config: InternalAxiosRequestConfig) => {
    const { requireAuth = true } = config

    if (requireAuth) {
      const authStore = useAuthStore.getState()

      // 检查 Token 是否过期（带缓冲期）
      if (authStore.isAccessTokenExpired()) {
        const refreshToken = authStore.refreshToken

        // 无有效刷新令牌时直接中断
        if (!refreshToken) {
          authStore.clearTokens()
          throw new Error('No refresh token available')
        }

        // 并发控制核心逻辑
        if (!isRefreshing) {
          isRefreshing = true

          // 使用原生 axios 实例避免循环拦截（重要！）
          refreshPromise = axios
            .create({
              baseURL: '/deepagenix-api',
              timeout: 15000,
              withCredentials: true,
            })
            .post<AxiosResponse<LoginResponse>>(
              `/da/api/user/refresh/${refreshToken}`
            )
            .then(({ data }) => {
              // 再次验证过期状态（防止竞态条件）
              if (authStore.isAccessTokenExpired()) {
                authStore.setTokens(data.data)
              }
            })
            .catch((error) => {
              // 统一清理令牌并跳转登录
              authStore.clearTokens()
              throw new Error(`Token refresh failed: ${error.message}`)
            })
            .finally(() => {
              isRefreshing = false
              refreshPromise = null
            })
        }

        // 所有并发请求在此等待
        try {
          await refreshPromise
        } catch (error) {
          return Promise.reject(error)
        }
      }

      // 最终设置最新 Authorization 头
      const token = authStore.accessToken
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }

    return config
  }

  private handleResponse(response: AxiosResponse<BaseResponse>): AxiosResponse {
    const { data } = response

    if (data.code !== CodeStatus.Success) {
      toast.error(data?.msg || 'Network Error', {
        position: 'top-right',
        duration: 5000,
      })
    }

    return response
  }

  private handleError = (error: AxiosError<BaseResponse>) => {
    if (axios.isCancel(error)) {
      return Promise.reject({ name: 'Canceled', message: 'Request canceled' })
    }

    return Promise.reject(error)
  }

  public request = async <T = unknown>(config: RequestConfig) => {
    const resp = await this.instance.request<BaseResponse<T>>(config)
    return resp.data
  }

  public get = <T = unknown>(url: string, config?: RequestConfig) => {
    return this.request<T>({ ...config, method: 'GET', url })
  }

  public post = <T = unknown>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ) => {
    return this.request<T>({ ...config, method: 'POST', url, data })
  }

  public put = <T = unknown>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ) => {
    return this.request<T>({ ...config, method: 'PUT', url, data })
  }

  public delete = <T = unknown>(url: string, config?: RequestConfig) => {
    return this.request<T>({ ...config, method: 'DELETE', url })
  }

  public upload = <T = unknown>(
    url: string,
    files: File | File[],
    fieldName = 'files',
    config?: RequestConfig
  ) => {
    const formData = new FormData()
    const filesArray = Array.isArray(files) ? files : [files]

    filesArray.forEach((file, index) => {
      formData.append(`${fieldName}[${index}]`, file)
    })

    return this.post<T>(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
    })
  }

  public download = async (
    url: string,
    filename: string,
    config?: RequestConfig
  ) => {
    try {
      const response = await this.instance.get<Blob>(url, {
        ...config,
        responseType: 'blob',
        rawResponse: true,
      })

      const blob = new Blob([response.data])
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')

      link.href = downloadUrl
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()

      link.remove()
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      if (!axios.isCancel(error)) {
        throw error
      }
    }
  }

  public createCancelToken() {
    return axios.CancelToken.source()
  }
}

export const httpClient = new HttpClient()
