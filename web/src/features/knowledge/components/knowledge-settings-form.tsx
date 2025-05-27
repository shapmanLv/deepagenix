'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  IconBrandDatabricks,
  IconDatabase,
  IconFolderFilled,
  IconFolders,
} from '@tabler/icons-react'
import { useCreateKnowledge, useGetKnowledgeDetail } from '@/services/konwledge'
import {
  FormKnowledgeItem,
  FormKnowledgeItemSchema,
  IconTypeSchema,
} from '@/services/konwledge/schema'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { DocumentSegmentSelector } from '@/components/document-segment-selector'
import { EmbeddingSelector } from '@/components/embedding-selector'
import { LanguageSelector } from '@/components/language-select'
import { PluginSelector } from '@/components/plugins-selector'

export type KnowledgeType = 'create' | 'update'

interface Props {
  type: KnowledgeType
  currentRow?: FormKnowledgeItem
}

const defaultValues: FormKnowledgeItem = {
  name: '',
  description: '',
  language: 'zh-CN',
  icon: IconTypeSchema.Enum.IconFolders,
  indexConfig: {
    embeddingModel: '',
    participlePlugin: '',
    documentSegmentModel: '',
  },
}

export function KnowledgeSettingsForm({ type, currentRow }: Props) {
  const isUpdate = type === 'update'
  const { knowledgeDetail, isLoading } = useGetKnowledgeDetail({
    id: currentRow?.id ?? '',
  })
  const { mutateAsync: createKnowledge } = useCreateKnowledge()

  const form = useForm<FormKnowledgeItem>({
    resolver: zodResolver(FormKnowledgeItemSchema),
    defaultValues: defaultValues,
  })

  useEffect(() => {
    const shouldUseDetail = !!currentRow?.id && !!knowledgeDetail
    form.reset(shouldUseDetail ? knowledgeDetail : defaultValues)
  }, [currentRow?.id, knowledgeDetail, form])

  const onSubmit = async (values: FormKnowledgeItem) => {
    const res = await createKnowledge(values)
    if (!res.code) {
      form.reset()
    }
  }

  return (
    <div className='relative w-full py-1 pr-4 pl-1'>
      <div className='overflow-y-auto'>
        <Form {...form}>
          <form
            id='knowledge-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4 p-0.5'
          >
            {/* Name Field */}
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem className='grid grid-cols-4 items-start gap-4'>
                  <FormLabel className='col-span-1 pt-2 text-right'>
                    知识库名称
                  </FormLabel>
                  <div className='col-span-3 space-y-2'>
                    <FormControl>
                      <Input placeholder='请输入您的知识库名称' {...field} />
                    </FormControl>
                    <FormDescription className='text-xs'>
                      2-50个字符，必填字段
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {/* Icon Field */}
            <FormField
              control={form.control}
              name='icon'
              render={({ field }) => (
                <FormItem className='grid grid-cols-4 items-start gap-4'>
                  <FormLabel className='col-span-1 pt-2 text-right'>
                    图标
                  </FormLabel>
                  <div className='col-span-3'>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='选择图标类型' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={IconTypeSchema.Enum.IconFolders}>
                          <div className='flex items-center gap-2'>
                            <IconFolders className='h-4 w-4' />
                            <span>Folder Group</span>
                          </div>
                        </SelectItem>
                        <SelectItem
                          value={IconTypeSchema.Enum.IconFolderFilled}
                        >
                          <div className='flex items-center gap-2'>
                            <IconFolderFilled className='h-4 w-4' />
                            <span>Solid Folder</span>
                          </div>
                        </SelectItem>
                        <SelectItem value={IconTypeSchema.Enum.IconDatabase}>
                          <div className='flex items-center gap-2'>
                            <IconDatabase className='h-4 w-4' />
                            <span>Database</span>
                          </div>
                        </SelectItem>
                        <SelectItem
                          value={IconTypeSchema.Enum.IconBrandDatabricks}
                        >
                          <div className='flex items-center gap-2'>
                            <IconBrandDatabricks className='h-4 w-4' />
                            <span>Databricks</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {/* Language Field */}
            <FormField
              control={form.control}
              name='language'
              render={({ field }) => (
                <FormItem className='grid grid-cols-4 items-start gap-4'>
                  <FormLabel className='col-span-1 pt-2 text-right'>
                    语言
                  </FormLabel>
                  <div className='col-span-3'>
                    <LanguageSelector
                      onChange={(value) => {
                        form.setValue('indexConfig.embeddingModel', '')
                        field.onChange(value)
                      }}
                      value={field.value}
                    />
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {/* Embedding Model Field */}
            <FormField
              control={form.control}
              name='indexConfig.embeddingModel'
              render={({ field }) => (
                <FormItem className='grid grid-cols-4 items-start gap-4'>
                  <FormLabel className='col-span-1 pt-2 text-right'>
                    嵌入模型
                  </FormLabel>
                  <div className='col-span-3'>
                    <EmbeddingSelector
                      onChange={field.onChange}
                      value={field.value}
                      previewFilter={(embedding) =>
                        embedding?.languages?.includes(form.watch('language'))
                      }
                    />
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {/* Participle Plugin Field */}
            <FormField
              control={form.control}
              name='indexConfig.participlePlugin'
              render={({ field }) => (
                <FormItem className='grid grid-cols-4 items-start gap-4'>
                  <FormLabel className='col-span-1 pt-2 text-right'>
                    分词插件
                  </FormLabel>
                  <div className='col-span-3'>
                    <PluginSelector
                      onChange={field.onChange}
                      value={field.value}
                      previewFilter={(plugins) =>
                        plugins?.languages?.includes(form.watch('language'))
                      }
                    />
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {/* Document Segment Model Field */}
            <FormField
              control={form.control}
              name='indexConfig.documentSegmentModel'
              render={({ field }) => (
                <FormItem className='grid grid-cols-4 items-start gap-4'>
                  <FormLabel className='col-span-1 pt-2 text-right'>
                    文档分段模型
                  </FormLabel>
                  <div className='col-span-3'>
                    <DocumentSegmentSelector
                      onChange={field.onChange}
                      value={field.value}
                    />
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {/* Description Field */}
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem className='grid grid-cols-4 items-start gap-4'>
                  <FormLabel className='col-span-1 pt-2 text-right'>
                    知识库描述
                  </FormLabel>
                  <div className='col-span-3 space-y-2'>
                    <FormControl>
                      <Textarea
                        placeholder='请输入知识库描述'
                        className='resize-none'
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription className='text-xs'>
                      可选，最多 200 个字符
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>

      <div className='mt-4 w-full text-right'>
        <Button type='submit' form='knowledge-form' className='mr-4'>
          {isUpdate ? '更新' : '创建知识库'}
        </Button>
      </div>
    </div>
  )
}
