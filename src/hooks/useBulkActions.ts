import { useCallback } from "react"
import { useDeleteFile, useDeleteFolder, usePermanentDeleteFile } from "@/lib/queries"
import { useQueryClient } from "@tanstack/react-query"
import type { FolderData, FileData } from "@/lib/api"
import { toast } from "sonner"

export const useBulkActions = () => {
  const deleteFile = useDeleteFile()
  const deleteFolder = useDeleteFolder()
  const permanentDeleteFile = usePermanentDeleteFile()
  const queryClient = useQueryClient()

  const handleBulkDelete = useCallback(async (items: (FolderData | FileData)[]) => {
    const toastId = toast.loading(`Deleting ${items.length} items...`)
    try {
      await Promise.all(items.map(item =>
        'size' in item
          ? deleteFile.mutateAsync({ guid: item.guid, folder_id: null })
          : deleteFolder.mutateAsync({ guid: item.guid, parent_id: null })
      ))
      toast.success(`${items.length} items moved to trash`, { id: toastId })
      queryClient.invalidateQueries({ queryKey: ['folder'] })
      queryClient.invalidateQueries({ queryKey: ['search'] })
      queryClient.invalidateQueries({ queryKey: ['trash'] })
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    } catch (error) {
      console.error("Bulk delete error:", error)
      toast.error("Failed to delete some items", { id: toastId })
    }
  }, [deleteFile, deleteFolder, queryClient])

  const handleBulkPermanentDelete = useCallback(async (items: FileData[]) => {
    const toastId = toast.loading(`Permanently deleting ${items.length} items...`)
    try {
      await Promise.all(items.map(item => permanentDeleteFile.mutateAsync({ guid: item.guid })))
      toast.success(`${items.length} items permanently deleted`, { id: toastId })
      queryClient.invalidateQueries({ queryKey: ['trash'] })
    } catch (error) {
      console.error("Bulk permanent delete error:", error)
      toast.error("Failed to permanently delete some items", { id: toastId })
    }
  }, [permanentDeleteFile, queryClient])

  return { handleBulkDelete, handleBulkPermanentDelete }
}
