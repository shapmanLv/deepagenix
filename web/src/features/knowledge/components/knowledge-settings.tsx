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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
  open: boolean
  type: KnowledgeType
  onOpenChange: (open: boolean) => void
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

export function KnowledgeSettingsDialog({
  open,
  type,
  onOpenChange,
  currentRow,
}: Props) {
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
      onOpenChange(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg' loading={isLoading}>
        <DialogHeader className='text-left'>
          <DialogTitle>
            {isUpdate ? '知识库设置' : '创建一个新的知识库'}
          </DialogTitle>
          <DialogDescription>
            构建结构化知识库，为大语言模型提供实时、准确的上下文支持，提升大模型回复准确度。
          </DialogDescription>
        </DialogHeader>
        <div className='-mr-4 h-[26.25rem] w-full overflow-y-auto py-1 pr-4 pl-1'>
          <Form {...form}>
            <form
              id='knowledge-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 p-0.5'
            >
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>知识库名称</FormLabel>
                    <FormControl>
                      <Input placeholder='请输入您的知识库名称' {...field} />
                    </FormControl>
                    <FormDescription>2-50个字符，必填字段</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='icon'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>图标</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Select icon type' />
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
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='language'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>语言</FormLabel>
                    <LanguageSelector
                      onChange={(value) => {
                        form.setValue('indexConfig.embeddingModel', '')
                        field.onChange(value)
                      }}
                      value={field.value}
                    ></LanguageSelector>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='indexConfig.embeddingModel'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>嵌入模型</FormLabel>
                    <EmbeddingSelector
                      onChange={field.onChange}
                      value={field.value}
                      previewFilter={(embedding) =>
                        embedding?.languages?.includes(form.watch('language'))
                      }
                    ></EmbeddingSelector>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='indexConfig.participlePlugin'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>分词插件</FormLabel>
                    <PluginSelector
                      onChange={field.onChange}
                      value={field.value}
                      previewFilter={(plugins) =>
                        plugins?.languages?.includes(form.watch('language'))
                      }
                    ></PluginSelector>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='indexConfig.documentSegmentModel'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>文档分段模型</FormLabel>
                    <DocumentSegmentSelector
                      onChange={field.onChange}
                      value={field.value}
                    ></DocumentSegmentSelector>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>知识库描述</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='请输入知识库描述'
                        className='resize-none'
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>可选，最多 200 个字符</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type='submit' form='knowledge-form'>
            {isUpdate ? '更新' : '创建'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
