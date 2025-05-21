import { z } from 'zod'

export const IconTypeSchema = z.enum([
  'IconFolders',
  'IconFolderFilled',
  'IconDatabase',
  'IconBrandDatabricks',
])

export type IconType = z.infer<typeof IconTypeSchema>

export const IndexConfigSchema = z.object({
  documentSegmentModel: z.string(),
  embeddingModel: z.string(),
  participlePlugin: z.string(),
})

const BaseKnowledgeItemSchema = z.object({
  description: z
    .string()
    .max(200, { message: '描述不能超过200个字符' })
    .optional(),
  icon: IconTypeSchema.refine((val) => !!val, {
    message: '需要选择图标',
  }),
  name: z
    .string()
    .min(2, { message: '名称必须至少包含 2 个字符' })
    .max(50, { message: '名称不能超过50个字符' }),
  indexConfig: IndexConfigSchema,
  language: z.string(),
})

export const FormKnowledgeItemSchema = BaseKnowledgeItemSchema.extend({
  id: z.string().optional(),
})

export const KnowledgeItemSchema = BaseKnowledgeItemSchema.extend({
  id: z.string(),
})

export type FormKnowledgeItem = z.infer<typeof FormKnowledgeItemSchema>
export type KnowledgeItem = z.infer<typeof KnowledgeItemSchema>
export type IndexConfig = z.infer<typeof IndexConfigSchema>

export const DocumentSchema = z.object({
  id: z.string(),
  name: z.string(),
  wordCount: z.number(),
  tokens: z.number(),
  doc_metadata: z.string(),
  mode: z.string(),
})

export type DocumentItem = z.infer<typeof DocumentSchema>
