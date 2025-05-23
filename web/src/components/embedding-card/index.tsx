import { EmbeddingItem, useGetEmbeddings } from '@/services/model'
import { CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

type EmbeddingCardProps = {
  embedding: EmbeddingItem
  selected: boolean
  onSelect: (value: string) => void
}

function EmbeddingCard({ embedding, selected, onSelect }: EmbeddingCardProps) {
  return (
    <Card
      onClick={() => onSelect(embedding.value)}
      className={cn(
        'relative cursor-pointer rounded-2xl border-2 p-4 transition-all',
        selected ? 'border-blue-600 bg-blue-50 shadow-md' : 'border-muted'
      )}
    >
      <CardContent className='space-y-2 p-0'>
        <div className='flex items-center gap-2'>
          <img
            src={embedding.icon}
            alt='icon'
            className='h-8 w-8 rounded-sm object-contain p-1 shadow'
          />
          <h3 className='truncate text-lg font-semibold'>{embedding.name}</h3>
          {selected && (
            <CheckCircle2 className='ml-auto text-blue-600' size={24} />
          )}
        </div>
        <p className='text-muted-foreground line-clamp-3 text-sm'>
          {embedding.description}
        </p>
        <div className='flex flex-wrap gap-2'>
          {embedding.languages.map((lang) => (
            <span
              key={lang}
              className='rounded bg-gray-200 px-2 py-0.5 text-xs text-gray-800'
            >
              {lang}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function SkeletonCard() {
  return (
    <Card className='rounded-2xl border-2 p-4'>
      <CardContent className='space-y-2 p-0'>
        <div className='flex items-center gap-2'>
          <Skeleton className='h-8 w-8 rounded-sm' />
          <Skeleton className='h-5 w-32' />
        </div>
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-full' />
      </CardContent>
    </Card>
  )
}

type EmbeddingCardsProps = {
  value: string
  onChange: (value: string) => void
}

export function EmbeddingCards({ value, onChange }: EmbeddingCardsProps) {
  const { embeddings, isLoading } = useGetEmbeddings()

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
      {isLoading
        ? [...Array(3)].map((_, i) => <SkeletonCard key={i} />)
        : embeddings.map((embedding) => (
            <EmbeddingCard
              key={embedding.value}
              embedding={embedding}
              selected={embedding.value === value}
              onSelect={onChange}
            />
          ))}
    </div>
  )
}
