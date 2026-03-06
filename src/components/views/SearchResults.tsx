import { useLocation, useParams } from "react-router-dom"
import { Loader2, Search } from "lucide-react"
import { useMemo, useEffect } from "react"
import { useSearch } from "@/lib/queries"
import type { FolderData, FileData } from "@/lib/api"
import { FolderCard } from "@/components/ui/FolderCard"
import { FileCard } from "@/components/ui/FileCard"
import { ResourceSection } from "@/components/ui/ResourceSection"
import { ViewSwitcher } from "@/components/ui/ViewSwitcher"
import { ResourceFilters } from "@/components/ui/ResourceFilters"
import { useAppStore } from "@/store/useAppStore"
import { sortResources } from "@/lib/sorting"
import { SmartSearch } from "../ui/SmartSearch"

export const SearchResults = () => {
  const { workspaceGuid } = useParams<{ workspaceGuid: string }>();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('q') || "";
  const folderId = queryParams.get('f') || undefined;

  const { data, isLoading } = useSearch(query, workspaceGuid, folderId);
  const { sortField, sortOrder, resourceFilter, localSearch, setLocalSearch } = useAppStore();

  useEffect(() => {
    setLocalSearch("");
  }, [location.pathname, location.search, setLocalSearch]);

  const combinedItems = useMemo(() => {
    const folders = data?.folders || [];
    const files = data?.files || [];
    const deletedFiles = data?.deleted_files || [];

    let all: (FolderData | FileData)[] = [...folders, ...files, ...deletedFiles];

    if (localSearch) {
      all = all.filter(item => item.name.toLowerCase().includes(localSearch.toLowerCase()));
    }

    if (resourceFilter === 'folders') {
      all = all.filter(item => !('size' in item));
    } else if (resourceFilter === 'files') {
      all = all.filter(item => 'size' in item);
    }

    return sortResources(all, sortField, sortOrder);
  }, [data?.folders, data?.files, data?.deleted_files, localSearch, resourceFilter, sortField, sortOrder]);

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

  const hasPhysicalResults =
    (data?.folders?.length || 0) > 0 ||
    (data?.files?.length || 0) > 0 ||
    (data?.deleted_files?.length || 0) > 0;

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

      <div className="mt-6 flex-1 overflow-auto">
        {!hasPhysicalResults ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground w-full h-full">
            <Search className="h-12 w-12 mb-4 text-muted/30" />
            <p className="text-lg font-medium">No results found</p>
            <p className="text-sm">Try searching for something else.</p>
          </div>
        ) : combinedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground w-full h-full">
            <Search className="h-12 w-12 mb-4 text-muted/30" />
            <p className="text-lg font-medium">No matches in results</p>
            <p className="text-sm">We couldn't find anything matching "{localSearch}" among the search results.</p>
          </div>
        ) : (
          <ResourceSection>
            {combinedItems.map((item) => {
              const isDeleted = data?.deleted_files?.some(df => df.guid === item.guid);
              if ('size' in item) {
                return (
                  <FileCard
                    key={item.guid}
                    file={item}
                    contextFolderGuid={null}
                    isTrash={isDeleted}
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
        )}
      </div>
    </div>
  );
};