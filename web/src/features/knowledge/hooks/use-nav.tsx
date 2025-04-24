import { KnowledgeNavRoute } from '../constants'

export const useKnowledgeNavLinks = (key: KnowledgeNavRoute, id: string) => {
  return [
    {
      title: 'Documents',
      href: `/knowledge/detail/${id}/documents`,
      isActive: key === KnowledgeNavRoute.DOCUMENTS,
    },
    {
      title: 'Retrieval Testing',
      href: `/knowledge/detail/${id}/retrieval-testing`,
      isActive: key === KnowledgeNavRoute.RETRIEVAL_TESTING,
    },
    {
      title: 'Settings',
      href: `/knowledge/detail/${id}/settings`,
      isActive: key === KnowledgeNavRoute.SETTINGS,
    },
  ]
}
