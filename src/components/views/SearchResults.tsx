import { useState, useMemo, useEffect } from "react"
import { useParams, useLocation } from "react-router-dom"
import { Search, Loader2 } from "lucide-react"
import { useSearch } from "@/lib/queries"
import type { FolderData, FileData } from "@/lib/api"
import { ResourceSection } from "@/components/ui/ResourceSection"
import { ViewSwitcher } from "@/components/ui/ViewSwitcher"
import { ResourceFilters } from "@/components/ui/ResourceFilters"
import { useAppStore } from "@/store/useAppStore"
import { sortResources } from "@/lib/sorting"
import { SmartSearch } from "@/components/ui/SmartSearch"
import { BulkActionToolbar } from "@/components/ui/BulkActionToolbar"
import { useResourceActions } from "@/hooks/useResourceActions"
import FolderCard from "@/components/ui/FolderCard"
import FileCard from "@/components/ui/FileCard"

export const SearchResults = () => {
  const { workspaceGuid } = useParams<{ workspaceGuid: string }>();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('q') || "";
  const folderId = queryParams.get('f') || undefined;

  const { data, isLoading } = useSearch(query, workspaceGuid, folderId);
  const {
    sortField, sortOrder, resourceFilter, localSearch, setLocalSearch,
    selectedResources, toggleResourceSelection, clearResourceSelection
  } = useAppStore();
  const { handleBulkDelete } = useResourceActions();
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  useEffect(() => {
    setLocalSearch("");
    clearResourceSelection();
  }, [location.pathname, setLocalSearch, clearResourceSelection]);

  const combinedItems = useMemo(() => {
    const folders = data?.folders || [];
    const files = data?.files || [];

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
  }, [data?.folders, data?.files, localSearch, resourceFilter, sortField, sortOrder]);

  const handleBulkDeleteAction = async () => {
    const itemsToDelete = combinedItems.filter(item => selectedResources.includes(item.guid));
    if (itemsToDelete.length === 0) return;

    setIsBulkDeleting(true);
    await handleBulkDelete(itemsToDelete);
    setIsBulkDeleting(false);
    clearResourceSelection();
  };

  const isAllSelected = combinedItems.length > 0 && combinedItems.every(item => selectedResources.includes(item.guid));

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      combinedItems.forEach(item => {
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

  if (!query) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center">
        <Search className="h-12 w-12 text-muted-foreground/20 mb-4" />
        <h2 className="text-xl font-semibold">Start searching</h2>
        <p className="text-muted-foreground max-w-sm mt-2">
          Enter a filename or folder name in the search bar above to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col p-6 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold tracking-tight">
          Search results for "{query}"
        </h2>
        <div className="flex items-center gap-4 flex-1 justify-end">
          <SmartSearch />
          <div className="flex items-center gap-2 shrink-0">
            <ResourceFilters />
            <ViewSwitcher />
          </div>
        </div>
      </div>

      <div className="mt-6 flex-1 overflow-auto relative">
        {combinedItems.length > 0 ? (
          <ResourceSection
            onSelectAll={handleSelectAll}
            isAllSelected={isAllSelected}
          >
            {combinedItems.map((item) => {
              if ('size' in item) {
                return (
                  <FileCard
                    key={item.guid}
                    file={item}
                    contextFolderGuid={null}
                  />
                );
              }
              return (
                <FolderCard
                  key={item.guid}
                  folder={item}
                  contextFolderGuid={null}
                />
              );
            })}
          </ResourceSection>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground w-full h-full">
            <Search className="size-12 mb-4 opacity-20" />
            <p className="text-lg font-medium">{localSearch ? "No matches found" : "No results found"}</p>
            <p className="text-sm">
              {localSearch
                ? `We couldn't find anything matching "${localSearch}"`
                : "Try a different search term or check your spelling."}
            </p>
          </div>
        )}

        <BulkActionToolbar
          onDelete={handleBulkDeleteAction}
          isDeleting={isBulkDeleting}
        />
      </div>
    </div>
  );
};
