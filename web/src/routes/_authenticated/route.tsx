import { useEffect } from 'react'
import Cookies from 'js-cookie'
import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { LoadingProvider } from '@/context/loading-context'
import { SearchProvider } from '@/context/search-context'
import { SidebarProvider } from '@/components/ui/sidebar'
import { GlobalLoading } from '@/components/global-loading'
import { AppSidebar } from '@/components/layout/app-sidebar'
import SkipToMain from '@/components/skip-to-main'

export const Route = createFileRoute('/_authenticated')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()

  const defaultOpen = Cookies.get('sidebar_state') !== 'false'

  useEffect(() => {
    const checkAuthentication = async () => {
      const authToken = Cookies.get('authToken')

      // 未认证直接跳转
      if (!authToken) {
        navigate({ to: '/sign-in', replace: true })
        return
      }
    }

    checkAuthentication()
  }, [navigate])

  return (
    <SearchProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <LoadingProvider>
          <GlobalLoading />
          <SkipToMain />
          <AppSidebar />
          <div
            id='content'
            className={cn(
              'ml-auto w-full max-w-full',
              'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
              'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
              'sm:transition-[width] sm:duration-200 sm:ease-linear',
              'flex h-svh flex-col',
              'group-data-[scroll-locked=1]/body:h-full',
              'has-[main.fixed-main]:group-data-[scroll-locked=1]/body:h-svh'
            )}
          >
            <Outlet />
          </div>
        </LoadingProvider>
      </SidebarProvider>
    </SearchProvider>
  )
}
