import React from "react"
import { useAppStore } from "@/store/useAppStore"
import { ChevronUp, ChevronDown } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

interface ResourceSectionProps {
  children: React.ReactNode
  onSelectAll?: (checked: boolean) => void
  isAllSelected?: boolean
}

export const ResourceSection = ({ children, onSelectAll, isAllSelected }: ResourceSectionProps) => {
  const { viewMode, sortField, sortOrder, setSortField, setSortOrder, isBulkMode } = useAppStore()
  const isGrid = viewMode === "grid"

  const handleSort = (field: 'type' | 'name' | 'date' | 'size') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  const SortIndicator = ({ field }: { field: 'type' | 'name' | 'date' | 'size' }) => {
    if (sortField !== field) return null
    return sortOrder === 'asc' ? <ChevronUp className="size-3 ml-1" /> : <ChevronDown className="size-3 ml-1" />
  }

  return (
    <div className="space-y-3 mb-12">
      {(!isGrid || isBulkMode) && (
        <div className={`flex items-center gap-3 px-3 ${isGrid ? 'mb-4 py-2 bg-accent/30 rounded-lg border border-border/50' : `grid ${isBulkMode ? 'grid-cols-[48px_80px_1fr_180px_100px_48px]' : 'grid-cols-[80px_1fr_180px_100px_48px]'} border-b border-border py-2`} text-xs font-medium text-muted-foreground uppercase tracking-wider select-none`}>
          {(!isGrid && isBulkMode || isGrid) && (
            <div className={`${isGrid ? 'flex items-center gap-2' : 'flex justify-center'}`}>
              {onSelectAll && (
                <>
                  <Checkbox
                    id="select-all-resources"
                    checked={isAllSelected}
                    onCheckedChange={onSelectAll}
                  />
                  {isGrid && (
                    <label
                      htmlFor="select-all-resources"
                      className="cursor-pointer hover:text-foreground transition-colors normal-case font-semibold text-[11px] tracking-normal"
                    >
                      Select All
                    </label>
                  )}
                </>
              )}
            </div>
          )}
          {!isGrid && (
            <>
              <div
                className="flex justify-center items-center hover:text-foreground cursor-pointer transition-colors"
                onClick={() => handleSort('type')}
              >
                Type <SortIndicator field="type" />
              </div>
              <div
                className="flex items-center hover:text-foreground cursor-pointer transition-colors"
                onClick={() => handleSort('name')}
              >
                Name <SortIndicator field="name" />
              </div>
              <div
                className="flex items-center hover:text-foreground cursor-pointer transition-colors"
                onClick={() => handleSort('date')}
              >
                Date Modified <SortIndicator field="date" />
              </div>
              <div
                className="flex items-center hover:text-foreground cursor-pointer transition-colors"
                onClick={() => handleSort('size')}
              >
                Size <SortIndicator field="size" />
              </div>
              <div className="text-right whitespace-nowrap">Actions</div>
            </>
          )}
        </div>
      )}
      <div className={
        isGrid
          ? "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4"
          : "flex flex-col"
      }>
        {children}
      </div>
    </div>
  )
}