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
import type { FolderData, FileData } from "@/lib/api"
import React from "react"

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

  const handleDownload = (guid: string) => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? '/api/v1';
    const sessionId = ensureSessionId();
    window.open(`${baseUrl}/files/${guid}/download?session-guid=${sessionId}`, '_blank');
  };

  const getFolderFavoriteHandler = (folder: FolderData, overrideValue?: boolean) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavFolder.mutate({
      guid: folder.guid,
      is_favorite: overrideValue !== undefined ? overrideValue : !folder.is_favorite
    });
  };

  const getFileFavoriteHandler = (file: FileData, overrideValue?: boolean) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavFile.mutate({
      guid: file.guid,
      is_favorite: overrideValue !== undefined ? overrideValue : !file.is_favorite
    });
  };

  const getFolderDeleteHandler = (folder: FolderData, parentGuid?: string | 'root' | null) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    deleteFolder.mutate({ guid: folder.guid, parent_id: parentGuid === 'root' ? null : parentGuid });
  };

  const getFileDeleteHandler = (file: FileData, currentFolderGuid?: string | 'root' | null) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    deleteFile.mutate({ guid: file.guid, folder_id: currentFolderGuid === 'root' ? null : (currentFolderGuid || null) });
  };

  const getFileRestoreHandler = (file: FileData) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    restoreFile.mutate({ guid: file.guid });
  };

  const getFilePermanentDeleteHandler = (file: FileData) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    permanentDeleteFile.mutate({ guid: file.guid });
  };

  const getDownloadHandler = (guid: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleDownload(guid);
  };

  const getFileRenameHandler = (file: FileData) => (newName: string) => {
    renameFile.mutate({ guid: file.guid, name: newName });
  };

  const getFolderRenameHandler = (folder: FolderData) => (newName: string) => {
    renameFolder.mutate({ guid: folder.guid, name: newName });
  };

  return {
    handleDownload,
    getDownloadHandler,
    getFolderFavoriteHandler,
    getFileFavoriteHandler,
    getFolderDeleteHandler,
    getFileDeleteHandler,
    getFileRestoreHandler,
    getFilePermanentDeleteHandler,
    getFileRenameHandler,
    getFolderRenameHandler
  };
};