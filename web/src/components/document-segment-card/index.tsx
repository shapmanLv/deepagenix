import { IconMoodEmpty } from '@tabler/icons-react'
import { DocumentSegmentItem, useGetDocumentSegments } from '@/services/model'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type DocumentSegmentCardsProps = {
  value?: string
  onChange?: (value: string) => void
  previewFilter?: (documentSegments: DocumentSegmentItem) => boolean
}

export function DocumentSegmentCards({
  value,
  onChange,
  previewFilter,
}: DocumentSegmentCardsProps) {
  const { documentSegments, isLoading } = useGetDocumentSegments()

  const filteredByPreview =
    previewFilter && documentSegments
      ? documentSegments.filter(previewFilter)
      : documentSegments

  const displayDocumentSegments = filteredByPreview?.length
    ? filteredByPreview
    : documentSegments

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-8'>
        <div className='text-muted-foreground'>加载中...</div>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      {displayDocumentSegments && displayDocumentSegments.length > 0 ? (
        <div className='rid-cols-1 grid gap-4'>
          {displayDocumentSegments.map((documentSegment) => (
            <DocumentSegmentCard
              key={documentSegment.value}
              documentSegment={documentSegment}
              isSelected={value === documentSegment.value}
              onSelect={() => {
                if (!documentSegment.disable) {
                  onChange?.(documentSegment.value)
                }
              }}
            />
          ))}
        </div>
      ) : (
        <EmptyDocumentSegmentCards />
      )}
    </div>
  )
}

type DocumentSegmentCardProps = {
  documentSegment: DocumentSegmentItem
  isSelected: boolean
  onSelect: () => void
}

function DocumentSegmentCard({
  documentSegment,
  isSelected,
  onSelect,
}: DocumentSegmentCardProps) {
  return (
    <Card
      className={cn(
        'cursor-pointer gap-4 transition-all duration-200 hover:shadow-md',
        isSelected
          ? 'ring-primary border-primary ring-2'
          : 'hover:border-primary/50',
        documentSegment.disable && 'cursor-not-allowed opacity-50'
      )}
      onClick={onSelect}
    >
      <CardHeader>
        <div className='flex items-start justify-between'>
          <div className='flex items-center gap-2'>
            <img
              src={documentSegment.icon}
              alt={documentSegment.name}
              className='h-8 w-8 object-contain'
            />
            <div>
              <CardTitle className='text-base font-medium'>
                {documentSegment.name}
              </CardTitle>
              <p className='text-muted-foreground text-sm'>
                {documentSegment.series}
              </p>
            </div>
          </div>
          <DocumentSegmentCardBadges
            isSelected={isSelected}
            isDisabled={documentSegment.disable}
          />
        </div>
      </CardHeader>
      <CardContent className='pt-0'>
        <p className='text-foreground mb-3 line-clamp-3 text-sm'>
          {documentSegment.description}
        </p>
        <DocumentSegmentCardInfo
          maxContextTokens={documentSegment.maxContextTokens}
        />
      </CardContent>
    </Card>
  )
}

type DocumentSegmentCardBadgesProps = {
  isSelected: boolean
  isDisabled: boolean
}

function DocumentSegmentCardBadges({
  isSelected,
  isDisabled,
}: DocumentSegmentCardBadgesProps) {
  return (
    <div className='flex flex-col gap-1'>
      {isSelected && (
        <Badge variant='default' className='text-xs'>
          已选择
        </Badge>
      )}
      {isDisabled && (
        <Badge variant='secondary' className='text-xs'>
          不可用
        </Badge>
      )}
    </div>
  )
}

type DocumentSegmentCardInfoProps = {
  maxContextTokens: number
}

function DocumentSegmentCardInfo({
  maxContextTokens,
}: DocumentSegmentCardInfoProps) {
  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center gap-2'>
        <span className='text-muted-foreground text-xs'>上下文:</span>
        <Badge variant='outline' className='text-xs'>
          {maxContextTokens}k tokens
        </Badge>
      </div>
    </div>
  )
}

function EmptyDocumentSegmentCards() {
  return (
    <Card className='py-8'>
      <CardContent className='text-center'>
        <IconMoodEmpty className='text-muted-foreground mx-auto mb-2 h-8 w-8' />
        <p className='text-muted-foreground'>暂无可用的文档分段模型</p>
      </CardContent>
    </Card>
  )
}
