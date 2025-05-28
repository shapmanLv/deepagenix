import { IconMoodEmpty } from '@tabler/icons-react'
import { EmbeddingItem, useGetEmbeddings } from '@/services/model'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

type EmbeddingSelectorProps = {
  value?: string
  onChange?: (value: string) => void
  previewFilter?: (embedding: EmbeddingItem) => boolean
}

export function EmbeddingSelector({
  value,
  onChange,
  previewFilter,
}: EmbeddingSelectorProps) {
  const { embeddings, isLoading } = useGetEmbeddings()

  const filteredByPreview =
    previewFilter && embeddings ? embeddings.filter(previewFilter) : embeddings

  const displayEmbeddings = filteredByPreview?.length
    ? filteredByPreview
    : embeddings

  return (
    <div className='relative'>
      <Select
        value={value}
        onValueChange={(val) => {
          onChange?.(val)
        }}
      >
        <SelectTrigger loading={isLoading} className='w-full'>
          <SelectValue placeholder='请选择模型' />
        </SelectTrigger>
        <SelectContent>
          {displayEmbeddings && displayEmbeddings.length > 0 ? (
            displayEmbeddings.map((embedding) => (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SelectItem value={embedding.value}>
                      <div className='flex gap-2'>
                        <div className='flex items-center gap-2'>
                          <img
                            src={embedding.icon}
                            alt='icon'
                            className='h-5 w-5 object-contain'
                          />
                          <div className='max-w-[300px] truncate text-sm font-medium'>
                            {embedding.name}
                          </div>
                        </div>
                        <div className='flex flex-wrap gap-1'>
                          {embedding.languages.map((lang) => (
                            <span
                              key={lang}
                              className='rounded bg-gray-200 px-1.5 py-0.5 text-[10px] text-gray-700'
                            >
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    </SelectItem>
                  </TooltipTrigger>

                  <TooltipContent
                    side='right'
                    align='start'
                    sideOffset={16}
                    className='bg-popover w-64 rounded-lg border p-4 shadow-lg'
                  >
                    <div className='flex items-center gap-3'>
                      <img
                        src={embedding.icon}
                        alt='icon'
                        className='h-10 w-10 object-contain p-2 shadow-sm'
                      />
                      <div>
                        <h4 className='text-primary font-medium'>
                          {embedding.name}
                        </h4>
                        <p className='text-muted-foreground text-xs'>
                          {embedding.developer}
                        </p>
                      </div>
                    </div>
                    <p className='text-foreground mt-3 line-clamp-6 text-sm'>
                      {embedding.description}
                    </p>
                    <div className='mt-3 grid grid-cols-2 gap-2 text-xs'>
                      <div>
                        <span className='text-muted-foreground'>维度:</span>
                        <span className='text-primary ml-1'>
                          {embedding.dimension}
                        </span>
                      </div>
                      <div>
                        <span className='text-muted-foreground'>支持语言:</span>
                        <span className='text-primary ml-1'>
                          {embedding.languages.join(', ')}
                        </span>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))
          ) : (
            <div className='text-muted-foreground flex flex-col items-center justify-center py-4'>
              <IconMoodEmpty className='mb-2 h-6 w-6' />
              <span className='text-sm'>暂无可选模型</span>
            </div>
          )}
        </SelectContent>
      </Select>
    </div>
  )
}
