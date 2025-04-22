import { createFileRoute } from '@tanstack/react-router'
import Knowledge from '@/features/knowledge'

export const Route = createFileRoute('/_authenticated/knowledge/')({
  component: Knowledge,
})
