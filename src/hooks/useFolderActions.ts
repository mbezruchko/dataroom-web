import { useCallback } from "react"
import type { MouseEvent } from "react"
import {
  useToggleFavoriteFolder,
  useDeleteFolder,
  useRenameFolder,
} from "@/lib/queries"
import type { FolderData } from "@/lib/api"

export const useFolderActions = () => {
  const toggleFavFolder = useToggleFavoriteFolder()
  const deleteFolder = useDeleteFolder()
  const renameFolder = useRenameFolder()

  const getFolderFavoriteHandler = useCallback((folder: FolderData, overrideValue?: boolean) => (e?: MouseEvent) => {
    if (e) { e.preventDefault(); e.stopPropagation() }
    toggleFavFolder.mutate({ guid: folder.guid, is_favorite: overrideValue !== undefined ? overrideValue : !folder.is_favorite })
  }, [toggleFavFolder])

  const getFolderDeleteHandler = useCallback((folder: FolderData, parentGuid?: string | 'root' | null) => (e?: MouseEvent) => {
    if (e) { e.preventDefault(); e.stopPropagation() }
    deleteFolder.mutate({ guid: folder.guid, parent_id: parentGuid === 'root' ? null : parentGuid })
  }, [deleteFolder])

  const getFolderRenameHandler = useCallback((folder: FolderData) => (newName: string) => {
    renameFolder.mutate({ guid: folder.guid, name: newName })
  }, [renameFolder])

  return {
    getFolderFavoriteHandler,
    getFolderDeleteHandler,
    getFolderRenameHandler,
  }
}
