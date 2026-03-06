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

interface FolderCardProps {
  folder: FolderData
  contextFolderGuid?: string | null
}

interface ViewProps extends FolderCardProps {
  onFavoriteToggle: (e: React.MouseEvent) => void
  handleDeleteClick: (e: React.MouseEvent) => void
  handleRenameClick: (e: React.MouseEvent) => void
}

// --- GRID VIEW ---
const FolderCardGrid = ({
  folder,
  onFavoriteToggle,
  handleDeleteClick,
  handleRenameClick
}: ViewProps) => (
  <div className="h-20 p-3 border rounded-lg shadow-sm hover:bg-accent/80 cursor-pointer transition-colors flex items-center justify-between gap-3">
    <div className="flex items-center gap-3 truncate min-w-0 flex-1">
      <span className="text-2xl shrink-0"><FolderClosed className="text-sidebar-foreground" /></span>
      <div className="flex flex-col truncate">
        <span className="font-medium truncate">{folder.name}</span>
        <span className="text-xs text-muted-foreground truncate">
          {folder.files_count === 0 ? 'empty' : folder.files_count === 1 ? '1 file' : `${folder.files_count} files`}
        </span>
      </div>
    </div>
    <FolderActions
      isFavorite={folder.is_favorite}
      onFavorite={onFavoriteToggle}
      onRename={handleRenameClick}
      onDelete={handleDeleteClick}
      isGrid={true}
    />
  </div>
)

// --- LIST VIEW ---
const FolderCardList = ({
  folder,
  onFavoriteToggle,
  handleDeleteClick,
  handleRenameClick
}: ViewProps) => (
  <div className="h-12 border-b border-border hover:bg-muted cursor-pointer transition-colors grid grid-cols-[80px_1fr_180px_100px_48px] gap-3 px-3 items-center group">
    <div className="flex justify-center group-hover:scale-110 transition-transform">
      <FolderClosed className="text-sidebar-foreground size-5" />
    </div>
    <div className="truncate min-w-0">
      <span className="font-medium truncate">{folder.name}</span>
    </div>
    <div className="text-sm text-muted-foreground truncate">
      {new Date(folder.updated_at || folder.created_at).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
    </div>
    <div className="text-sm text-muted-foreground truncate">
      {folder.files_count === 0 ? '--' : folder.files_count === 1 ? '1 file' : `${folder.files_count} files`}
    </div>
    <FolderActions
      isFavorite={folder.is_favorite}
      onFavorite={onFavoriteToggle}
      onRename={handleRenameClick}
      onDelete={handleDeleteClick}
      className="px-1"
      isGrid={false}
    />
  </div>
)

// --- HELPERS ---
const FolderActions = ({ isFavorite, onFavorite, onRename, onDelete, isGrid, className = "" }: any) => (
  <div className={`flex items-center justify-end gap-1 ${className}`}>
    <button
      onClick={onFavorite}
      className={`p-2 hover:bg-yellow-500/10 rounded-full transition-all shrink-0 ${isFavorite ? 'opacity-100' : isGrid ? 'opacity-0 group-hover:opacity-100' : 'opacity-40 hover:opacity-100'}`}
    >
      <Star className={`h-4 w-4 ${isFavorite ? 'fill-yellow-400 text-yellow-500' : 'text-muted-foreground'}`} />
    </button>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={`size-8 rounded-full transition-all shrink-0 cursor-pointer ${isGrid ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`} onClick={e => { e.preventDefault(); e.stopPropagation(); }}>
          <MoreVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={e => { e.preventDefault(); e.stopPropagation(); onRename(); }} className="cursor-pointer">
          <Pencil className="mr-2 size-4" /> Rename
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive cursor-pointer">
          <Trash2 className="mr-2 size-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
)

// --- MAIN COMPONENT ---
export const FolderCard = ({ folder, contextFolderGuid }: FolderCardProps) => {
  const { workspaceGuid } = useParams<{ workspaceGuid: string }>()
  const viewMode = useAppStore(state => state.viewMode)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [renameDialogOpen, setRenameDialogOpen] = useState(false)

  const { getFolderFavoriteHandler, getFolderDeleteHandler, getFolderRenameHandler } = useResourceActions()

  const onFavoriteToggle = getFolderFavoriteHandler(folder)
  const onDelete = getFolderDeleteHandler(folder, contextFolderGuid)
  const onRename = getFolderRenameHandler(folder)

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDeleteDialogOpen(true)
  }

  const handleRenameClick = () => {
    setRenameDialogOpen(true)
  }

  const handleRenameConfirm = (newName: string) => {
    onRename(newName)
    setRenameDialogOpen(false)
  }

  const commonProps = {
    folder,
    onFavoriteToggle,
    handleDeleteClick,
    handleRenameClick
  }

  return (
    <>
      <Link
        to={`/${workspaceGuid}/folder/${folder.guid}`}
        className="group relative"
      >
        {viewMode === 'grid' ? <FolderCardGrid {...commonProps} /> : <FolderCardList {...commonProps} />}
      </Link>

      <RenameDialog
        open={renameDialogOpen}
        onOpenChange={setRenameDialogOpen}
        onConfirm={handleRenameConfirm}
        title="Rename Folder"
        description="Enter a new name for the folder."
        initialValue={folder.name}
      />

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => { onDelete({ preventDefault: () => { }, stopPropagation: () => { } } as any); setDeleteDialogOpen(false); }}
        title="Delete Folder"
        description={<>Are you sure you want to delete <span className="font-bold">"{folder.name}"</span>? <br /> All files inside will be moved to Trash.</>}
      />
    </>
  )
}