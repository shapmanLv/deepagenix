import { createFileRoute } from '@tanstack/react-router'
import RetrievalTesting from '@/features/knowledge/retrieval-testing'

export const Route = createFileRoute(
  '/_authenticated/knowledge/detail/$id/retrieval-testing'
)({
  component: RetrievalTesting,
})
