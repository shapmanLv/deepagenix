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
import {
  useCreateKnowledge,
  useGetKnowledgeDetail,
  useUpdateKnowledge,
} from '@/services/konwledge'
import {
  FormKnowledgeItem,
  FormKnowledgeItemSchema,
  IconTypeSchema,
} from '@/services/konwledge/schema'
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
import { ContentLoading } from '@/components/ui/loading'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { DocumentSegmentCards } from '@/components/document-segment-card'
import { EmbeddingSelector } from '@/components/embedding-selector'
import { LanguageSelector } from '@/components/language-select'
import { PluginSelector } from '@/components/plugins-selector'

export type KnowledgeType = 'create' | 'update'

interface Props {
  type?: KnowledgeType
  id?: string
  onSuccess?: () => void // 添加成功回调函数
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

export function KnowledgeSettingsForm({
  type = 'create',
  id,
  onSuccess,
}: Props) {
  const { knowledgeDetail, isLoading } = useGetKnowledgeDetail({
    id: id ?? '',
  })
  const { mutateAsync: createKnowledge } = useCreateKnowledge()
  const { mutateAsync: updateKnowledge } = useUpdateKnowledge()

  const form = useForm<FormKnowledgeItem>({
    resolver: zodResolver(FormKnowledgeItemSchema),
    defaultValues: defaultValues,
  })

  useEffect(() => {
    const shouldUseDetail = !!knowledgeDetail
    console.log('knowledgeDetail', knowledgeDetail)
    form.reset(shouldUseDetail ? knowledgeDetail : defaultValues)
  }, [knowledgeDetail, form])

  const onSubmit = async (values: FormKnowledgeItem) => {
    let res

    if (type === 'update' && id) {
      res = await updateKnowledge({ id, ...values })
    } else {
      res = await createKnowledge(values)
    }

    if (!res.code) {
      form.reset()
      onSuccess?.()
    }
  }

  if (isLoading) {
    return <ContentLoading message='正在加载知识库详情...' />
  }

  return (
    <div className='w-full py-1 pr-4 pl-1'>
      <div className='max-w-[880px] pb-4'>
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

            {/* Icon Field */}
            <FormField
              control={form.control}
              name='icon'
              render={({ field }) => (
                <FormItem className='grid grid-cols-4 items-start gap-4'>
                  <FormLabel className='col-span-1 pt-2 text-right'>
                    图标
                  </FormLabel>
                  <div className='col-span-3 space-y-2'>
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
                    <FormDescription className='text-xs'>
                      为您的知识库添加一个好看的图标吧✨
                    </FormDescription>
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
                  <div className='col-span-3 space-y-2'>
                    <LanguageSelector
                      onChange={(value) => {
                        form.setValue('indexConfig.embeddingModel', '')
                        field.onChange(value)
                      }}
                      value={field.value}
                    />
                    <FormDescription className='text-xs'>
                      选择知识库的主要语言，将影响嵌入模型和分词插件的可选范围
                    </FormDescription>
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
                  <div className='col-span-3 space-y-2'>
                    <EmbeddingSelector
                      onChange={field.onChange}
                      value={field.value}
                      previewFilter={(embedding) =>
                        embedding?.languages?.includes(form.watch('language'))
                      }
                    />
                    <FormDescription className='text-xs'>
                      选择用于文档向量化的嵌入模型，不同模型的维度和性能各有差异
                    </FormDescription>
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
                  <div className='col-span-3 space-y-2'>
                    <PluginSelector
                      onChange={field.onChange}
                      value={field.value}
                      previewFilter={(plugins) =>
                        plugins?.languages?.includes(form.watch('language'))
                      }
                    />
                    <FormDescription className='text-xs'>
                      选择文本分词处理插件，用于将文档内容切分为更小的语义单元
                    </FormDescription>
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
                  <div className='col-span-3 space-y-2'>
                    <DocumentSegmentCards
                      onChange={field.onChange}
                      value={field.value}
                    />
                    <FormDescription className='text-xs'>
                      选择文档分段模型，用于智能切分长文档并控制上下文长度
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </div>
  )
}
