import { useState } from "react"
import { FileText, Star, Trash2, Download, Pencil, Eye, MoreVertical, RotateCcw } from "lucide-react"
import type { FileData } from "@/lib/api"
import React from "react"
import { ensureSessionId } from "@/lib/cookies"
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog"
import { RenameDialog } from "./RenameDialog"
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
  isTrash?: boolean
}

interface ViewProps extends FileCardProps {
  onFavoriteToggle: (e: React.MouseEvent) => void
  handleDeleteClick: (e: React.MouseEvent) => void
  handleRenameClick: () => void
  handlePreviewClick: (e: React.MouseEvent) => void
  onDownload: (e: React.MouseEvent) => void
  onRestore: (e: React.MouseEvent) => void
}

// --- GRID VIEW ---
const FileCardGrid = ({
  file,
  isTrash,
  onFavoriteToggle,
  handleDeleteClick,
  handleRenameClick,
  handlePreviewClick,
  onDownload,
  onRestore
}: ViewProps) => (
  <div onClick={handlePreviewClick} className={`group relative p-3 border rounded-lg shadow-sm transition-colors flex items-center justify-between gap-3 cursor-pointer hover:bg-accent/80 h-20 ${isTrash ? 'opacity-80' : ''}`}>
    <div className="flex items-center gap-3 truncate min-w-0 flex-1">
      <span className="text-2xl shrink-0"><FileText className="text-sidebar-foreground" /></span>
      <div className="flex flex-col truncate">
        <span className="font-medium truncate">{file.name}</span>
        <span className="text-xs text-muted-foreground truncate">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
      </div>
    </div>
    <FileActions
      file={file} isTrash={isTrash} onFavorite={onFavoriteToggle} onPreview={handlePreviewClick}
      onDownload={onDownload} onRename={handleRenameClick} onDelete={handleDeleteClick} onRestore={onRestore}
      isGrid={true}
    />
  </div>
)

// --- LIST VIEW ---
const FileCardList = ({
  file,
  isTrash,
  onFavoriteToggle,
  handleDeleteClick,
  handleRenameClick,
  handlePreviewClick,
  onDownload,
  onRestore
}: ViewProps) => (
  <div onClick={handlePreviewClick} className={`group relative border-b border-border transition-colors h-12 grid grid-cols-[80px_1fr_180px_100px_48px] gap-3 px-3 items-center cursor-pointer hover:bg-muted ${isTrash ? 'opacity-80' : ''}`}>
    <div className="flex justify-center group-hover:scale-110 transition-transform">
      <FileText className="text-sidebar-foreground size-5" />
    </div>
    <div className="truncate min-w-0">
      <span className="font-medium truncate">{file.name}</span>
    </div>
    <div className="text-sm text-muted-foreground truncate">
      {new Date(file.updated_at || file.created_at).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
    </div>
    <div className="text-sm text-muted-foreground truncate">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
    <FileActions
      file={file} isTrash={isTrash} onFavorite={onFavoriteToggle} onPreview={handlePreviewClick}
      onDownload={onDownload} onRename={handleRenameClick} onDelete={handleDeleteClick} onRestore={onRestore}
      className="px-1"
      isGrid={false}
    />
  </div>
)

// --- HELPERS ---
const FileActions = ({ file, isTrash, onFavorite, onPreview, onDownload, onRename, onDelete, onRestore, isGrid, className = "" }: any) => (
  <div className={`flex items-center justify-end gap-1 ${className}`}>
    {!isTrash && (
      <button
        onClick={onFavorite}
        className={`p-2 hover:bg-yellow-500/10 rounded-full transition-all shrink-0 ${file.is_favorite ? 'opacity-100' : isGrid ? 'opacity-0 group-hover:opacity-100' : 'opacity-40 hover:opacity-100'}`}
      >
        <Star className={`h-4 w-4 ${file.is_favorite ? 'fill-yellow-400 text-yellow-500' : 'text-muted-foreground'}`} />
      </button>
    )}
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={`size-8 rounded-full transition-all shrink-0 cursor-pointer ${isGrid ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`} onClick={e => e.stopPropagation()}>
          <MoreVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {isTrash ? (
          <>
            <DropdownMenuItem onClick={onPreview} className="cursor-pointer">
              <Eye className="mr-2 size-4" /> Preview
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onRestore} className="cursor-pointer">
              <RotateCcw className="mr-2 size-4" /> Restore
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive cursor-pointer">
              <Trash2 className="mr-2 size-4" /> Delete
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem onClick={onPreview} className="cursor-pointer">
              <Eye className="mr-2 size-4" /> Preview
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDownload} className="cursor-pointer">
              <Download className="mr-2 size-4" /> Download
            </DropdownMenuItem>
            <DropdownMenuItem onClick={e => { e.stopPropagation(); onRename(); }} className="cursor-pointer">
              <Pencil className="mr-2 size-4" /> Rename
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive cursor-pointer">
              <Trash2 className="mr-2 size-4" /> Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
)

// --- MAIN COMPONENT ---
export const FileCard = ({ file, contextFolderGuid, isTrash }: FileCardProps) => {
  const viewMode = useAppStore(state => state.viewMode)
  const [renameDialogOpen, setRenameDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const {
    getDownloadHandler, getFileFavoriteHandler, getFileDeleteHandler, getFileRenameHandler, getFileRestoreHandler, getFilePermanentDeleteHandler
  } = useResourceActions()

  const onDownload = getDownloadHandler(file.guid)
  const onFavoriteToggle = getFileFavoriteHandler(file)
  const onDelete = getFileDeleteHandler(file, contextFolderGuid)
  const onRename = getFileRenameHandler(file)
  const onRestore = getFileRestoreHandler(file)
  const onPermanentDelete = getFilePermanentDeleteHandler(file)

  const handleRenameClick = () => {
    setRenameDialogOpen(true)
  }

  const handleRenameConfirm = (newName: string) => {
    onRename(newName)
    setRenameDialogOpen(false)
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation(); setDeleteDialogOpen(true);
  }

  const handlePreviewClick = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation(); setIsPreviewOpen(true);
  }

  const baseUrl = import.meta.env.VITE_API_BASE_URL ?? '/api/v1'
  const sessionId = ensureSessionId()
  const fileUrl = `${baseUrl}/files/${file.guid}/download?session-guid=${sessionId}`

  const commonProps = {
    file, isTrash, onFavoriteToggle, handleDeleteClick, handleRenameClick, handlePreviewClick, onDownload, onRestore
  }

  return (
    <>
      {viewMode === 'grid' ? <FileCardGrid {...commonProps} /> : <FileCardList {...commonProps} />}

      <RenameDialog
        open={renameDialogOpen}
        onOpenChange={setRenameDialogOpen}
        onConfirm={handleRenameConfirm}
        title="Rename File"
        description="Enter a new name for the file."
        initialValue={file.name}
      />

      <DeleteConfirmationDialog
        open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}
        onConfirm={() => { if (isTrash) onPermanentDelete({} as any); else onDelete({} as any); setDeleteDialogOpen(false); }}
        title={isTrash ? "Permanently Delete" : "Delete File"}
        description={isTrash ? (
          <>Are you sure you want to permanently delete <span className="font-bold">"{file.name}"</span>? This cannot be undone.</>
        ) : (
          <>Are you sure you want to delete <span className="font-bold">"{file.name}"</span>? It will be moved to Trash.</>
        )}
      />

      <PDFPreviewDialog isOpen={isPreviewOpen} onOpenChange={setIsPreviewOpen} fileUrl={fileUrl} fileName={file.name} />
    </>
  )
}