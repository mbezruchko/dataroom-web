import { useEffect, useRef } from "react"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"
import { Outlet, useParams } from "react-router-dom"
import { useWorkspace } from "@/lib/queries/workspace"
import { useAppStore } from "@/store/useAppStore"
import { AccessDenied } from "../views/AccessDenied"
import { Loader2 } from "lucide-react"

const LG_BREAKPOINT = 1440

export function Layout() {
  const setSidebarOpen = useAppStore(state => state.setSidebarOpen)
  const wasDesktop = useRef(window.innerWidth >= LG_BREAKPOINT)

  useEffect(() => {
    const onResize = () => {
      const isDesktop = window.innerWidth >= LG_BREAKPOINT
      if (isDesktop !== wasDesktop.current) {
        setSidebarOpen(isDesktop)
        wasDesktop.current = isDesktop
      }
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [setSidebarOpen])
  const { workspaceGuid } = useParams<{ workspaceGuid: string }>()
  const { error, isLoading } = useWorkspace(workspaceGuid)

  // @ts-ignore - axios error object structure
  const isForbidden = error?.response?.status === 403

  if (isForbidden) {
    return (
      <div className="flex h-screen bg-background">
        <div className="flex-1 flex items-center justify-center">
          <AccessDenied />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-50">
              <Loader2 className="size-8 animate-spin text-primary" />
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  )
}
