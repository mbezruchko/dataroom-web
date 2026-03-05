import { useLocation, useParams } from "react-router-dom"
import { Loader2, Search } from "lucide-react"
import { useMemo } from "react"
import { useSearch } from "@/lib/queries"
import type { FolderData, FileData } from "@/lib/api"
import { FolderCard } from "@/components/ui/FolderCard"
import { FileCard } from "@/components/ui/FileCard"
import { ResourceSection } from "@/components/ui/ResourceSection"
import { ViewSwitcher } from "@/components/ui/ViewSwitcher"
import { ResourceFilters } from "@/components/ui/ResourceFilters"
import { useAppStore } from "@/store/useAppStore"
import { sortResources } from "@/lib/sorting"

export const SearchResults = () => {
  const { workspaceGuid } = useParams<{ workspaceGuid: string }>();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('q') || "";

  const { data, isLoading } = useSearch(query, workspaceGuid);
  const { sortField, sortOrder, resourceFilter, viewMode } = useAppStore();

  const sortedFolders = useMemo(() => {
    if (!data?.folders || resourceFilter === 'files') return [];
    return sortResources(data.folders, sortField, sortOrder);
  }, [data?.folders, sortField, sortOrder, resourceFilter]);

  const sortedFiles = useMemo(() => {
    if (!data?.files || resourceFilter === 'folders') return [];
    return sortResources(data.files, sortField, sortOrder);
  }, [data?.files, sortField, sortOrder, resourceFilter]);

  const sortedDeletedFiles = useMemo(() => {
    if (!data?.deleted_files || resourceFilter === 'folders') return [];
    return sortResources(data.deleted_files, sortField, sortOrder);
  }, [data?.deleted_files, sortField, sortOrder, resourceFilter]);

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

  const hasResults =
    (data?.folders?.length || 0) > 0 ||
    (data?.files?.length || 0) > 0 ||
    (data?.deleted_files?.length || 0) > 0;

  return (
    <div className="flex h-full flex-col p-6 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold tracking-tight">
          Search results for "{query}"
        </h2>
        <div className="flex items-center gap-2">
          <ResourceFilters />
          <ViewSwitcher />
        </div>
      </div>

      <div className="space-y-8 mt-6 h-full overflow-auto">
        {!hasResults ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground w-full h-full">
            <Search className="h-12 w-12 mb-4 text-muted/30" />
            <p className="text-lg font-medium">No results found</p>
            <p className="text-sm">Try searching for something else.</p>
          </div>
        ) : viewMode === 'list' ? (
          <ResourceSection title="All results">
            {sortedFolders.map((sub: FolderData) => (
              <FolderCard
                key={sub.guid}
                folder={sub}
                contextFolderGuid={null}
              />
            ))}
            {sortedFiles.map((file: FileData) => (
              <FileCard
                key={file.guid}
                file={file}
                contextFolderGuid={null}
              />
            ))}
            {sortedDeletedFiles.map((file: FileData) => (
              <FileCard
                key={file.guid}
                file={file}
                contextFolderGuid={null}
                isTrash={true}
              />
            ))}
          </ResourceSection>
        ) : (
          <>
            {sortedFolders.length > 0 && (
              <ResourceSection title="Folders">
                {sortedFolders.map((sub: FolderData) => (
                  <FolderCard
                    key={sub.guid}
                    folder={sub}
                    contextFolderGuid={null}
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
                    contextFolderGuid={null}
                  />
                ))}
              </ResourceSection>
            )}

            {sortedDeletedFiles.length > 0 && (
              <ResourceSection title="Deleted files">
                {sortedDeletedFiles.map((file: FileData) => (
                  <FileCard
                    key={file.guid}
                    file={file}
                    contextFolderGuid={null}
                    isTrash={true}
                  />
                ))}
              </ResourceSection>
            )}
          </>
        )}
      </div>
    </div>
  );
};