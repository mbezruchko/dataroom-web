import { useLocation } from "react-router-dom"
import { Loader2, Search } from "lucide-react"
import { useSearch } from "@/lib/queries"
import type { FolderData, FileData } from "@/lib/api"
import { FolderCard } from "@/components/ui/FolderCard"
import { FileCard } from "@/components/ui/FileCard"
import { ResourceSection } from "@/components/ui/ResourceSection"
import { useResourceActions } from "@/hooks/useResourceActions"

export const SearchResults = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('q') || "";

  const { data, isLoading } = useSearch(query);
  const {
    getFolderFavoriteHandler,
    getFileFavoriteHandler,
    getFolderDeleteHandler,
    getFileDeleteHandler,
    getDownloadHandler,
    getFileRenameHandler
  } = useResourceActions();

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

  const hasResults = (data?.folders?.length || 0) > 0 || (data?.files?.length || 0) > 0;

  return (
    <div className="flex h-full flex-col p-6 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold tracking-tight">
          Search results for "{query}"
        </h2>
      </div>

      <div className="space-y-8 mt-6">
        {!hasResults ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground w-full">
            <Search className="h-12 w-12 mb-4 text-muted/30" />
            <p>No results found for your search.</p>
          </div>
        ) : (
          <>
            {data?.folders && data.folders.length > 0 && (
              <ResourceSection title="Folders">
                {data.folders.map((sub: FolderData) => (
                  <FolderCard
                    key={sub.guid}
                    folder={sub}
                    onFavoriteToggle={getFolderFavoriteHandler(sub)}
                    onDelete={getFolderDeleteHandler(sub, null)}
                  />
                ))}
              </ResourceSection>
            )}

            {data?.files && data.files.length > 0 && (
              <ResourceSection title="Files">
                {data.files.map((file: FileData) => (
                  <FileCard
                    key={file.guid}
                    file={file}
                    onDownload={getDownloadHandler(file.guid)}
                    onFavoriteToggle={getFileFavoriteHandler(file)}
                    onDelete={getFileDeleteHandler(file, null)}
                    onRename={getFileRenameHandler(file)}
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