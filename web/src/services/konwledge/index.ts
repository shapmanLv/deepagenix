import { useQuery } from '@tanstack/react-query'
import { httpClient } from '@/lib/http-client'

export interface LanguagesItem {
  /**
   * 语言名称
   */
  name: string
  /**
   * 语言code
   */
  value: string
}

/** 获取语言列表 */
export const useGetLanguages = (params: { query: string }, trigger = true) => {
  const { data, isLoading } = useQuery({
    queryKey: ['get-languages', params],
    enabled: !!trigger,
    queryFn: () => {
      return httpClient.get<LanguagesItem[]>(`/dk/api/knowledge/languages`)
    },
  })

  return { data, isLoading }
}
