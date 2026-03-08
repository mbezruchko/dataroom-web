import { Link, useParams } from "react-router-dom"
import { FolderClosed } from "lucide-react"
import { Checkbox } from "../checkbox"
import { useAppStore } from "@/store/useAppStore"
import FolderActions from "./FolderActions"
import type { ViewProps } from "./types"

const FolderCardGrid = ({ folder, isSelected, onSelect, onFavoriteToggle, handleDeleteClick, handleRenameClick }: ViewProps) => {
  const { workspaceGuid } = useParams<{ workspaceGuid: string }>()
  const { isBulkMode } = useAppStore()
  const activeBulk = isBulkMode || isSelected

  return (
    <div className={`h-20 p-3 border rounded-lg shadow-sm hover:bg-accent/80 cursor-pointer transition-all flex items-center justify-between gap-3 group/card relative overflow-hidden ${isSelected ? 'border-primary bg-primary/5' : 'bg-card'}`}>
      <div
        className={`absolute left-3 top-1/2 -translate-y-1/2 size-8 flex items-center justify-center transition-all duration-300 ease-in-out z-20
          ${activeBulk ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
      >
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onSelect(folder.guid)}
        />
      </div>

      <Link
        to={`/${workspaceGuid}/folder/${folder.guid}`}
        className={`flex items-center gap-3 truncate min-w-0 flex-1 transition-transform duration-300 ease-in-out hover:no-underline
          ${activeBulk ? 'translate-x-[32px]' : ''}`}
      >
        <div className="shrink-0">
          <FolderClosed className="text-sidebar-foreground size-7" />
        </div>
        <div className="flex flex-col truncate">
          <span className="font-medium truncate text-foreground">{folder.name}</span>
          <span className="text-xs text-muted-foreground truncate">
            {folder.files_count === 0 ? 'empty' : folder.files_count === 1 ? '1 file' : `${folder.files_count} files`}
          </span>
        </div>
        <span className="absolute inset-0 z-0" aria-hidden="true" />
      </Link>

      <FolderActions
        isFavorite={folder.is_favorite}
        onFavorite={onFavoriteToggle}
        onRename={handleRenameClick}
        onDelete={handleDeleteClick}
        isGrid={true}
        className="relative z-10"
      />
    </div>
  )
}

export default FolderCardGrid
