import { Loader2, Search } from "lucide-react"
import { useFavorites } from "@/lib/queries"
import { useParams, useLocation } from "react-router-dom"
import { useMemo, useEffect } from "react"
import type { FolderData, FileData } from "@/lib/api"
import { FolderCard } from "@/components/ui/FolderCard"
import { FileCard } from "@/components/ui/FileCard"
import { ResourceSection } from "@/components/ui/ResourceSection"
import { ViewSwitcher } from "@/components/ui/ViewSwitcher"
import { ResourceFilters } from "@/components/ui/ResourceFilters"
import { useAppStore } from "@/store/useAppStore"
import { sortResources } from "@/lib/sorting"
import { SmartSearch } from "@/components/ui/SmartSearch"

export const Favorites = () => {
  const { workspaceGuid } = useParams<{ workspaceGuid: string }>();
  const { data, isLoading } = useFavorites(workspaceGuid);
  const location = useLocation();
  const { sortField, sortOrder, resourceFilter, localSearch, setLocalSearch } = useAppStore();

  useEffect(() => {
    setLocalSearch("");
  }, [location.pathname, setLocalSearch]);

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

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col p-6 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold tracking-tight">Favorites</h2>
        <div className="flex items-center gap-4 flex-1 justify-end">
          <SmartSearch />
          <div className="flex items-center gap-2 shrink-0">
            <ResourceFilters />
            <ViewSwitcher />
          </div>
        </div>
      </div>

      <div className="space-y-8 mt-6 h-full flex-1 overflow-auto">
        {combinedItems.length > 0 ? (
          <ResourceSection>
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
            <p className="text-lg font-medium">{localSearch ? "No matches found" : "No favorites yet"}</p>
            <p className="text-sm">
              {localSearch
                ? `We couldn't find anything matching "${localSearch}" in your favorites`
                : "Click the star icon to save items for later."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};