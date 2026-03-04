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
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import React, { useState } from "react"
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
  // URL is /:workspaceGuid/folder/:folderGuid or /:workspaceGuid/root
  const folderGuid = pathParts[1] === "folder" ? pathParts[2] : (pathParts[1] === "root" ? "root" : "root")

  const { data: folderPath, isLoading } = useFolderPath(folderGuid)

  const items: BreadcrumbItemData[] = [
    { label: "Root", href: `/${workspaceGuid}/root`, active: folderGuid === 'root' }
  ];

  if (folderPath && folderPath.length > 0) {
    folderPath.forEach((folder, index) => {
      const isLast = index === folderPath.length - 1;
      items.push({
        label: folder.name,
        href: `/${workspaceGuid}/folder/${folder.guid}`,
        active: isLast
      });
    });
  }

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && search.trim()) {
      navigate(`/${workspaceGuid}/search?q=${encodeURIComponent(search.trim())}`)
      setSearch("")
    }
  }

  const renderBreadcrumbs = () => {
    if (items.length <= 3) {
      return items.map((item, index) => (
        <React.Fragment key={index}>
          <BreadcrumbItem>
            {item.active ? (
              <BreadcrumbPage>{item.label}</BreadcrumbPage>
            ) : (
              <BreadcrumbLink asChild>
                <Link to={item.href}>{item.label}</Link>
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
          {index < items.length - 1 && <BreadcrumbSeparator />}
        </React.Fragment>
      ))
    }
    const first = items[0]
    const lastTwo = items.slice(-2)

    return (
      <>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to={first.href}>{first.label}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {lastTwo.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              {item.active ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={item.href}>{item.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index === 0 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </>
    )
  }
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
      <div className="flex items-center gap-4 flex-1">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
        <Breadcrumb>
          {isLoading ? (
            <div className="h-5 w-32 animate-pulse rounded bg-muted" />
          ) : (
            <BreadcrumbList>{renderBreadcrumbs()}</BreadcrumbList>
          )}
        </Breadcrumb>
      </div>
      <div className="flex flex-1 justify-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search documents..."
            className="w-full bg-background pl-8 sm:w-[300px]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>
      </div>
      <div className="flex-1" />
    </header>
  )
}