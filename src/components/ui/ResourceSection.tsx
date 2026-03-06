import React from "react"
import { useAppStore } from "@/store/useAppStore"
import { ChevronUp, ChevronDown } from "lucide-react"

interface ResourceSectionProps {
  children: React.ReactNode
}

export const ResourceSection = ({ children }: ResourceSectionProps) => {
  const { viewMode, sortField, sortOrder, setSortField, setSortOrder } = useAppStore()
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
      {!isGrid && (
        <div className="grid grid-cols-[80px_1fr_180px_100px_48px] gap-3 px-3 py-2 text-xs font-medium text-muted-foreground border-b border-border uppercase tracking-wider select-none">
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