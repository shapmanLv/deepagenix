import { useMemo } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { queryClient } from '@/main'
import { httpClient } from '@/lib/http-client'
import { FormKnowledgeItem, KnowledgeItem } from './schema'

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

  const languages = useMemo(() => {
    return data?.data ?? []
  }, [data])

  return { languages, isLoading }
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

export interface IndexConfig {
  documentSegmentModel: string
  embeddingModel: string
  participlePlugin: string
}

export const useGetKnowledges = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['get-knowledges'],
    queryFn: () => {
      return httpClient.get<KnowledgeItem[]>(`/dk/api/knowledge`)
    },
  })

  const knowledges = useMemo(() => {
    return data?.data ?? []
  }, [data])

  return { knowledges, isLoading }
}

export const useGetKnowledgeDetail = (params: { id: string }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['get-knowledge-detail', params],
    queryFn: () => {
      return httpClient.get<KnowledgeItem[]>(`/dk/api/knowledge/${params.id}`)
    },
  })

  return { data, isLoading }
}

export function useCreateKnowledge() {
  return useMutation({
    mutationFn: (body: FormKnowledgeItem) =>
      httpClient.post(`/dk/api/knowledge`, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-knowledges'] })
    },
  })
}

export function useUpdateKnowledge() {
  return useMutation({
    mutationFn: (body: KnowledgeItem) =>
      httpClient.put(`/dk/api/knowledge/${body.id}`, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-knowledge-detail'] })
    },
  })
}
