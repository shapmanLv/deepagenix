import { KnowledgeNavRoute } from '../constants'

export const useKnowledgeNavLinks = (key: KnowledgeNavRoute, id: string) => {
  return [
    {
      title: '文档',
      href: `/knowledge/detail/${id}/documents`,
      isActive: key === KnowledgeNavRoute.DOCUMENTS,
    },
    {
      title: '召回测试',
      href: `/knowledge/detail/${id}/retrieval-testing`,
      isActive: key === KnowledgeNavRoute.RETRIEVAL_TESTING,
    },
    {
      title: '设置',
      href: `/knowledge/detail/${id}/settings`,
      isActive: key === KnowledgeNavRoute.SETTINGS,
    },
  ]
}
