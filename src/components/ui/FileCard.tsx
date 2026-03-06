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
import { Checkbox } from "./checkbox"

interface FileCardProps {
  file: FileData
  contextFolderGuid?: string | null
  isTrash?: boolean
}

interface ViewProps extends FileCardProps {
  isSelected: boolean
  onSelect: (guid: string) => void
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
  isSelected,
  onSelect,
  onFavoriteToggle,
  handleDeleteClick,
  handleRenameClick,
  handlePreviewClick,
  onDownload,
  onRestore
}: ViewProps) => {
  const { isBulkMode } = useAppStore()
  const activeBulk = isBulkMode || isSelected

  return (
    <div className={`group/card relative p-3 border rounded-lg shadow-sm transition-all flex items-center justify-between gap-3 group/card overflow-hidden ${isTrash ? 'opacity-80' : ''} ${isSelected ? 'border-primary bg-primary/5' : 'bg-card'}`}>
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
          onCheckedChange={() => onSelect(file.guid)}
        />
      </div>

      <div
        onClick={handlePreviewClick}
        className={`flex items-center gap-3 truncate min-w-0 flex-1 transition-transform duration-300 ease-in-out cursor-pointer
          ${activeBulk ? 'translate-x-[32px]' : ''}`}
      >
        <div className="shrink-0">
          <FileText className="text-sidebar-foreground size-8" />
        </div>
        <div className="flex flex-col truncate">
          <span className="font-medium truncate text-foreground">{file.name}</span>
          <span className="text-xs text-muted-foreground truncate">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
        </div>
      </div>

      <FileActions
        file={file} isTrash={isTrash} onFavorite={onFavoriteToggle} onPreview={handlePreviewClick}
        onDownload={onDownload} onRename={handleRenameClick} onDelete={handleDeleteClick} onRestore={onRestore}
        isGrid={true}
        className="relative z-10"
      />
    </div>
  )
}

// --- LIST VIEW ---
const FileCardList = ({
  file,
  isTrash,
  isSelected,
  onSelect,
  onFavoriteToggle,
  handleDeleteClick,
  handleRenameClick,
  handlePreviewClick,
  onDownload,
  onRestore
}: ViewProps) => {
  const { isBulkMode } = useAppStore()
  const showCheckbox = isBulkMode || isSelected
  const gridCols = showCheckbox ? 'grid-cols-[48px_80px_1fr_180px_100px_48px]' : 'grid-cols-[80px_1fr_180px_100px_48px]'

  return (
    <div className={`group/card relative border-b border-border transition-colors h-12 grid ${gridCols} gap-3 px-3 items-center hover:bg-muted ${isTrash ? 'opacity-80' : ''} ${isSelected ? 'bg-primary/5' : ''}`}>
      {showCheckbox && (
        <div className="flex justify-center relative z-20" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onSelect(file.guid)}
          />
        </div>
      )}

      <div
        onClick={handlePreviewClick}
        className="grid grid-cols-subgrid col-span-4 contents cursor-pointer"
      >
        <div className="flex justify-center group-hover/card:scale-110 transition-transform">
          <FileText className="text-sidebar-foreground size-5" />
        </div>
        <div className="truncate min-w-0">
          <span className="font-medium truncate text-foreground">{file.name}</span>
        </div>
        <div className="text-sm text-muted-foreground truncate">
          {new Date(file.updated_at || file.created_at).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="text-sm text-muted-foreground truncate">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
      </div>

      <FileActions
        file={file} isTrash={isTrash} onFavorite={onFavoriteToggle} onPreview={handlePreviewClick}
        onDownload={onDownload} onRename={handleRenameClick} onDelete={handleDeleteClick} onRestore={onRestore}
        className="px-1 relative z-20"
        isGrid={false}
      />
    </div>
  )
}

// --- HELPERS ---
const FileActions = ({ file, isTrash, onFavorite, onPreview, onDownload, onRename, onDelete, onRestore, isGrid, className = "" }: any) => (
  <div className={`flex items-center justify-end gap-1 ${className}`}>
    {!isTrash && (
      <button
        onClick={onFavorite}
        className={`p-2 hover:bg-yellow-500/10 rounded-full transition-all shrink-0 ${file.is_favorite ? 'opacity-100' : isGrid ? 'group-hover/card:opacity-100 opacity-0' : 'opacity-40 hover:opacity-100'}`}
      >
        <Star className={`h-4 w-4 ${file.is_favorite ? 'fill-yellow-400 text-yellow-500' : 'text-muted-foreground'}`} />
      </button>
    )}
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={`size-8 rounded-full transition-all shrink-0 cursor-pointer ${isGrid ? 'group-hover/card:opacity-100 opacity-0' : 'opacity-100'}`} onClick={e => e.stopPropagation()}>
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
  const { viewMode, selectedResources, toggleResourceSelection } = useAppStore()
  const isSelected = selectedResources.includes(file.guid)
  const handleSelect = (guid: string) => toggleResourceSelection(guid)

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
    file, isTrash, isSelected, onSelect: handleSelect, onFavoriteToggle, handleDeleteClick, handleRenameClick, handlePreviewClick, onDownload, onRestore
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