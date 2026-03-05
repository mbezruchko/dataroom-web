import { Loader2, Star } from "lucide-react"
import { useFavorites } from "@/lib/queries"
import { useParams } from "react-router-dom"
import type { FolderData, FileData } from "@/lib/api"
import { FolderCard } from "@/components/ui/FolderCard"
import { FileCard } from "@/components/ui/FileCard"
import { ResourceSection } from "@/components/ui/ResourceSection"

export const Favorites = () => {
  const { workspaceGuid } = useParams<{ workspaceGuid: string }>();
  const { data, isLoading } = useFavorites(workspaceGuid);

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
      </div>

      <div className="space-y-8 mt-6 h-full">
        {data?.folders && data.folders.length > 0 && (
          <ResourceSection title="Folders">
            {data.folders.map((sub: FolderData) => (
              <FolderCard
                key={sub.guid}
                folder={sub}
                contextFolderGuid={null}
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
                contextFolderGuid={null}
              />
            ))}
          </ResourceSection>
        )}
        {(!data?.folders?.length && !data?.files?.length) && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground w-full h-full">
            <p>No favorites yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};