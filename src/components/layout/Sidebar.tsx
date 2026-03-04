import { cn } from "@/lib/utils"
import { FolderOpen, Star, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link, useLocation, useParams } from "react-router-dom"
import { useAppStore } from "@/store/useAppStore"
import { WorkspaceSwitcher } from "./WorkspaceSwitcher"

export function Sidebar() {
  const location = useLocation()
  const { workspaceGuid } = useParams<{ workspaceGuid: string }>()
  const sidebarOpen = useAppStore(state => state.sidebarOpen)

  if (!sidebarOpen) return null;

  const folderLinks = [
    { icon: FolderOpen, label: "Storage", href: `/${workspaceGuid}/root` },
    { icon: Star, label: "Favorites", href: `/${workspaceGuid}/favorites` },
    { icon: Trash2, label: "Trash", href: `/${workspaceGuid}/trash` },
  ]

  return (
    <div className="flex w-64 flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-300">
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
                  "w-full justify-start gap-2",
                  isActive ? "bg-secondary text-secondary-foreground" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Link to={item.href}>
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              </Button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}