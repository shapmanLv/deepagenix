import { Back } from '@/components/layout/back'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'

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
      <Main fixed>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>
            创建一个新的知识库
          </h1>
        </div>
        <div className='my-4 flex items-end justify-between sm:my-0 sm:items-center'></div>
      </Main>
    </>
  )
}
