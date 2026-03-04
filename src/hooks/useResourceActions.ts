import { useToggleFavoriteFolder, useToggleFavoriteFile, useDeleteFolder, useDeleteFile, useRenameFile } from "@/lib/queries"
import type { FolderData, FileData } from "@/lib/api"
import React from "react"

export const useResourceActions = () => {
  const toggleFavFolder = useToggleFavoriteFolder();
  const toggleFavFile = useToggleFavoriteFile();
  const deleteFolder = useDeleteFolder();
  const deleteFile = useDeleteFile();
  const renameFile = useRenameFile();

  const handleDownload = (guid: string) => {
    window.open(`/api/v1/files/${guid}/download`, '_blank');
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
    if (window.confirm(`Delete folder "${folder.name}"?`)) {
      deleteFolder.mutate({ guid: folder.guid, parent_id: parentGuid === 'root' ? null : parentGuid });
    }
  };

  const getFileDeleteHandler = (file: FileData, currentFolderGuid?: string | 'root' | null) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Delete file "${file.name}"?`)) {
      deleteFile.mutate({ guid: file.guid, folder_id: currentFolderGuid === 'root' ? null : (currentFolderGuid || null) });
    }
  };
  const getDownloadHandler = (guid: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleDownload(guid);
  };

  const getFileRenameHandler = (file: FileData) => (newName: string) => {
    renameFile.mutate({ guid: file.guid, name: newName });
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