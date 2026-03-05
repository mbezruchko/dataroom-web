import { ListFilter, ArrowUp, ArrowDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/store/useAppStore"

export const ResourceFilters = () => {
  const { sortField, setSortField, sortOrder, setSortOrder, resourceFilter, setResourceFilter } = useAppStore()

  const filterLabel = resourceFilter === 'all' ? 'All' : resourceFilter === 'folders' ? 'Folders' : 'Files'
  const sortLabel = sortField === 'name' ? 'Name' : sortField === 'date' ? 'Date' : 'Size'

  return (
    <div className="flex items-center gap-1">
      <DropdownMenu>
        <div className="flex items-center gap-1 outline outline-1 outline-border rounded-md relative shadow-sm hover:bg-accent/50 transition-colors">
          {resourceFilter !== 'all' && (
            <div className="absolute -top-1 -left-1 w-3 h-3 bg-foreground rounded-full border-2 border-background z-10" />
          )}
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 gap-1 cursor-pointer pr-1">
              <ListFilter className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap font-normal text-xs">
                {filterLabel} | Sorted by {sortLabel}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <div className="w-[1px] h-4 bg-border" />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 cursor-pointer rounded-l-none"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            title={sortOrder === 'asc' ? 'Sort Ascending' : 'Sort Descending'}
          >
            {sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
          </Button>
        </div>

        <DropdownMenuContent align="end" className="w-[150px]">
          <DropdownMenuLabel>Filter by</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={resourceFilter === 'all'}
            onCheckedChange={() => setResourceFilter('all')}
            className="cursor-pointer"
          >
            All items
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={resourceFilter === 'folders'}
            onCheckedChange={() => setResourceFilter('folders')}
            className="cursor-pointer"
          >
            Folders
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={resourceFilter === 'files'}
            onCheckedChange={() => setResourceFilter('files')}
            className="cursor-pointer"
          >
            Files
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Sort by</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={sortField} onValueChange={(v) => setSortField(v as any)}>
            <DropdownMenuRadioItem value="name" className="cursor-pointer">Name</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="date" className="cursor-pointer">Date</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="size" className="cursor-pointer">Size</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
