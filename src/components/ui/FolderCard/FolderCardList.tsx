import { Link, useParams } from "react-router-dom"
import { FolderClosed } from "lucide-react"
import { Checkbox } from "../checkbox"
import { useAppStore } from "@/store/useAppStore"
import FolderActions from "./FolderActions"
import type { ViewProps } from "./types"

const FolderCardList = ({ folder, isSelected, onSelect, onFavoriteToggle, handleDeleteClick, handleRenameClick }: ViewProps) => {
  const { workspaceGuid } = useParams<{ workspaceGuid: string }>()
  const { isBulkMode } = useAppStore()
  const showCheckbox = isBulkMode || isSelected
  const gridCols = showCheckbox ? 'grid-cols-[48px_80px_1fr_180px_100px_48px]' : 'grid-cols-[80px_1fr_180px_100px_48px]'

  return (
    <div className={`h-12 border-b border-border hover:bg-muted transition-colors grid ${gridCols} gap-3 px-3 items-center group/card ${isSelected ? 'bg-primary/5' : ''}`}>
      {showCheckbox && (
        <div className="flex justify-center relative z-20" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onSelect(folder.guid)}
          />
        </div>
      )}

      <Link
        to={`/${workspaceGuid}/folder/${folder.guid}`}
        className="grid grid-cols-subgrid col-span-4 contents hover:no-underline"
      >
        <div className="flex justify-center group-hover/card:scale-110 transition-transform">
          <FolderClosed className="text-sidebar-foreground size-5" />
        </div>
        <div className="truncate min-w-0">
          <span className="font-medium truncate text-foreground">{folder.name}</span>
        </div>
        <div className="text-sm text-muted-foreground truncate">
          {new Date(folder.updated_at || folder.created_at).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="text-sm text-muted-foreground truncate">
          {folder.files_count === 0 ? '--' : folder.files_count === 1 ? '1 file' : `${folder.files_count} files`}
        </div>
      </Link>

      <FolderActions
        isFavorite={folder.is_favorite}
        onFavorite={onFavoriteToggle}
        onRename={handleRenameClick}
        onDelete={handleDeleteClick}
        className="px-1 relative z-20"
        isGrid={false}
      />
    </div>
  )
}

export default FolderCardList
