import { IconMoodEmpty } from '@tabler/icons-react'
import { DocumentSegmentItem, useGetDocumentSegments } from '@/services/model'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type DocumentSegmentSelectorProps = {
  value?: string
  onChange?: (value: string) => void
  previewFilter?: (documentSegments: DocumentSegmentItem) => boolean
}

export function DocumentSegmentSelector({
  value,
  onChange,
  previewFilter,
}: DocumentSegmentSelectorProps) {
  const { documentSegments, isLoading } = useGetDocumentSegments()

  const filteredByPreview =
    previewFilter && documentSegments
      ? documentSegments.filter(previewFilter)
      : documentSegments

  const displayDocumentSegments = filteredByPreview?.length
    ? filteredByPreview
    : documentSegments

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger loading={isLoading} className='w-full'>
        <SelectValue placeholder='请选择文档分段模型' />
      </SelectTrigger>
      <SelectContent>
        {displayDocumentSegments && displayDocumentSegments.length > 0 ? (
          displayDocumentSegments.map((documentSegment) => (
            <SelectItem
              key={documentSegment.value}
              value={documentSegment.value}
              className='py-2'
            >
              <div className='flex gap-2'>
                <div className='flex items-center gap-2'>
                  <img
                    src={documentSegment.icon}
                    alt='icon'
                    className='h-5 w-5 object-contain'
                  />
                  <div className='max-w-[300px] truncate text-sm font-medium'>
                    {documentSegment.name}
                  </div>
                </div>
                <div className='flex flex-wrap gap-1'>
                  <span className='rounded bg-gray-200 px-1.5 py-0.5 text-[10px] text-gray-700'>
                    {documentSegment.maxContextTokens}
                  </span>
                </div>
              </div>
            </SelectItem>
          ))
        ) : (
          <div className='text-muted-foreground flex flex-col items-center justify-center py-4'>
            <IconMoodEmpty className='mb-2 h-6 w-6' />
            <span className='text-sm'>暂无数据</span>
          </div>
        )}
      </SelectContent>
    </Select>
  )
}
