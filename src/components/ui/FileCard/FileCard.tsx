import { useState } from "react"
import { ensureSessionId } from "@/lib/cookies"
import { RenameDialog } from "../RenameDialog"
import { PDFPreviewDialog } from "../PDFPreviewDialog"
import { useFileActions } from "@/hooks/useFileActions"
import { useAppStore } from "@/store/useAppStore"
import type { FileCardProps } from "./types"
import DeleteConfirmationDialog from "../DeleteConfirmationDialog"
import FileCardGrid from "./FileCardGrid"
import FileCardList from "./FileCardList"

const FileCard = ({ file, contextFolderGuid, isTrash }: FileCardProps) => {
  const { viewMode, selectedResources, toggleResourceSelection } = useAppStore()
  const isSelected = selectedResources.includes(file.guid)
  const handleSelect = (guid: string) => toggleResourceSelection(guid)

  const [renameDialogOpen, setRenameDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const {
    getDownloadHandler, getFileFavoriteHandler, getFileDeleteHandler, getFileRenameHandler, getFileRestoreHandler, getFilePermanentDeleteHandler
  } = useFileActions()

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

  const handleDeleteClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault(); e.stopPropagation();
    }
    setDeleteDialogOpen(true);
  }

  const handlePreviewClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault(); e.stopPropagation();
    }
    setIsPreviewOpen(true);
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
        onConfirm={() => { if (isTrash) onPermanentDelete(); else onDelete(); setDeleteDialogOpen(false); }}
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

export default FileCard
