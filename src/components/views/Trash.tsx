import { useState, useMemo, useEffect } from "react"
import { Loader2, Trash2, Search } from "lucide-react"
import { useParams, useLocation } from "react-router-dom"
import type { FileData } from "@/lib/api"
import { useTrash, useEmptyTrash } from "@/lib/queries/search"
import { sortResources } from "@/lib/sorting"
import { useAppStore } from "@/store/useAppStore"
import { useBulkActions } from "@/hooks/useBulkActions"
import { usePagination } from "@/hooks/usePagination"
import {
  Button, DeleteConfirmationDialog, ResourceSection,
  SearchToolbar, BulkActionToolbar, FileCard, Pagination,
} from "@/components/ui"

export const Trash = () => {
  const { workspaceGuid } = useParams<{ workspaceGuid: string }>();
  const { data, isLoading } = useTrash(workspaceGuid);
  const location = useLocation();
  const emptyTrash = useEmptyTrash();
  const [showConfirm, setShowConfirm] = useState(false);
  const {
    sortField, sortOrder, resourceFilter, localSearch, setLocalSearch,
    selectedResources, toggleResourceSelection, clearResourceSelection
  } = useAppStore();
  const { handleBulkPermanentDelete } = useBulkActions();
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  useEffect(() => {
    setLocalSearch("");
    clearResourceSelection();
  }, [location.pathname, setLocalSearch, clearResourceSelection]);

  const combinedItems = useMemo(() => {
    const files = data?.files || [];

    let all: FileData[] = [...files];

    if (localSearch) {
      all = all.filter(item => item.name.toLowerCase().includes(localSearch.toLowerCase()));
    }

    if (resourceFilter === 'folders') {
      return [];
    }

    return sortResources(all, sortField, sortOrder);
  }, [data?.files, localSearch, resourceFilter, sortField, sortOrder]);

  const { paginatedItems, currentPage, totalPages, goToPage } = usePagination(combinedItems);

  const handleBulkDeleteAction = async () => {
    const itemsToDelete = combinedItems.filter(item => selectedResources.includes(item.guid));
    if (itemsToDelete.length === 0) return;

    setIsBulkDeleting(true);
    await handleBulkPermanentDelete(itemsToDelete);
    setIsBulkDeleting(false);
    clearResourceSelection();
  };

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

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const hasPhysicalContent = data?.files && data.files.length > 0;

  const handleEmptyTrash = () => {
    if (workspaceGuid) {
      emptyTrash.mutate(workspaceGuid, {
        onSuccess: () => setShowConfirm(false)
      });
    }
  };

  return (
    <div className="flex h-full flex-col p-6 space-y-4">
      <div className="flex flex-col justify-between mb-2 gap-2">
        <div className="flex max-lg:justify-between gap-2">
          <h2 className="text-2xl font-bold tracking-tight mr-4">Trash</h2>
          {hasPhysicalContent && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowConfirm(true)}
              disabled={emptyTrash.isPending}
              className="cursor-pointer"
            >
              {emptyTrash.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Empty Trash
            </Button>
            )}
        </div>
        <SearchToolbar>
        </SearchToolbar>
      </div>

      <div className="mt-6 flex flex-col justify-between flex-1 overflow-auto">
        {!hasPhysicalContent ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground w-full h-full">
            <p className="text-lg font-medium">Trash is empty</p>
            <p className="text-sm">Deleted files will appear here.</p>
          </div>
        ) : combinedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground w-full h-full">
            <Search className="size-12 mb-4 opacity-20" />
            <p className="text-lg font-medium">No matches found in trash</p>
            <p className="text-sm">We couldn't find anything matching "{localSearch}" in your deleted files</p>
          </div>
        ) : (
          <>
            <ResourceSection
              onSelectAll={handleSelectAll}
              isAllSelected={isAllSelected}
            >
              {paginatedItems.map((file: FileData) => (
                <FileCard key={file.guid} file={file} isTrash={true} />
              ))}
            </ResourceSection>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
          </>
        )}

        <BulkActionToolbar
          onDelete={handleBulkDeleteAction}
          isDeleting={isBulkDeleting}
        />
      </div>

      <DeleteConfirmationDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        onConfirm={handleEmptyTrash}
        title="Empty Trash?"
        description="This will permanently delete all files in the trash. This action cannot be undone."
      />
    </div>
  );
};
