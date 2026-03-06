import React, { useCallback, useMemo } from "react"
import {
  useToggleFavoriteFolder,
  useToggleFavoriteFile,
  useDeleteFolder,
  useDeleteFile,
  useRenameFile,
  useRenameFolder,
  useRestoreFile,
  usePermanentDeleteFile
} from "@/lib/queries"
import { useQueryClient } from "@tanstack/react-query"
import type { FolderData, FileData } from "@/lib/api"
import { toast } from "sonner"


import { ensureSessionId } from "@/lib/cookies"

export const useResourceActions = () => {
  const toggleFavFolder = useToggleFavoriteFolder();
  const toggleFavFile = useToggleFavoriteFile();
  const deleteFolder = useDeleteFolder();
  const deleteFile = useDeleteFile();
  const renameFile = useRenameFile();
  const renameFolder = useRenameFolder();
  const restoreFile = useRestoreFile();
  const permanentDeleteFile = usePermanentDeleteFile();
  const queryClient = useQueryClient();

  const handleDownload = useCallback((guid: string) => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? '/api/v1';
    const sessionId = ensureSessionId();
    window.open(`${baseUrl}/files/${guid}/download?session-guid=${sessionId}`, '_blank');
  }, []);

  const getFolderFavoriteHandler = useCallback((folder: FolderData, overrideValue?: boolean) => (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    toggleFavFolder.mutate({
      guid: folder.guid,
      is_favorite: overrideValue !== undefined ? overrideValue : !folder.is_favorite
    });
  }, [toggleFavFolder]);

  const getFileFavoriteHandler = useCallback((file: FileData, overrideValue?: boolean) => (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    toggleFavFile.mutate({
      guid: file.guid,
      is_favorite: overrideValue !== undefined ? overrideValue : !file.is_favorite
    });
  }, [toggleFavFile]);

  const getFolderDeleteHandler = useCallback((folder: FolderData, parentGuid?: string | 'root' | null) => (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    deleteFolder.mutate({ guid: folder.guid, parent_id: parentGuid === 'root' ? null : parentGuid });
  }, [deleteFolder]);

  const getFileDeleteHandler = useCallback((file: FileData, currentFolderGuid?: string | 'root' | null) => (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    deleteFile.mutate({ guid: file.guid, folder_id: currentFolderGuid === 'root' ? null : (currentFolderGuid || null) });
  }, [deleteFile]);

  const getFileRestoreHandler = useCallback((file: FileData) => (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    restoreFile.mutate({ guid: file.guid });
  }, [restoreFile]);

  const getFilePermanentDeleteHandler = useCallback((file: FileData) => (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    permanentDeleteFile.mutate({ guid: file.guid });
  }, [permanentDeleteFile]);

  const getDownloadHandler = useCallback((guid: string) => (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    handleDownload(guid);
  }, [handleDownload]);

  const getFileRenameHandler = useCallback((file: FileData) => (newName: string) => {
    renameFile.mutate({ guid: file.guid, name: newName });
  }, [renameFile]);

  const getFolderRenameHandler = useCallback((folder: FolderData) => (newName: string) => {
    renameFolder.mutate({ guid: folder.guid, name: newName });
  }, [renameFolder]);

  const handleBulkDelete = useCallback(async (items: (FolderData | FileData)[]) => {
    const toastId = toast.loading(`Deleting ${items.length} items...`);

    try {
      const promises = items.map(item => {
        if ('size' in item) {
          return deleteFile.mutateAsync({ guid: item.guid, folder_id: null });
        } else {
          return deleteFolder.mutateAsync({ guid: item.guid, parent_id: null });
        }
      });

      await Promise.all(promises);
      toast.success(`${items.length} items moved to trash`, { id: toastId });
      queryClient.invalidateQueries({ queryKey: ['folder'] });
      queryClient.invalidateQueries({ queryKey: ['search'] });
      queryClient.invalidateQueries({ queryKey: ['trash'] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    } catch (error) {
      toast.error("Failed to delete some items", { id: toastId });
    }
  }, [deleteFile, deleteFolder, queryClient]);

  const handleBulkPermanentDelete = useCallback(async (items: FileData[]) => {
    const toastId = toast.loading(`Permanently deleting ${items.length} items...`);

    try {
      const promises = items.map(item => permanentDeleteFile.mutateAsync({ guid: item.guid }));
      await Promise.all(promises);
      toast.success(`${items.length} items permanently deleted`, { id: toastId });
      queryClient.invalidateQueries({ queryKey: ['trash'] });
    } catch (error) {
      toast.error("Failed to permanently delete some items", { id: toastId });
    }
  }, [permanentDeleteFile, queryClient]);

  return useMemo(() => ({
    handleDownload,
    getDownloadHandler,
    getFolderFavoriteHandler,
    getFileFavoriteHandler,
    getFolderDeleteHandler,
    getFileDeleteHandler,
    getFileRestoreHandler,
    getFilePermanentDeleteHandler,
    getFileRenameHandler,
    getFolderRenameHandler,
    handleBulkDelete,
    handleBulkPermanentDelete
  }), [
    handleDownload,
    getDownloadHandler,
    getFolderFavoriteHandler,
    getFileFavoriteHandler,
    getFolderDeleteHandler,
    getFileDeleteHandler,
    getFileRestoreHandler,
    getFilePermanentDeleteHandler,
    getFileRenameHandler,
    getFolderRenameHandler,
    handleBulkDelete,
    handleBulkPermanentDelete
  ]);
};