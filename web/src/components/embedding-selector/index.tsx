import { IconMoodEmpty } from '@tabler/icons-react'
import { useGetEmbeddings } from '@/services/model'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type EmbeddingSelectorProps = {
  value?: string
  onChange?: (value: string) => void
}

export function EmbeddingSelector({ value, onChange }: EmbeddingSelectorProps) {
  const { embeddings, isLoading } = useGetEmbeddings()

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger loading={isLoading} className='w-[240px]'>
        <SelectValue placeholder='请选择模型' />
      </SelectTrigger>
      <SelectContent>
        {embeddings && embeddings.length > 0 ? (
          embeddings.map((embedding) => (
            <SelectItem
              key={embedding.value}
              value={embedding.value}
              className='flex items-center gap-2 py-2'
            >
              <img
                src={embedding.icon}
                alt='icon'
                className='h-5 w-5 object-contain'
              />
              <span className='truncate text-sm'>{embedding.name}</span>
            </SelectItem>
          ))
        ) : (
          <div className='text-muted-foreground flex flex-col items-center justify-center py-4'>
            <IconMoodEmpty className='mb-2 h-6 w-6' />
            <span className='text-sm'>暂无模型数据</span>
          </div>
        )}
      </SelectContent>
    </Select>
  )
}
