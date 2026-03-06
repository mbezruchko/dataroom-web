import { useState, useMemo, useEffect } from "react"
import { useParams, useLocation } from "react-router-dom"
import axios from "axios"
import { Loader2, Search } from "lucide-react"
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
import { SmartSearch } from "@/components/ui/SmartSearch"

export const FileExplorer = () => {
  const { workspaceGuid, folderGuid: folderGuidParam } = useParams<{ workspaceGuid: string, folderGuid?: string }>();
  const folderGuid = folderGuidParam || 'root';
  const location = useLocation();

  const { data: folder, isLoading, isError, error } = useFolder(folderGuid, workspaceGuid);
  const isNotFound = folderGuid !== 'root' && isError && axios.isAxiosError(error) && error.response?.status === 404;
  const renameFolder = useRenameFolder();

  const { sortField, sortOrder, resourceFilter, localSearch, setLocalSearch } = useAppStore();
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);

  useEffect(() => {
    setLocalSearch("");
  }, [location.pathname, setLocalSearch]);

  const handleRenameConfirm = (newName: string) => {
    if (folderGuid !== 'root' && newName && newName !== folder?.name) {
      renameFolder.mutate({ guid: folderGuid, name: newName });
    }
    setRenameDialogOpen(false);
  };


  const combinedItems = useMemo(() => {
    const folders = folder?.subfolders || [];
    const files = folder?.files || [];

    let all: (FolderData | FileData)[] = [...folders, ...files];

    if (localSearch) {
      all = all.filter(item => item.name.toLowerCase().includes(localSearch.toLowerCase()));
    }

    if (resourceFilter === 'folders') {
      all = all.filter(item => !('size' in item));
    } else if (resourceFilter === 'files') {
      all = all.filter(item => 'size' in item);
    }

    return sortResources(all, sortField, sortOrder);
  }, [folder?.subfolders, folder?.files, localSearch, resourceFilter, sortField, sortOrder]);

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
          <CreateFolderDialog parentId={folderGuid === 'root' ? null : folderGuid} />
          <UploadFileDialog folderId={folderGuid === 'root' ? null : folderGuid} />
        </div>

        <div className="flex items-center gap-4 flex-1 justify-end">
          <SmartSearch />
          <div className="flex items-center gap-2 shrink-0">
            <ResourceFilters />
            <ViewSwitcher />
          </div>
        </div>
      </div>

      <div className="mt-6 flex-1 overflow-auto">
        {combinedItems.length > 0 ? (
          <ResourceSection>
            {combinedItems.map((item) => {
              if ('size' in item) {
                return (
                  <FileCard
                    key={item.guid}
                    file={item}
                    contextFolderGuid={folderGuid}
                  />
                );
              }
              return (
                <FolderCard
                  key={item.guid}
                  folder={item}
                  contextFolderGuid={folderGuid}
                />
              );
            })}
          </ResourceSection>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground w-full h-full">
            <Search className="size-12 mb-4 opacity-20" />
            <p className="text-lg font-medium">{localSearch ? "No matches found" : "This folder is empty"}</p>
            <p className="text-sm">
              {localSearch
                ? `We couldn't find anything matching "${localSearch}"`
                : "Upload files or create folders to get started."}
            </p>
          </div>
        )}
      </div>

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