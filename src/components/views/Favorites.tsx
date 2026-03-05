import { Loader2 } from "lucide-react"
import { useFavorites } from "@/lib/queries"
import { useParams } from "react-router-dom"
import { useMemo } from "react"
import type { FolderData, FileData } from "@/lib/api"
import { FolderCard } from "@/components/ui/FolderCard"
import { FileCard } from "@/components/ui/FileCard"
import { ResourceSection } from "@/components/ui/ResourceSection"
import { ViewSwitcher } from "@/components/ui/ViewSwitcher"
import { ResourceFilters } from "@/components/ui/ResourceFilters"
import { useAppStore } from "@/store/useAppStore"
import { sortResources } from "@/lib/sorting"

export const Favorites = () => {
  const { workspaceGuid } = useParams<{ workspaceGuid: string }>();
  const { data, isLoading } = useFavorites(workspaceGuid);
  const { sortField, sortOrder, resourceFilter, viewMode } = useAppStore();

  const sortedFolders = useMemo(() => {
    if (!data?.folders || resourceFilter === 'files') return [];
    return sortResources(data.folders, sortField, sortOrder);
  }, [data?.folders, sortField, sortOrder, resourceFilter]);

  const sortedFiles = useMemo(() => {
    if (!data?.files || resourceFilter === 'folders') return [];
    return sortResources(data.files, sortField, sortOrder);
  }, [data?.files, sortField, sortOrder, resourceFilter]);

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
        <div className="flex items-center gap-2">
          <ResourceFilters />
          <ViewSwitcher />
        </div>
      </div>

      <div className="space-y-8 mt-6 h-full">
        {viewMode === 'list' ? (
          (sortedFolders.length > 0 || sortedFiles.length > 0) && (
            <ResourceSection title="All favorites">
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
            </ResourceSection>
          )
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
          </>
        )}
        {(!data?.folders?.length && !data?.files?.length) && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground w-full h-full">
            <p className="text-lg font-medium">No favorites yet</p>
            <p className="text-sm">Click the star icon to save items for later.</p>
          </div>
        )}
      </div>
    </div>
  );
};