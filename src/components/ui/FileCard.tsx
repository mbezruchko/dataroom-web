import { useState, useEffect } from "react"
import { FileText, Star, Trash2, Download, Pencil, Check, X, Eye, MoreVertical } from "lucide-react"
import type { FileData } from "@/lib/api"
import React from "react"
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog"
import { PDFPreviewDialog } from "./PDFPreviewDialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useResourceActions } from "@/hooks/useResourceActions"
import { useAppStore } from "@/store/useAppStore"

interface FileCardProps {
  file: FileData
  contextFolderGuid?: string | null
}

export const FileCard = ({ file, contextFolderGuid }: FileCardProps) => {
  const viewMode = useAppStore(state => state.viewMode)
  const [isEditingName, setIsEditingName] = useState(false)
  const [tempName, setTempName] = useState(file.name)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const { getDownloadHandler, getFileFavoriteHandler, getFileDeleteHandler, getFileRenameHandler } = useResourceActions()

  const onDownload = getDownloadHandler(file.guid)
  const onFavoriteToggle = getFileFavoriteHandler(file)
  const onDelete = getFileDeleteHandler(file, contextFolderGuid)
  const onRename = getFileRenameHandler(file)

  useEffect(() => {
    setTempName(file.name)
  }, [file.name])

  const handleRename = () => {
    const trimmed = tempName.trim()
    if (trimmed && trimmed !== file.name && onRename) {
      onRename(trimmed)
    }
    setIsEditingName(false)
  }

  const handleCancelRename = () => {
    setTempName(file.name)
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

  const handlePreviewClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsPreviewOpen(true)
  }

  const fileUrl = `/api/v1/files/${file.guid}/download`
  const isGrid = viewMode === "grid"

  return (
    <>
      <div
        onClick={handlePreviewClick}
        className={`group relative p-3 border rounded-lg shadow-sm hover:bg-accent cursor-pointer transition-colors flex items-center justify-between gap-3 ${isGrid ? 'h-20' : 'h-12'}`}
      >
        <div className="flex items-center gap-3 truncate min-w-0 flex-1">
          <span className={`${isGrid ? 'text-2xl' : 'text-xl'} shrink-0`}><FileText className="text-sidebar-foreground" /></span>
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
                onClick={(e) => e.stopPropagation()}
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
            <div className={`flex ${isGrid ? 'flex-col' : 'flex-row items-center gap-2'} truncate min-w-0`}>
              <span className="font-medium truncate">{file.name}</span>
              <span className="text-xs text-muted-foreground truncate">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
          )}
        </div>
        {!isEditingName && (
          <div className="flex items-center gap-1">
            <button
              onClick={onFavoriteToggle}
              className={`p-2 hover:bg-yellow-500/10 rounded-full transition-all shrink-0 ${file.is_favorite ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
              title={file.is_favorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Star className={`h-4 w-4 ${file.is_favorite ? 'fill-yellow-400 text-yellow-500' : 'text-muted-foreground'}`} />
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 rounded-full opacity-0 group-hover:opacity-100 transition-all shrink-0 cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem
                  onClick={(e) => handlePreviewClick(e as any)}
                  className="cursor-pointer"
                >
                  <Eye className="mr-2 size-4" />
                  Preview
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => onDownload(e as any)}
                  className="cursor-pointer"
                >
                  <Download className="mr-2 size-4" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
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

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Delete File"
        description={<>Are you sure you want to delete <span className="font-bold">"{file.name}"</span>? It will be moved to Trash.</>}
      />

      <PDFPreviewDialog
        isOpen={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        fileUrl={fileUrl}
        fileName={file.name}
      />
    </>
  )
}