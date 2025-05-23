import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { httpClient } from '@/lib/http-client'

export interface EmbeddingItem {
  description: string
  /**
   * 开发者
   */
  developer: string
  /**
   * embedding 维度
   */
  dimension: number
  icon: string
  languages: string[]
  name: string
  value: string
}

export const useGetEmbeddings = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['get-embeddings'],
    queryFn: () => {
      return httpClient.get<EmbeddingItem[]>(`/da/api/model/embeddings`)
    },
  })

  const embeddings = useMemo(() => {
    return data?.data ?? []
  }, [data])

  return { embeddings, isLoading }
}

export interface DocumentSegmentItem {
  description: string
  /**
   * 是否可选
   */
  disable: boolean
  icon: string
  /**
   * 上下文大小，128k、64k 等，单位k
   */
  maxContextTokens: number
  name: string
  /**
   * 模型系列
   */
  series: string
  value: string
}

export const useGetDocumentSegments = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['get-documentSegment'],
    queryFn: () => {
      return httpClient.get<DocumentSegmentItem[]>(
        `/da/api/model/chats/documentSegment`
      )
    },
  })

  return { data, isLoading }
}
