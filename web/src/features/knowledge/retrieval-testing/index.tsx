import { useState } from 'react'
import { Route } from '@/routes/_authenticated/knowledge/detail/$id/retrieval-testing'
import {
  Loader2,
  Search,
  FileText,
  Hash,
  Ruler,
  CalendarDays,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { KnowledgeNavRoute } from '../constants'
import { useKnowledgeNavLinks } from '../hooks/use-nav'

interface TestResult {
  id: string
  content: string
  score: number
  metadata: {
    source: string
    page: number
    chunkId: string
    length: number
    timestamp: string
    tags: string[]
  }
}

export default function RetrievalTesting() {
  const { id } = Route.useParams()
  const topNav = useKnowledgeNavLinks(KnowledgeNavRoute.RETRIEVAL_TESTING, id)

  // State management
  const [query, setQuery] = useState('')
  const [topK, setTopK] = useState(5)
  const [similarityThreshold, setSimilarityThreshold] = useState(0.7)
  const [results, setResults] = useState<TestResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleTest = async () => {
    setIsLoading(true)
    setError(null)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const mockResults: TestResult[] = Array.from(
        { length: topK },
        (_, i) => ({
          id: `${i}`,
          content: `Matching knowledge content paragraph ${i + 1}... Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
          score: 0.9 - i * 0.1,
          metadata: {
            source: 'example.pdf',
            page: i + 1,
            chunkId: `CHK-${i.toString().padStart(4, '0')}`,
            length: Math.floor(Math.random() * 500) + 300,
            timestamp: new Date().toISOString().split('T')[0],
            tags: ['technical', 'research', 'ai'],
          },
        })
      )
      setResults(mockResults)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('Test request failed, please try again later')
    } finally {
      setIsLoading(false)
    }
  }

  const ResultsSkeleton = () => (
    <div className='space-y-4'>
      {Array.from({ length: topK }).map((_, index) => (
        <Card key={index} className='p-4'>
          <div className='space-y-3'>
            <Skeleton className='h-4 w-full rounded-lg' />
            <Skeleton className='h-4 w-3/4 rounded-lg' />
            <Skeleton className='h-4 w-1/2 rounded-lg' />
            <div className='flex flex-wrap gap-2'>
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className='h-6 w-20 rounded-full' />
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )

  return (
    <>
      <Header fixed>
        <TopNav links={topNav} />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main fixed>
        <div className='flex h-full gap-6'>
          {/* Left Panel - Input Section */}
          <div className='flex w-1/3 flex-col gap-6'>
            <Card className='h-full'>
              <CardHeader>
                <CardTitle>Test Configuration</CardTitle>
              </CardHeader>
              <CardContent className='flex flex-col gap-6'>
                <div className='space-y-4'>
                  <Label htmlFor='query'>Test Query</Label>
                  <Textarea
                    id='query'
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder='Enter your test query...'
                    className='min-h-[200px] resize-none'
                  />
                </div>

                <div className='space-y-4'>
                  <Label>Number of Results (Top-K)</Label>
                  <div className='flex items-center gap-4'>
                    <Slider
                      value={[topK]}
                      onValueChange={([value]) => setTopK(value)}
                      min={1}
                      max={10}
                      step={1}
                    />
                    <span className='w-12 text-center'>{topK}</span>
                  </div>
                </div>

                <div className='space-y-4'>
                  <Label>
                    Similarity Threshold ({similarityThreshold.toFixed(1)})
                  </Label>
                  <div className='flex items-center gap-4'>
                    <Slider
                      value={[similarityThreshold]}
                      onValueChange={([value]) => setSimilarityThreshold(value)}
                      min={0}
                      max={1}
                      step={0.1}
                    />
                    <span className='w-12 text-center'>
                      {similarityThreshold.toFixed(1)}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handleTest}
                  disabled={isLoading}
                  className='mt-auto'
                >
                  {isLoading ? (
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  ) : (
                    <Search className='mr-2 h-4 w-4' />
                  )}
                  {isLoading ? 'Testing...' : 'Run Test'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Results Section */}
          <div className='flex-1'>
            <Card className='h-full'>
              <CardHeader>
                <CardTitle>Test Results</CardTitle>
                {!isLoading && results.length > 0 && (
                  <div className='text-muted-foreground text-sm'>
                    Showing {results.length} chunks (Threshold: ≥
                    {(similarityThreshold * 100).toFixed(1)}%)
                  </div>
                )}
              </CardHeader>
              <CardContent className='no-scrollbar h-full space-y-4 overflow-y-auto'>
                {error ? (
                  <div className='text-destructive p-4 text-center'>
                    {error}
                  </div>
                ) : isLoading ? (
                  <ResultsSkeleton />
                ) : results.length > 0 ? (
                  results.map((result) => (
                    <Card
                      key={result.id}
                      className='hover:bg-accent/50 p-4 transition-colors'
                    >
                      <div className='flex flex-col gap-3'>
                        {/* Content Preview */}
                        <div className='text-primary line-clamp-3 text-sm'>
                          {result.content}
                        </div>

                        {/* Metadata Row */}
                        <div className='text-muted-foreground flex flex-wrap items-center gap-4 text-xs'>
                          <div className='flex items-center gap-2'>
                            <span className='font-medium'>Similarity:</span>
                            <Progress
                              value={result.score * 100}
                              className='h-2 w-24'
                            />
                            <span>{(result.score * 100).toFixed(1)}%</span>
                          </div>

                          <div className='flex items-center gap-1'>
                            <FileText className='h-4 w-4' />
                            <span>{result.metadata.source}</span>
                            <span>·</span>
                            <span>Page {result.metadata.page}</span>
                          </div>

                          <Badge variant='outline' className='gap-1'>
                            <Hash className='h-3.5 w-3.5' />
                            {result.metadata.chunkId}
                          </Badge>

                          <div className='flex items-center gap-1'>
                            <Ruler className='h-4 w-4' />
                            <span>{result.metadata.length} chars</span>
                          </div>

                          <div className='flex items-center gap-1'>
                            <CalendarDays className='h-4 w-4' />
                            <span>{result.metadata.timestamp}</span>
                          </div>
                        </div>

                        {/* Tags */}
                        {result.metadata.tags.length > 0 && (
                          <div className='flex flex-wrap gap-2'>
                            {result.metadata.tags.map((tag) => (
                              <Badge key={tag} variant='secondary'>
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className='text-muted-foreground p-8 text-center'>
                    Enter query and run test to view results
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </Main>
    </>
  )
}
