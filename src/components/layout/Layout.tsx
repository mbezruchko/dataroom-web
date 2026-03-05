import { Sidebar } from "./Sidebar"
import { Header } from "./Header"
import { Outlet, useParams } from "react-router-dom"
import { useWorkspace } from "@/lib/queries/workspace"
import { AccessDenied } from "../views/AccessDenied"
import { Loader2 } from "lucide-react"

export function Layout() {
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