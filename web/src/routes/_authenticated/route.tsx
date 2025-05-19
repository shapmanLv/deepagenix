import Cookies from 'js-cookie'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { AuthProvider } from '@/context/auth-context'
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
  const defaultOpen = Cookies.get('sidebar_state') !== 'false'

  return (
    <LoadingProvider>
      <AuthProvider>
        <SearchProvider>
          <SidebarProvider defaultOpen={defaultOpen}>
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
          </SidebarProvider>
        </SearchProvider>
      </AuthProvider>
    </LoadingProvider>
  )
}
