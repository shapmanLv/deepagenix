import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  IconAdjustmentsHorizontal,
  IconBrandDatabricks,
  IconDatabase,
  IconEdit,
  IconFileUnknown,
  IconFolderFilled,
  IconFolders,
  IconPlus,
  IconSortAscendingLetters,
  IconSortDescendingLetters,
  IconTrash,
} from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { KnowledgeSettingsDialog } from './components/knowledge-settings'
import { knowledges } from './data/konwledge'
import { KnowledgeItem, IconType } from './data/schema'

const knowledgeText = new Map<string, string>([
  ['all', 'All'],
  ['connected', 'Connected'],
  ['notConnected', 'Not Connected'],
])

export default function Knowledge() {
  const [sort, setSort] = useState('ascending')
  const [type, setType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const [opened, setOpened] = useState(false)

  const [currentRow, setCurrentRow] = useState<KnowledgeItem>()
  const navigate = useNavigate()

  const createKnowledge = () => {
    setOpened(true)
  }

  const updateKnowledge = (row: KnowledgeItem) => {
    setOpened(true)
    setCurrentRow(row)
  }

  const goToDetail = (id: string) => {
    navigate({
      to: '/knowledge/detail/$id/documents',
      params: { id: id },
    })
  }

  const filteredApps = knowledges
    .sort((a, b) =>
      sort === 'ascending'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    )
    .filter((app) => app.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const renderCardIcon = (icon: IconType) => {
    if (icon === 'IconBrandDatabricks') {
      return <IconBrandDatabricks />
    }

    if (icon === 'IconDatabase') {
      return <IconDatabase />
    }

    if (icon === 'IconFolderFilled') {
      return <IconFolderFilled />
    }

    if (icon === 'IconFolders') {
      return <IconFolders />
    }

    return <IconFileUnknown />
  }

  const renderAddCard = () => {
    return (
      <li
        className='group flex cursor-pointer flex-col rounded-lg border p-4 hover:shadow-md'
        onClick={createKnowledge}
      >
        <div className='mb-4 flex h-12 items-center gap-4'>
          <Button variant='outline' size='icon' onClick={createKnowledge}>
            <IconPlus />
          </Button>
          <div className='flex w-[calc(100%-56px)] flex-col'>
            <h2 className='truncate font-semibold select-none'>
              Create a knowledge base
            </h2>
          </div>
        </div>
        <div className='max-w-xs'>
          <p className='line-clamp-3 overflow-hidden text-gray-500 select-none'>
            Import your own text data or write data in real time via webhooks to
            enhance the context of LLM.
          </p>
        </div>
      </li>
    )
  }

  const renderCard = (item: KnowledgeItem) => {
    return (
      <li
        key={item.id}
        className='group relative flex cursor-pointer flex-col rounded-lg border p-4 hover:shadow-md'
        onClick={() => {
          goToDetail(item.id)
        }}
      >
        <div className='mb-4 flex items-center gap-4'>
          <div
            className={`bg-muted flex size-10 items-center justify-center rounded-lg p-2`}
          >
            {renderCardIcon(item.icon)}
          </div>
          <div className='flex w-[calc(100%-56px)] flex-col'>
            <h2 className='truncate font-semibold'>{item.name}</h2>
            <div className='truncate'>
              <span className='text-muted-foreground text-sm'>
                {item.documents} document
              </span>
              <span className='text-muted-foreground ml-2 text-sm'>
                {item.relatedApplications} related applications
              </span>
            </div>
          </div>
        </div>
        <div className='mb-8 max-w-xs'>
          <p className='line-clamp-2 overflow-hidden text-gray-500'>
            {item.desc}
          </p>
        </div>
        <div className='absolute right-4 -bottom-2 flex gap-1 opacity-0 transition-all duration-300 ease-in-out group-hover:-translate-y-4 group-hover:opacity-100'>
          <Button
            size='icon'
            type='button'
            variant='ghost'
            className='h-8 rounded-md'
            onClick={(e) => {
              e.stopPropagation()
              updateKnowledge(item)
            }}
          >
            <IconEdit size={20} className='stroke-muted-foreground' />
          </Button>
          <Button
            size='icon'
            type='button'
            variant='ghost'
            className='h-8 rounded-md'
          >
            <IconTrash size={20} className='stroke-muted-foreground' />
          </Button>
        </div>
      </li>
    )
  }

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Content ===== */}
      <Main fixed>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Knowledge</h1>
        </div>
        <div className='my-4 flex items-end justify-between sm:my-0 sm:items-center'>
          <div className='flex flex-col gap-4 sm:my-4 sm:flex-row'>
            <Input
              placeholder='Filter knowledge...'
              className='h-9 w-40 lg:w-[250px]'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className='w-36'>
                <SelectValue>{knowledgeText.get(type)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All</SelectItem>
                <SelectItem value='connected'>Connected</SelectItem>
                <SelectItem value='notConnected'>Not Connected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className='w-16'>
              <SelectValue>
                <IconAdjustmentsHorizontal size={18} />
              </SelectValue>
            </SelectTrigger>
            <SelectContent align='end'>
              <SelectItem value='ascending'>
                <div className='flex items-center gap-4'>
                  <IconSortAscendingLetters size={16} />
                  <span>Ascending</span>
                </div>
              </SelectItem>
              <SelectItem value='descending'>
                <div className='flex items-center gap-4'>
                  <IconSortDescendingLetters size={16} />
                  <span>Descending</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Separator className='shadow-sm' />
        <ul className='faded-bottom no-scrollbar grid grid-cols-1 gap-4 overflow-auto pt-4 pb-16 md:grid-cols-2 lg:grid-cols-3'>
          {renderAddCard()}
          {filteredApps.map(renderCard)}
        </ul>
      </Main>

      <KnowledgeSettingsDialog
        open={opened}
        onOpenChange={() => {
          setOpened(false)
          setCurrentRow(undefined)
        }}
        currentRow={currentRow}
      />
    </>
  )
}
