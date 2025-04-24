import { z } from 'zod'

export const IconTypeSchema = z.enum([
  'IconFolders',
  'IconFolderFilled',
  'IconDatabase',
  'IconBrandDatabricks',
])

export type IconType = z.infer<typeof IconTypeSchema>

export const KnowledgeItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: IconTypeSchema,
  documents: z.number(),
  relatedApplications: z.number(),
  desc: z.string(),
})

export type KnowledgeItem = z.infer<typeof KnowledgeItemSchema>

export const DocumentSchema = z.object({
  id: z.string(),
  name: z.string(),
  wordCount: z.number(),
  tokens: z.number(),
  doc_metadata: z.string(),
  mode: z.string(),
})

export type DocumentItem = z.infer<typeof DocumentSchema>
