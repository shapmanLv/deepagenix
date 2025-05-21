import { useQuery } from '@tanstack/react-query'
import { httpClient } from '@/lib/http-client'

export interface LanguagesItem {
  name: string
  value: string
}

export const useGetLanguages = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['get-languages'],
    queryFn: () => {
      return httpClient.get<LanguagesItem[]>(`/dk/api/knowledge/languages`)
    },
  })

  return { data, isLoading }
}

export interface PluginsItem {
  description: string
  icon: string
  languages: string[]
  name: string
  value: string
}

export const useGetPlugins = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['get-plugins'],
    queryFn: () => {
      return httpClient.get<PluginsItem[]>(
        `/dk/api/knowledge/participle/plugins`
      )
    },
  })

  return { data, isLoading }
}
