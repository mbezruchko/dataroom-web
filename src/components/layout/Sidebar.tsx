import { useMemo } from "react"
import { cn } from "@/lib/utils"
import { FolderOpen, Star, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link, useLocation, useParams } from "react-router-dom"
import { useAppStore } from "@/store/useAppStore"
import { WorkspaceSwitcher } from "./WorkspaceSwitcher"
import { useTrash, useFavorites } from "@/lib/queries/search"

export function Sidebar() {
  const location = useLocation()
  const { workspaceGuid } = useParams<{ workspaceGuid: string }>()
  const sidebarOpen = useAppStore(state => state.sidebarOpen)
  const setSidebarOpen = useAppStore(state => state.setSidebarOpen)

  const { data: trashData } = useTrash(workspaceGuid)
  const trashCount = trashData?.files?.length || 0

  const { data: favoritesData } = useFavorites(workspaceGuid)
  const favoritesCount = (favoritesData?.files?.length || 0) + (favoritesData?.folders?.length || 0)

  const folderLinks = useMemo(() => [
    { icon: FolderOpen, label: "Storage", href: `/${workspaceGuid}/root` },
    { icon: Star, label: "Favorites", href: `/${workspaceGuid}/favorites` },
    { icon: Trash2, label: "Trash", href: `/${workspaceGuid}/trash` },
  ], [workspaceGuid]);

  return (
    <>
      {/* Backdrop — mobile only */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 min-[1440px]:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "flex w-64 flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-300 z-50",
        "fixed inset-y-0 left-0 min-[1440px]:relative min-[1440px]:inset-auto",
        sidebarOpen
          ? "translate-x-0"
          : "-translate-x-full min-[1440px]:translate-x-0 min-[1440px]:hidden"
      )}>
        <div className="flex h-14 items-center border-b px-2">
          <WorkspaceSwitcher />
        </div>

        <div className="flex-1 overflow-auto py-2">
          <nav className="space-y-1 px-2">
            {folderLinks.map((item, index) => {
              const isActive = location.pathname === item.href || (item.label === "Storage" && location.pathname.includes("/folder/"));

              return (
                <Button
                  key={index}
                  asChild
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-2 min-h-[44px]",
                    isActive ? "bg-secondary text-secondary-foreground" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <Link
                    to={item.href}
                    className="flex-1 flex items-center justify-between"
                    onClick={() => {
                      if (window.innerWidth < 1440) setSidebarOpen(false)
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <item.icon className="size-4" />
                      {item.label}
                    </div>
                    {item.label === "Trash" && trashCount > 0 && (
                      <span className="flex size-5 items-center justify-center rounded-full bg-muted text-[10px] font-medium text-muted-foreground group-hover:bg-sidebar-accent-foreground group-hover:text-sidebar-accent">
                        {trashCount}
                      </span>
                    )}
                    {item.label === "Favorites" && favoritesCount > 0 && (
                      <span className="flex size-5 items-center justify-center rounded-full bg-muted text-[10px] font-medium text-muted-foreground group-hover:bg-sidebar-accent-foreground group-hover:text-sidebar-accent">
                        {favoritesCount}
                      </span>
                    )}
                  </Link>
                </Button>
              )
            })}
          </nav>
        </div>
      </div>
    </>
  )
}
