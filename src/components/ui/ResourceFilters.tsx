import { ListFilter, ArrowUp, ArrowDown, CheckSquare } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/store/useAppStore"

const ResourceFilters = () => {
  const { sortField, setSortField, sortOrder, setSortOrder, isBulkMode, setBulkMode } = useAppStore()

  const sortLabel = sortField === 'type' ? 'Type' : sortField === 'name' ? 'Name' : sortField === 'date' ? 'Date' : 'Size'

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={isBulkMode ? "secondary" : "ghost"}
        size="sm"
        className={`h-9 px-3 gap-2 border cursor-pointer ${isBulkMode ? 'border-primary/30 bg-primary/10 text-primary hover:bg-primary/20' : 'border-input bg-background/50'} transition-all duration-300 font-medium text-xs`}
        onClick={() => setBulkMode(!isBulkMode)}
        title={isBulkMode ? "Disable Bulk Mode" : "Enable Bulk Mode"}
      >
        <CheckSquare className={`size-4 ${isBulkMode ? 'text-primary' : 'text-muted-foreground'}`} />
        <span className="not-sr-only max-[475px]:not-sr-only min-[475px]:sr-only sm:not-sr-only">Bulk Actions</span>
      </Button>

      <DropdownMenu>
        <div className="flex items-center h-9 border border-input rounded-md relative hover:bg-accent/50 transition-colors bg-background/50">
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-full gap-1 cursor-pointer pr-1 border-0 focus-visible:ring-0">
              <ListFilter className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap font-normal text-xs text-muted-foreground mr-1">
                Sort by <span className="text-foreground font-medium">{sortLabel}</span>
              </span>
            </Button>
          </DropdownMenuTrigger>
          <div className="w-[1px] h-4 bg-border" />
          <Button
            variant="ghost"
            size="icon"
            className="h-full w-8 cursor-pointer rounded-l-none border-0 focus-visible:ring-0"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            title={sortOrder === 'asc' ? 'Sort Ascending' : 'Sort Descending'}
          >
            {sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
          </Button>
        </div>

        <DropdownMenuContent align="end" className="w-[150px]">
          <DropdownMenuLabel>Sort by</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={sortField} onValueChange={(v) => setSortField(v as any)}>
            <DropdownMenuRadioItem value="type" className="cursor-pointer">Type</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="name" className="cursor-pointer">Name</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="date" className="cursor-pointer">Date</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="size" className="cursor-pointer">Size</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default ResourceFilters
