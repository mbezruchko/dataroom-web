import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
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
import React, { useState, useMemo, useCallback } from "react"
import { Link, useNavigate, useLocation, useParams } from "react-router-dom"
import { useAppStore } from "@/store/useAppStore"
import { useFolderPath } from "@/lib/queries"


interface BreadcrumbItemData {
  label: string
  href: string
  active?: boolean
}

export function Header() {
  const toggleSidebar = useAppStore(state => state.toggleSidebar)

  const navigate = useNavigate()
  const location = useLocation()
  const { workspaceGuid } = useParams<{ workspaceGuid: string }>()
  const [search, setSearch] = useState("")

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

  const handleSearch = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && search.trim()) {
      navigate(`/${workspaceGuid}/search?q=${encodeURIComponent(search.trim())}`)
      setSearch("")
    }
  }, [workspaceGuid, search, navigate]);

  const renderBreadcrumbs = () => {
    const BreadcrumbContent = ({ item }: { item: BreadcrumbItemData }) => {
      const content = item.active ? (
        <BreadcrumbPage className="max-w-[150px] truncate" title={item.label}>
          {item.label}
        </BreadcrumbPage>
      ) : (
        <BreadcrumbLink asChild className="max-w-[150px] truncate" title={item.label}>
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
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden shrink-0">
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

      {/* Centered Search */}
      <div className="absolute left-1/2 -translate-x-1/2 hidden sm:block w-full max-w-[250px] lg:max-w-[400px]">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search documents..."
            className="w-full bg-background/50 pl-8 focus-visible:bg-background transition-colors"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {/* Actions/Profile can go here if any */}
      </div>
    </header>
  )
}