import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import axios from "axios"
import { Loader2, Pencil, Check, X } from "lucide-react"
import { useFolder, useRenameFolder } from "@/lib/queries"
import { NotFound } from "./NotFound"
import type { FolderData, FileData } from "@/lib/api"
import { CreateFolderDialog } from "@/components/ui/CreateFolderDialog"
import { UploadFileDialog } from "@/components/ui/UploadFileDialog"
import { FolderCard } from "@/components/ui/FolderCard"
import { FileCard } from "@/components/ui/FileCard"
import { ResourceSection } from "@/components/ui/ResourceSection"
import { useResourceActions } from "@/hooks/useResourceActions"

export const FileExplorer = () => {
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);
  const folderIdString = pathParts[0] === 'folder' ? pathParts[1] : 'root';
  const folderId = folderIdString === 'root' ? 'root' : parseInt(folderIdString, 10);

  const { data: folder, isLoading, isError, error } = useFolder(folderId);
  const isNotFound = folderId !== 'root' && isError && axios.isAxiosError(error) && error.response?.status === 404;
  const renameFolder = useRenameFolder();
  const {
    getFolderFavoriteHandler,
    getFileFavoriteHandler,
    getFolderDeleteHandler,
    getFileDeleteHandler,
    getDownloadHandler,
    getFileRenameHandler
  } = useResourceActions();

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState("");

  useEffect(() => {
    if (folder) {
      setTempName(folder.name);
    }
  }, [folder]);

  const handleRename = () => {
    if (folderId !== 'root' && tempName && tempName !== folder?.name) {
      renameFolder.mutate({ id: folderId as number, name: tempName });
    }
    setIsEditingName(false);
  };

  const sortedSubfolders = folder?.subfolders ? [...folder.subfolders].sort((a, b) => {
    if (a.is_favorite !== b.is_favorite) return a.is_favorite ? -1 : 1;
    return a.name.localeCompare(b.name);
  }) : [];

  const sortedFiles = folder?.files ? [...folder.files].sort((a, b) => {
    if (a.is_favorite !== b.is_favorite) return a.is_favorite ? -1 : 1;
    return a.name.localeCompare(b.name);
  }) : [];

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isNotFound) {
    return <NotFound />;
  }

  if (isError) {
    return (
      <div className="flex h-full flex-col items-center justify-center space-y-4">
        <h2 className="text-xl font-bold text-destructive">Error loading folder</h2>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col p-6 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 group">
          {isEditingName ? (
            <div className="flex items-center gap-1">
              <input
                autoFocus
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onBlur={handleRename}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRename();
                  if (e.key === 'Escape') {
                    setTempName(folder?.name || "");
                    setIsEditingName(false);
                  }
                }}
                className="text-2xl font-bold tracking-tight bg-background border-b-2 border-primary outline-none px-1"
              />
              <button
                onMouseDown={(e) => { e.preventDefault(); handleRename(); }}
                className="p-1 hover:bg-muted rounded-md text-green-500"
              >
                <Check className="size-5" />
              </button>
              <button
                onMouseDown={(e) => { e.preventDefault(); setIsEditingName(false); setTempName(folder?.name || ""); }}
                className="p-1 hover:bg-muted rounded-md text-destructive"
              >
                <X className="size-5" />
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold tracking-tight">
                {folder?.name || 'Storage'}
              </h2>
              {folderId !== 'root' && (
                <button
                  onClick={() => setIsEditingName(true)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-muted rounded-md transition-all text-muted-foreground"
                  title="Rename folder"
                >
                  <Pencil className="size-4" />
                </button>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <CreateFolderDialog parentId={folderId} />
          <UploadFileDialog folderId={folderId} />
        </div>
      </div>

      <div className="space-y-8 mt-6">
        {folder?.subfolders && folder.subfolders.length > 0 && (
          <ResourceSection title="Folders">
            {sortedSubfolders.map((sub: FolderData) => (
              <FolderCard
                key={sub.id}
                folder={sub}
                onFavoriteToggle={getFolderFavoriteHandler(sub)}
                onDelete={getFolderDeleteHandler(sub, folderId)}
              />
            ))}
          </ResourceSection>
        )}

        {folder?.files && folder.files.length > 0 && (
          <ResourceSection title="Files">
            {sortedFiles.map((file: FileData) => (
              <FileCard
                key={file.id}
                file={file}
                onDownload={getDownloadHandler(file.id)}
                onFavoriteToggle={getFileFavoriteHandler(file)}
                onDelete={getFileDeleteHandler(file, folderId)}
                onRename={getFileRenameHandler(file)}
              />
            ))}
          </ResourceSection>
        )}
      </div>

      {(!folder?.subfolders?.length && !folder?.files?.length) && (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground w-full">
          <p>This folder is empty.</p>
        </div>
      )}
    </div>
  )
}