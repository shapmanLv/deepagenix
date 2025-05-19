import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Steps } from '@/components/ui/steps'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'

export default function KnowledgeCreatePage() {
  const steps = [
    { title: '第一步', description: '填写基本信息' },
    { title: '第二步', description: '验证邮箱' },
    { title: '第三步', description: '完成注册' },
  ]
  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header fixed>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/knowledge'>Knowledge</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Create</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      {/* ===== Content ===== */}
      <Main fixed>
        <Steps steps={steps} activeStep={1} />
      </Main>
    </>
  )
}
