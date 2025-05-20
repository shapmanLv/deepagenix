'use client'

import { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  IconBrandDatabricks,
  IconDatabase,
  IconFolderFilled,
  IconFolders,
} from '@tabler/icons-react'
import { showSubmittedData } from '@/utils/show-submitted-data'
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
import { IconTypeSchema, KnowledgeItem } from '../data/schema'

// Enhanced validation schema
const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: '名称必须至少包含 2 个字符' })
    .max(50, { message: '名称不能超过50个字符' }),
  icon: IconTypeSchema.refine((val) => !!val, {
    message: '需要选择图标',
  }),
  desc: z.string().max(200, { message: '描述不能超过200个字符' }).optional(),
})

type KnowledgeForm = z.infer<typeof formSchema>

export type KnowledgeType = 'create' | 'update'

interface Props {
  open: boolean
  type: KnowledgeType
  onOpenChange: (open: boolean) => void
  currentRow?: KnowledgeItem
}

const defaultValues: KnowledgeForm = {
  name: '',
  icon: 'IconFolders',
  desc: '',
}

export function KnowledgeSettingsDialog({
  open,
  type,
  onOpenChange,
  currentRow,
}: Props) {
  const isUpdate = type === 'update'

  const form = useForm<KnowledgeForm>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  })

  useEffect(() => {
    form.reset(currentRow || defaultValues)
  }, [currentRow, form])

  const onSubmit = (values: KnowledgeForm) => {
    form.reset()
    showSubmittedData(values)
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-left'>
          <DialogTitle>
            {isUpdate ? '知识库设置' : '创建一个新的知识库'}
          </DialogTitle>
          <DialogDescription>
            构建结构化知识库，为大语言模型提供实时、准确的上下文支持，提升大模型回复准确度。
          </DialogDescription>
        </DialogHeader>
        <div className='-mr-4 h-[26.25rem] w-full overflow-y-auto py-1 pr-2 pl-1'>
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
                    <FormLabel>选择图标</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='w-[180px]'>
                          <SelectValue placeholder='Select icon type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='IconFolders'>
                          <div className='flex items-center gap-2'>
                            <IconFolders className='h-4 w-4' />
                            <span>Folder Group</span>
                          </div>
                        </SelectItem>
                        <SelectItem value='IconFolderFilled'>
                          <div className='flex items-center gap-2'>
                            <IconFolderFilled className='h-4 w-4' />
                            <span>Solid Folder</span>
                          </div>
                        </SelectItem>
                        <SelectItem value='IconDatabase'>
                          <div className='flex items-center gap-2'>
                            <IconDatabase className='h-4 w-4' />
                            <span>Database</span>
                          </div>
                        </SelectItem>
                        <SelectItem value='IconBrandDatabricks'>
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
                name='desc'
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
            {isUpdate ? 'Update Knowledge Base' : 'Create Knowledge Base'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
