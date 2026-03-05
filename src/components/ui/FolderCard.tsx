import { Link, useParams } from "react-router-dom"
import { FolderClosed, Star, Trash2, MoreVertical, Pencil, Check, X } from "lucide-react"
import type { FolderData } from "@/lib/api"
import React, { useState, useEffect } from "react"
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog"
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

export const FolderCard = ({ folder, contextFolderGuid }: FolderCardProps) => {
  const { workspaceGuid } = useParams<{ workspaceGuid: string }>()
  const viewMode = useAppStore(state => state.viewMode)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)
  const [tempName, setTempName] = useState(folder.name)

  const { getFolderFavoriteHandler, getFolderDeleteHandler, getFolderRenameHandler } = useResourceActions()

  const onFavoriteToggle = getFolderFavoriteHandler(folder)
  const onDelete = getFolderDeleteHandler(folder, contextFolderGuid)
  const onRename = getFolderRenameHandler(folder)

  useEffect(() => {
    setTempName(folder.name)
  }, [folder.name])

  const handleRename = () => {
    const trimmed = tempName.trim()
    if (trimmed && trimmed !== folder.name && onRename) {
      onRename(trimmed)
    }
    setIsEditingName(false)
  }

  const handleCancelRename = () => {
    setTempName(folder.name)
    setIsEditingName(false)
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    onDelete({ preventDefault: () => { }, stopPropagation: () => { } } as React.MouseEvent)
    setDeleteDialogOpen(false)
  }

  const isGrid = viewMode === "grid"

  return (
    <>
      <Link
        to={isEditingName ? "#" : `/${workspaceGuid}/folder/${folder.guid}`}
        className="group relative"
        onClick={(e) => {
          if (isEditingName) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
      >
        <div className={`p-3 border rounded-lg shadow-sm hover:bg-accent cursor-pointer transition-colors flex items-center justify-between gap-3 ${isGrid ? 'h-20' : 'h-12'}`}>
          <div className="flex items-center gap-3 truncate min-w-0 flex-1">
            <span className={`${isGrid ? 'text-2xl' : 'text-xl'} shrink-0`}><FolderClosed className="text-sidebar-foreground" /></span>

            {isEditingName ? (
              <div className="flex items-center gap-1 flex-1 min-w-0">
                <input
                  autoFocus
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onBlur={handleRename}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleRename()
                    if (e.key === "Escape") handleCancelRename()
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className="flex-1 min-w-0 font-medium bg-background border-b-2 border-primary outline-none px-1 text-sm"
                />
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); handleRename(); }}
                  className="p-1 hover:bg-muted rounded-md text-green-500 shrink-0"
                  title="Save"
                >
                  <Check className="size-4" />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); handleCancelRename(); }}
                  className="p-1 hover:bg-muted rounded-md text-destructive shrink-0"
                  title="Cancel"
                >
                  <X className="size-4" />
                </button>
              </div>
            ) : (
              <div className={`flex ${isGrid ? 'flex-col' : 'flex-row items-center gap-2'} truncate`}>
                <span className="font-medium truncate">{folder.name}</span>
                <span className="text-xs text-muted-foreground truncate">
                  {folder.files_count === 0 ? 'empty' :
                    folder.files_count === 1 ? '1 file' :
                      `${folder.files_count} files`}
                </span>
              </div>
            )}
          </div>

          {!isEditingName && (
            <div className="flex items-center gap-1">
              <button
                onClick={onFavoriteToggle}
                className={`p-2 hover:bg-yellow-500/10 rounded-full transition-all shrink-0 ${folder.is_favorite ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                title={folder.is_favorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Star className={`h-4 w-4 ${folder.is_favorite ? 'fill-yellow-400 text-yellow-500' : 'text-muted-foreground'}`} />
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 rounded-full opacity-0 group-hover:opacity-100 transition-all shrink-0 cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <MoreVertical className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsEditingName(true);
                    }}
                    className="cursor-pointer"
                  >
                    <Pencil className="mr-2 size-4" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => handleDeleteClick(e as any)}
                    className="text-destructive focus:text-destructive cursor-pointer"
                  >
                    <Trash2 className="mr-2 size-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </Link>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Folder"
        description={<>Are you sure you want to delete <span className="font-bold">"{folder.name}"</span>? <br /> All files inside will be moved to Trash.</>}
      />
    </>
  )
}