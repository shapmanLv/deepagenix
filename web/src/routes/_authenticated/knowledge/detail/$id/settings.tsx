import { createFileRoute } from '@tanstack/react-router'
import Settings from '@/features/knowledge/settings'

export const Route = createFileRoute(
  '/_authenticated/knowledge/detail/$id/settings'
)({
  component: Settings,
})
