import React, { useState, useCallback, useEffect } from "react"
import { Search } from "lucide-react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { useAppStore } from "@/store/useAppStore"
import { Badge } from "@/components/ui/badge"

const SmartSearch = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { workspaceGuid } = useParams<{ workspaceGuid: string }>()
  const { localSearch, setLocalSearch } = useAppStore()
  const [search, setSearch] = useState(localSearch)
  const [searchMode, setSearchMode] = useState<'folder' | 'workspace'>('folder')

  useEffect(() => {
    if (searchMode === 'folder') {
      setLocalSearch(search)
    } else {
      setLocalSearch("")
    }
  }, [search, searchMode, setLocalSearch])

  const pathParts = location.pathname.split("/").filter(Boolean)
  const folderGuid = pathParts[1] === "folder" ? pathParts[2] : (pathParts[1] === "root" ? "root" : null)

  const handleSearch = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      setSearchMode(prev => prev === 'workspace' ? 'folder' : 'workspace');
      return;
    }

    if (e.key === 'Enter') {
      if (searchMode === 'workspace' && search.trim()) {
        let url = `/${workspaceGuid}/search?q=${encodeURIComponent(search.trim())}`;
        if (folderGuid) {
          url += `&f=${folderGuid}`;
        }
        navigate(url)
        setSearch("")
      }
    }
  }, [workspaceGuid, search, navigate, searchMode, folderGuid]);

  const toggleMode = () => {
    setSearchMode(prev => prev === 'workspace' ? 'folder' : 'workspace');
  }

  return (
    <div className={'relative flex items-center w-full max-w-none'}>
      <div className="absolute left-2.5 flex items-center gap-2 z-10">
        <Search className="size-4 text-muted-foreground pointer-events-none" />
        <Badge
          variant="outline"
          onClick={toggleMode}
          className={`text-[10px] uppercase px-1.5 py-0 rounded border transition-all duration-300 cursor-pointer hover:scale-102 active:scale-95 select-none font-bold shadow-none ${searchMode === 'workspace'
            ? 'bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20 hover:text-blue-600'
            : 'bg-purple-500/10 text-purple-500 border-purple-500/20 hover:bg-purple-500/20 hover:text-purple-600'
            }`}
        >
          {searchMode === 'workspace' ? 'Workspace' : 'Tab'}
        </Badge>
      </div>
      <Input
        type="search"
        placeholder={searchMode === 'workspace' ? "Search in workspace..." : "Search in current tab..."}
        className={`w-full bg-background/50 focus-visible:bg-background transition-all duration-300 h-9 ${searchMode === 'workspace' ? 'pl-[120px] sm:pl-[122px]' : 'pl-[75px] sm:pl-[78px]'
          }`}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleSearch}
      />
    </div>
  )
}

export default SmartSearch
