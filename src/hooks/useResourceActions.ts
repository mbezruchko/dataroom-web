import { useToggleFavoriteFolder, useToggleFavoriteFile, useDeleteFolder, useDeleteFile, useRenameFile } from "@/lib/queries"
import type { FolderData, FileData } from "@/lib/api"
import React from "react"

export const useResourceActions = () => {
  const toggleFavFolder = useToggleFavoriteFolder();
  const toggleFavFile = useToggleFavoriteFile();
  const deleteFolder = useDeleteFolder();
  const deleteFile = useDeleteFile();
  const renameFile = useRenameFile();

  const handleDownload = (fileId: number) => {
    window.open(`/api/v1/files/${fileId}/download`, '_blank');
  };

  const getFolderFavoriteHandler = (folder: FolderData, overrideValue?: boolean) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavFolder.mutate({
      id: folder.id,
      is_favorite: overrideValue !== undefined ? overrideValue : !folder.is_favorite
    });
  };

  const getFileFavoriteHandler = (file: FileData, overrideValue?: boolean) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavFile.mutate({
      id: file.id,
      is_favorite: overrideValue !== undefined ? overrideValue : !file.is_favorite
    });
  };

  const getFolderDeleteHandler = (folder: FolderData, parentId?: number | 'root' | null) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Delete folder "${folder.name}"?`)) {
      deleteFolder.mutate({ id: folder.id, parent_id: parentId === 'root' ? null : parentId });
    }
  };

  const getFileDeleteHandler = (file: FileData, currentFolderId?: number | 'root' | null) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Delete file "${file.name}"?`)) {
      deleteFile.mutate({ id: file.id, folder_id: currentFolderId === 'root' ? null : (currentFolderId || null) });
    }
  };
  const getDownloadHandler = (fileId: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleDownload(fileId);
  };

  const getFileRenameHandler = (file: FileData) => (newName: string) => {
    renameFile.mutate({ id: file.id, name: newName });
  };

  return {
    handleDownload,
    getDownloadHandler,
    getFolderFavoriteHandler,
    getFileFavoriteHandler,
    getFolderDeleteHandler,
    getFileDeleteHandler,
    getFileRenameHandler
  };
};