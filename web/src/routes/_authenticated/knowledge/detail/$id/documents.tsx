import { createFileRoute } from '@tanstack/react-router'
import Documents from '@/features/knowledge/documents'

export const Route = createFileRoute(
  '/_authenticated/knowledge/detail/$id/documents'
)({
  component: Documents,
})
