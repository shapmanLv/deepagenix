import { createFileRoute } from '@tanstack/react-router'
import CreateKnowledge from '@/features/knowledge/create'

export const Route = createFileRoute('/_authenticated/knowledge/create/')({
  component: CreateKnowledge,
})
