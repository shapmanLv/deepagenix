import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
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

export type BaseResponse<T = unknown> = {
  code: number
  data: T
  message?: string
  timestamp?: number
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

class HttpClient {
  private readonly instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: '/da',
      timeout: 15_000,
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

  private handleRequest = (config: InternalAxiosRequestConfig) => {
    const { requireAuth = true } = config

    if (requireAuth) {
      const token = useAuthStore.getState().auth.accessToken
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }

    return config
  }

  private handleResponse(response: AxiosResponse<BaseResponse>): AxiosResponse {
    const { data } = response

    if (data.code !== 200) {
      const error = new Error(data.message || 'Business Error') as AxiosError
      error.response = response
      error.isAxiosError = true
      throw error
    }

    return response
  }

  private handleError = (error: AxiosError<BaseResponse>) => {
    const { response, config } = error

    // 处理取消请求的特殊情况
    if (axios.isCancel(error)) {
      return Promise.reject({ name: 'Canceled', message: 'Request canceled' })
    }

    // 错误提示处理
    if (config?.showError !== false) {
      const errorMessage = response?.data?.message || 'Network Error'

      toast.error(errorMessage, {
        position: 'top-center',
        duration: 5000,
      })
    }

    // 认证失效处理
    if (response?.status === 401) {
      useAuthStore.getState().auth.reset()
    }

    return Promise.reject(error)
  }

  public request = async <T = unknown>(config: RequestConfig) => {
    return this.instance.request<BaseResponse<T>, T>(config)
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

      // 清理资源
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
