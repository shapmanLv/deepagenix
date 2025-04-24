import { Route } from '@/routes/_authenticated/knowledge/detail/$id/retrieval-testing'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { KnowledgeNavRoute } from '../constants'
import { useKnowledgeNavLinks } from '../hooks/use-nav'

export default function RetrievalTesting() {
  const { id } = Route.useParams()
  const topNav = useKnowledgeNavLinks(KnowledgeNavRoute.RETRIEVAL_TESTING, id)

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header fixed>
        <TopNav links={topNav} />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Content ===== */}
      <Main fixed>{id}</Main>
    </>
  )
}
