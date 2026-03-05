import { useState, useMemo } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import { Loader2, Pencil } from "lucide-react"
import { useFolder, useRenameFolder } from "@/lib/queries"
import { NotFound } from "./NotFound"
import type { FolderData, FileData } from "@/lib/api"
import { CreateFolderDialog } from "@/components/ui/CreateFolderDialog"
import { UploadFileDialog } from "@/components/ui/UploadFileDialog"
import { FolderCard } from "@/components/ui/FolderCard"
import { FileCard } from "@/components/ui/FileCard"
import { ResourceSection } from "@/components/ui/ResourceSection"
import { ViewSwitcher } from "@/components/ui/ViewSwitcher"
import { ResourceFilters } from "@/components/ui/ResourceFilters"
import { RenameDialog } from "@/components/ui/RenameDialog"
import { useAppStore } from "@/store/useAppStore"
import { sortResources } from "@/lib/sorting"

export const FileExplorer = () => {
  const { workspaceGuid, folderGuid: folderGuidParam } = useParams<{ workspaceGuid: string, folderGuid?: string }>();
  const folderGuid = folderGuidParam || 'root';

  const { data: folder, isLoading, isError, error } = useFolder(folderGuid, workspaceGuid);
  const isNotFound = folderGuid !== 'root' && isError && axios.isAxiosError(error) && error.response?.status === 404;
  const renameFolder = useRenameFolder();

  const { sortField, sortOrder, resourceFilter, viewMode } = useAppStore();
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);

  const handleRenameConfirm = (newName: string) => {
    if (folderGuid !== 'root' && newName && newName !== folder?.name) {
      renameFolder.mutate({ guid: folderGuid, name: newName });
    }
    setRenameDialogOpen(false);
  };

  const sortedSubfolders = useMemo(() => {
    if (!folder?.subfolders || resourceFilter === 'files') return [];
    return sortResources(folder.subfolders, sortField, sortOrder);
  }, [folder?.subfolders, sortField, sortOrder, resourceFilter]);

  const sortedFiles = useMemo(() => {
    if (!folder?.files || resourceFilter === 'folders') return [];
    return sortResources(folder.files, sortField, sortOrder);
  }, [folder?.files, sortField, sortOrder, resourceFilter]);

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
          <h2 className="text-2xl font-bold tracking-tight">
            {<span className="mr-4">{folder?.name || 'Storage'}</span>}
          </h2>
          {/* {folderGuid !== 'root' && (
            <button
              onClick={() => setRenameDialogOpen(true)}
              className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-muted rounded-md transition-all text-muted-foreground cursor-pointer"
              title="Rename folder"
            >
              <Pencil className="size-4" />
            </button>
          )} */}
          <CreateFolderDialog parentId={folderGuid === 'root' ? null : folderGuid} />
          <UploadFileDialog folderId={folderGuid === 'root' ? null : folderGuid} />
        </div>

        <div className="flex items-center gap-2">
          <ResourceFilters />
          <ViewSwitcher />
        </div>
      </div>

      <div className="space-y-8 mt-6">
        {viewMode === 'list' ? (
          (sortedSubfolders.length > 0 || sortedFiles.length > 0) && (
            <ResourceSection title="All items">
              {sortedSubfolders.map((sub: FolderData) => (
                <FolderCard
                  key={sub.guid}
                  folder={sub}
                  contextFolderGuid={folderGuid}
                />
              ))}
              {sortedFiles.map((file: FileData) => (
                <FileCard
                  key={file.guid}
                  file={file}
                  contextFolderGuid={folderGuid}
                />
              ))}
            </ResourceSection>
          )
        ) : (
          <>
            {sortedSubfolders.length > 0 && (
              <ResourceSection title="Folders">
                {sortedSubfolders.map((sub: FolderData) => (
                  <FolderCard
                    key={sub.guid}
                    folder={sub}
                    contextFolderGuid={folderGuid}
                  />
                ))}
              </ResourceSection>
            )}

            {sortedFiles.length > 0 && (
              <ResourceSection title="Files">
                {sortedFiles.map((file: FileData) => (
                  <FileCard
                    key={file.guid}
                    file={file}
                    contextFolderGuid={folderGuid}
                  />
                ))}
              </ResourceSection>
            )}
          </>
        )}
      </div>

      {(!folder?.subfolders?.length && !folder?.files?.length) && (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground w-full h-full">
          <p className="text-lg font-medium">This folder is empty</p>
          <p className="text-sm">Upload files or create folders to get started.</p>
        </div>
      )}

      {folder && (
        <RenameDialog
          open={renameDialogOpen}
          onOpenChange={setRenameDialogOpen}
          onConfirm={handleRenameConfirm}
          title="Rename Folder"
          initialValue={folder.name}
          isPending={renameFolder.isPending}
        />
      )}
    </div>
  )
}