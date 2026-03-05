import { Loader2 } from "lucide-react"
import { useTrash } from "@/lib/queries"
import { useParams } from "react-router-dom"
import type { FileData } from "@/lib/api"
import { ResourceSection } from "@/components/ui/ResourceSection"
import { FileCard } from "@/components/ui/FileCard"

export const Trash = () => {
  const { workspaceGuid } = useParams<{ workspaceGuid: string }>();
  const { data, isLoading } = useTrash(workspaceGuid);

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const hasContent = data?.files && data.files.length > 0;

  return (
    <div className="flex h-full flex-col p-6 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold tracking-tight">Trash</h2>
      </div>

      <div className="mt-6 flex-1 overflow-auto">
        {hasContent ? (
          <ResourceSection title="Deleted Files">
            {data.files.map((file: FileData) => (
              <FileCard key={file.guid} file={file} isTrash={true} />
            ))}
          </ResourceSection>
        ) : (
          <div className="flex h-[300px] flex-col items-center justify-center text-muted-foreground w-full h-full">
            <p className="text-lg font-medium">Trash is empty</p>
            <p className="text-sm">Deleted files will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};