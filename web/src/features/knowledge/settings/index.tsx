import { Route } from '@/routes/_authenticated/knowledge/detail/$id/settings'
import { Back } from '@/components/layout/back'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { FileUpload } from '@/components/upload'
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
        <div className='mx-auto mt-16 flex w-full items-center justify-center'>
          <FileUpload />
        </div>
      </Main>
    </>
  )
}
