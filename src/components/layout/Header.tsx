import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import React, { useMemo } from "react"
import { Link, useLocation, useParams } from "react-router-dom"
import { useAppStore } from "@/store/useAppStore"
import { useFolderPath } from "@/lib/queries"

interface BreadcrumbItemData {
  label: string
  href: string
  active?: boolean
}

export function Header() {
  const toggleSidebar = useAppStore(state => state.toggleSidebar)
  const location = useLocation()
  const { workspaceGuid } = useParams<{ workspaceGuid: string }>()

  const pathParts = location.pathname.split("/").filter(Boolean)
  const folderGuid = pathParts[1] === "folder" ? pathParts[2] : (pathParts[1] === "root" ? "root" : "root")

  const { data: folderPath, isLoading } = useFolderPath(folderGuid)

  const items = useMemo((): BreadcrumbItemData[] => {
    const breadcrumbs: BreadcrumbItemData[] = [
      { label: "Root", href: `/${workspaceGuid}/root`, active: folderGuid === 'root' }
    ];

    if (folderPath && folderPath.length > 0) {
      folderPath.forEach((folder, index) => {
        const isLast = index === folderPath.length - 1;
        breadcrumbs.push({
          label: folder.name,
          href: `/${workspaceGuid}/folder/${folder.guid}`,
          active: isLast
        });
      });
    }
    return breadcrumbs;
  }, [workspaceGuid, folderGuid, folderPath]);

  const renderBreadcrumbs = () => {
    const BreadcrumbContent = ({ item }: { item: BreadcrumbItemData }) => {
      const content = item.active ? (
        <BreadcrumbPage className="max-w-[80px] sm:max-w-[150px] truncate" title={item.label}>
          {item.label}
        </BreadcrumbPage>
      ) : (
        <BreadcrumbLink asChild className="max-w-[80px] sm:max-w-[150px] truncate" title={item.label}>
          <Link to={item.href}>{item.label}</Link>
        </BreadcrumbLink>
      )
      return content
    }

    if (items.length <= 3) {
      return items.map((item, index) => (
        <React.Fragment key={index}>
          <BreadcrumbItem>
            <BreadcrumbContent item={item} />
          </BreadcrumbItem>
          {index < items.length - 1 && <BreadcrumbSeparator />}
        </React.Fragment>
      ))
    }

    const first = items[0]
    const middle = items.slice(1, -2)
    const lastTwo = items.slice(-2)

    return (
      <>
        <BreadcrumbItem>
          <BreadcrumbContent item={first} />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1">
              <BreadcrumbEllipsis className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {middle.map((item, index) => (
                <DropdownMenuItem key={index} asChild>
                  <Link to={item.href} className="cursor-pointer truncate max-w-[200px]">
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {lastTwo.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              <BreadcrumbContent item={item} />
            </BreadcrumbItem>
            {index === 0 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </>
    )
  }

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
      <div className="flex items-center gap-4 flex-1 overflow-hidden">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="min-[1440px]:hidden shrink-0 min-h-[44px] min-w-[44px]">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
        <Breadcrumb className="truncate min-w-0 flex-1">
          {isLoading ? (
            <div className="h-5 w-32 animate-pulse rounded bg-muted" />
          ) : (
            <BreadcrumbList>{renderBreadcrumbs()}</BreadcrumbList>
          )}
        </Breadcrumb>
      </div>
    </header>
  )
}
