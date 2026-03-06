import { Link, useParams } from "react-router-dom"
import { FolderClosed, Star, Trash2, MoreVertical, Pencil } from "lucide-react"
import type { FolderData } from "@/lib/api"
import React, { useState } from "react"
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog"
import { RenameDialog } from "./RenameDialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useResourceActions } from "@/hooks/useResourceActions"
import { useAppStore } from "@/store/useAppStore"
import { Checkbox } from "./checkbox"

interface FolderCardProps {
  folder: FolderData
  contextFolderGuid?: string | null
}

interface ViewProps extends FolderCardProps {
  isSelected: boolean
  onSelect: (guid: string) => void
  onFavoriteToggle: (e: React.MouseEvent) => void
  handleDeleteClick: (e: React.MouseEvent) => void
  handleRenameClick: (e: React.MouseEvent) => void
}

// --- GRID VIEW ---
const FolderCardGrid = ({
  folder,
  isSelected,
  onSelect,
  onFavoriteToggle,
  handleDeleteClick,
  handleRenameClick
}: ViewProps) => {
  const { workspaceGuid } = useParams<{ workspaceGuid: string }>()
  const { isBulkMode } = useAppStore()
  const activeBulk = isBulkMode || isSelected

  return (
    <div className={`h-20 p-3 border rounded-lg shadow-sm hover:bg-accent/80 cursor-pointer transition-all flex items-center justify-between gap-3 group/card relative overflow-hidden ${isSelected ? 'border-primary bg-primary/5' : 'bg-card'}`}>
      <div
        className={`absolute left-3 top-1/2 -translate-y-1/2 size-8 flex items-center justify-center transition-all duration-300 ease-in-out z-20 
          ${activeBulk ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
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

// --- LIST VIEW ---
const FolderCardList = ({
  folder,
  isSelected,
  onSelect,
  onFavoriteToggle,
  handleDeleteClick,
  handleRenameClick
}: ViewProps) => {
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

// --- HELPERS ---
const FolderActions = ({ isFavorite, onFavorite, onRename, onDelete, isGrid, className = "" }: any) => (
  <div className={`flex items-center justify-end gap-1 ${className}`}>
    <button
      onClick={onFavorite}
      className={`p-2 hover:bg-yellow-500/10 rounded-full transition-all shrink-0 ${isFavorite ? 'opacity-100' : isGrid ? 'group-hover/card:opacity-100 opacity-0' : 'opacity-40 hover:opacity-100'}`}
    >
      <Star className={`h-4 w-4 ${isFavorite ? 'fill-yellow-400 text-yellow-500' : 'text-muted-foreground'}`} />
    </button>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={`size-8 rounded-full transition-all shrink-0 cursor-pointer ${isGrid ? 'group-hover/card:opacity-100 opacity-0' : 'opacity-100'}`} onClick={e => e.stopPropagation()}>
          <MoreVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onSelect={() => onRename()} className="cursor-pointer">
          <Pencil className="mr-2 size-4" /> Rename
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onDelete()} className="text-destructive focus:text-destructive cursor-pointer">
          <Trash2 className="mr-2 size-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
)

// --- MAIN COMPONENT ---
export const FolderCard = ({ folder, contextFolderGuid }: FolderCardProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showRename, setShowRename] = useState(false)
  const { viewMode, selectedResources, toggleResourceSelection } = useAppStore()
  const isGrid = viewMode === "grid"
  const { getFolderDeleteHandler, getFolderFavoriteHandler, getFolderRenameHandler } = useResourceActions()

  const isSelected = selectedResources.includes(folder.guid)
  const handleSelect = (guid: string) => toggleResourceSelection(guid)

  const onFavoriteToggle = getFolderFavoriteHandler(folder)
  const onDeleteClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setShowDeleteConfirm(true)
  }

  const handleRenameClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setShowRename(true)
  }

  const handleRenameConfirm = (newName: string) => {
    getFolderRenameHandler(folder)(newName)
    setShowRename(false)
  }

  const commonProps = {
    folder,
    contextFolderGuid,
    isSelected,
    onSelect: handleSelect,
    onFavoriteToggle,
    handleDeleteClick: onDeleteClick,
    handleRenameClick
  }

  return (
    <>
      {isGrid ? (
        <FolderCardGrid {...commonProps} />
      ) : (
        <FolderCardList {...commonProps} />
      )}

      <DeleteConfirmationDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        onConfirm={() => getFolderDeleteHandler(folder, contextFolderGuid)({ preventDefault: () => { }, stopPropagation: () => { } } as any)}
        title="Delete Folder"
        description={`Are you sure you want to delete "${folder.name}"? All its contents will be moved to trash.`}
      />

      <RenameDialog
        open={showRename}
        onOpenChange={setShowRename}
        title="Rename Folder"
        initialValue={folder.name}
        onConfirm={handleRenameConfirm}
        maxLength={30}
      />
    </>
  )
}