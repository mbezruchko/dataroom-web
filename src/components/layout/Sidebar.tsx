import { cn } from "@/lib/utils"
import { FolderOpen, Lock, Star, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link, useLocation } from "react-router-dom"
import { useAppStore } from "@/store/useAppStore"

const folderLinks = [
  { icon: FolderOpen, label: "Storage", href: "/root" },
  { icon: Star, label: "Favorites", href: "/favorites" },
  { icon: Trash2, label: "Trash", href: "/trash" },
]

export function Sidebar() {
  const location = useLocation()
  const sidebarOpen = useAppStore(state => state.sidebarOpen)

  if (!sidebarOpen) return null;

  return (
    <div className="flex w-64 flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-300">
      <div className="flex h-14 items-center border-b px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <div className="flex size-6 items-center justify-center rounded-sm bg-primary/10 text-primary">
            <Lock className="size-4" />
          </div>
          <span>DataRoom</span>
        </Link>
      </div>

      <div className="flex-1 overflow-auto py-2">
        <nav className="space-y-1 px-2">
          {folderLinks.map((item, index) => {
            const isActive = location.pathname.startsWith(item.href);

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