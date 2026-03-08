import { useCallback } from "react"
import type { MouseEvent } from "react"
import {
  useToggleFavoriteFile,
  useDeleteFile,
  useRenameFile,
  useRestoreFile,
  usePermanentDeleteFile,
} from "@/lib/queries"
import type { FileData } from "@/lib/api"
import { ensureSessionId } from "@/lib/cookies"

export const useFileActions = () => {
  const toggleFavFile = useToggleFavoriteFile()
  const deleteFile = useDeleteFile()
  const renameFile = useRenameFile()
  const restoreFile = useRestoreFile()
  const permanentDeleteFile = usePermanentDeleteFile()

  const handleDownload = useCallback((guid: string) => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? '/api/v1'
    const sessionId = ensureSessionId()
    window.open(`${baseUrl}/files/${guid}/download?session-guid=${sessionId}`, '_blank')
  }, [])

  const getDownloadHandler = useCallback((guid: string) => (e?: MouseEvent) => {
    if (e) { e.preventDefault(); e.stopPropagation() }
    handleDownload(guid)
  }, [handleDownload])

  const getFileFavoriteHandler = useCallback((file: FileData, overrideValue?: boolean) => (e?: MouseEvent) => {
    if (e) { e.preventDefault(); e.stopPropagation() }
    toggleFavFile.mutate({ guid: file.guid, is_favorite: overrideValue !== undefined ? overrideValue : !file.is_favorite })
  }, [toggleFavFile])

  const getFileDeleteHandler = useCallback((file: FileData, currentFolderGuid?: string | 'root' | null) => (e?: MouseEvent) => {
    if (e) { e.preventDefault(); e.stopPropagation() }
    deleteFile.mutate({ guid: file.guid, folder_id: currentFolderGuid === 'root' ? null : (currentFolderGuid || null) })
  }, [deleteFile])

  const getFileRestoreHandler = useCallback((file: FileData) => (e?: MouseEvent) => {
    if (e) { e.preventDefault(); e.stopPropagation() }
    restoreFile.mutate({ guid: file.guid })
  }, [restoreFile])

  const getFilePermanentDeleteHandler = useCallback((file: FileData) => (e?: MouseEvent) => {
    if (e) { e.preventDefault(); e.stopPropagation() }
    permanentDeleteFile.mutate({ guid: file.guid })
  }, [permanentDeleteFile])

  const getFileRenameHandler = useCallback((file: FileData) => (newName: string) => {
    renameFile.mutate({ guid: file.guid, name: newName })
  }, [renameFile])

  return {
    handleDownload,
    getDownloadHandler,
    getFileFavoriteHandler,
    getFileDeleteHandler,
    getFileRestoreHandler,
    getFilePermanentDeleteHandler,
    getFileRenameHandler,
  }
}
