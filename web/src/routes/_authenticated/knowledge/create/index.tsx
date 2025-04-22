import { createFileRoute } from '@tanstack/react-router'
import KnowledgeCreatePage from '@/features/knowledge/create'

export const Route = createFileRoute('/_authenticated/knowledge/create/')({
  component: KnowledgeCreatePage,
})
