import axios from "axios"
import { useState, useMemo, useEffect } from "react"
import { useParams, useLocation } from "react-router-dom"
import { Loader2, Search } from "lucide-react"
import type { FolderData, FileData } from "@/lib/api"
import { useFolder, useRenameFolder } from "@/lib/queries"
import { sortResources } from "@/lib/sorting"
import { useAppStore } from "@/store/useAppStore"
import { useBulkActions } from "@/hooks/useBulkActions"
import { usePagination } from "@/hooks/usePagination"
import { NotFound } from "./NotFound"
import {
  CreateFolderDialog, UploadFileDialog, RenameDialog,
  ResourceSection, SearchToolbar,
  BulkActionToolbar, FolderCard, FileCard, Pagination,
} from "@/components/ui"

export const FileExplorer = () => {
  const { workspaceGuid, folderGuid: folderGuidParam } = useParams<{ workspaceGuid: string, folderGuid?: string }>();
  const folderGuid = folderGuidParam || 'root';
  const location = useLocation();

  const { data: folder, isLoading, isError, error } = useFolder(folderGuid, workspaceGuid);
  const isNotFound = folderGuid !== 'root' && isError && axios.isAxiosError(error) && error.response?.status === 404;
  const renameFolder = useRenameFolder();

  const {
    sortField, sortOrder, resourceFilter, localSearch, setLocalSearch,
    selectedResources, toggleResourceSelection, clearResourceSelection
  } = useAppStore();
  const { handleBulkDelete } = useBulkActions();
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  useEffect(() => {
    setLocalSearch("");
    clearResourceSelection();
  }, [location.pathname, setLocalSearch, clearResourceSelection]);

  const handleRenameConfirm = (newName: string) => {
    if (folderGuid !== 'root' && newName && newName !== folder?.name) {
      renameFolder.mutate({ guid: folderGuid, name: newName });
    }
    setRenameDialogOpen(false);
  };

  const handleBulkDeleteAction = async () => {
    const itemsToDelete = combinedItems.filter(item => selectedResources.includes(item.guid));
    if (itemsToDelete.length === 0) return;

    setIsBulkDeleting(true);
    await handleBulkDelete(itemsToDelete);
    setIsBulkDeleting(false);
    clearResourceSelection();
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

  const { paginatedItems, currentPage, totalPages, goToPage } = usePagination(combinedItems);

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

  const isAllSelected = paginatedItems.length > 0 && paginatedItems.every(item => selectedResources.includes(item.guid));

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      paginatedItems.forEach(item => {
        if (!selectedResources.includes(item.guid)) {
          toggleResourceSelection(item.guid);
        }
      });
    } else {
      clearResourceSelection();
    }
  };

  return (
    <div className="flex h-full flex-col p-4 sm:p-6 space-y-4 relative">
      <div className="flex max-lg:flex-col justify-between gap-3 mb-2">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight truncate">
            {<span className="mr-4">{folder?.name || 'Storage'}</span>}
          </h2>
          <div className="flex items-center gap-2">
            <CreateFolderDialog parentId={folderGuid === 'root' ? null : folderGuid} />
            <UploadFileDialog folderId={folderGuid === 'root' ? null : folderGuid} />
          </div>
        </div>

        <SearchToolbar />
      </div>

      <div className="mt-6 flex flex-col justify-between flex-1 overflow-auto">
        {combinedItems.length > 0 ? (
          <>
            <ResourceSection
              onSelectAll={handleSelectAll}
              isAllSelected={isAllSelected}
            >
              {paginatedItems.map((item) => {
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
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
          </>
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

      <BulkActionToolbar
        onDelete={handleBulkDeleteAction}
        isDeleting={isBulkDeleting}
      />

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
