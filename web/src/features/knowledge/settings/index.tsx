import { Route } from '@/routes/_authenticated/knowledge/detail/$id/settings'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Back } from '@/components/layout/back'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { KnowledgeSettingsForm } from '../components/knowledge-settings-form'
import { KnowledgeNavRoute } from '../constants'
import { useKnowledgeNavLinks } from '../hooks/use-nav'

export default function Settings() {
  const { id } = Route.useParams()

  const topNav = useKnowledgeNavLinks(KnowledgeNavRoute.SETTINGS, id)

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header fixed>
        <Back to='/knowledge' />
        <TopNav links={topNav} />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Content ===== */}
      <Main fixed>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4'>
          <div>
            <h2 className='mb-1 text-2xl font-bold tracking-tight'>
              更新知识库设置
            </h2>
            <p className='text-muted-foreground'>
              修改知识库的基本信息和配置，优化知识库的处理能力和检索效果。
            </p>
          </div>
        </div>
        <Separator className='shadow-sm' />
        <div className='flex flex-1 overflow-y-auto pt-4'>
          <KnowledgeSettingsForm type='update' id={id} />
        </div>
        <div className='bg-background -mb-2 w-full border-t border-gray-200 pt-4 text-right'>
          <Button type='submit' form='knowledge-form' className='mr-4'>
            更新知识库
          </Button>
        </div>
      </Main>
    </>
  )
}
