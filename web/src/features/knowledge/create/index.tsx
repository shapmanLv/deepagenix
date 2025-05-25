import { Separator } from '@/components/ui/separator'
import { Back } from '@/components/layout/back'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { KnowledgeSettingsForm } from '../components/knowledge-settings-form'

export default function CreateKnowledge() {
  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header fixed>
        <Back />
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Content ===== */}
      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4'>
          <div>
            <h2 className='mb-1 text-2xl font-bold tracking-tight'>
              创建一个新的知识库
            </h2>
            <p className='text-muted-foreground'>
              一键构建定制化知识库，为大语言模型提供可信、结构化的内容基础，全面增强智能处理能力。
            </p>
          </div>
        </div>
        <Separator className='shadow-sm' />
        <div className='flex max-w-[880px] flex-1 pt-4'>
          <KnowledgeSettingsForm type='create' />
        </div>
      </Main>
    </>
  )
}
