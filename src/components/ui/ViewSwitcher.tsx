import { LayoutGrid, List } from "lucide-react"
import { useAppStore } from "@/store/useAppStore"
import { Button } from "./button"

export const ViewSwitcher = () => {
  const { viewMode, setViewMode } = useAppStore()

  return (
    <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-lg border">
      <Button
        variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
        size="icon"
        className="h-8 w-8 cursor-pointer"
        onClick={() => setViewMode('grid')}
        title="Grid view"
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
      <Button
        variant={viewMode === 'list' ? 'secondary' : 'ghost'}
        size="icon"
        className="h-8 w-8 cursor-pointer"
        onClick={() => setViewMode('list')}
        title="List view"
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  )
}
