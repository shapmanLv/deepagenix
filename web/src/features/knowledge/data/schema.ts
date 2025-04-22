import { z } from 'zod'

export const IconTypeSchema = z.enum([
  'IconFolders',
  'IconFolderFilled',
  'IconDatabase',
  'IconBrandDatabricks',
])

export type IconType = z.infer<typeof IconTypeSchema>

export const KnowledgeItemSchema = z.object({
  name: z.string(),
  icon: IconTypeSchema,
  documents: z.number(),
  relatedApplications: z.number(),
  desc: z.string(),
})

export type KnowledgeItem = z.infer<typeof KnowledgeItemSchema>
