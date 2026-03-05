import { Loader2, Trash2 } from "lucide-react"
import { useTrash, useEmptyTrash } from "@/lib/queries/search"
import { useParams } from "react-router-dom"
import type { FileData } from "@/lib/api"
import { ResourceSection } from "@/components/ui/ResourceSection"
import { FileCard } from "@/components/ui/FileCard"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { DeleteConfirmationDialog } from "@/components/ui/DeleteConfirmationDialog"

export const Trash = () => {
  const { workspaceGuid } = useParams<{ workspaceGuid: string }>();
  const { data, isLoading } = useTrash(workspaceGuid);
  const emptyTrash = useEmptyTrash();
  const [showConfirm, setShowConfirm] = useState(false);

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const hasContent = data?.files && data.files.length > 0;

  const handleEmptyTrash = () => {
    if (workspaceGuid) {
      emptyTrash.mutate(workspaceGuid, {
        onSuccess: () => setShowConfirm(false)
      });
    }
  };

  return (
    <div className="flex h-full flex-col p-6 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold tracking-tight">Trash</h2>
        {hasContent && (
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

      <div className="mt-6 flex-1 overflow-auto">
        {hasContent ? (
          <ResourceSection title="Deleted Files">
            {data.files.map((file: FileData) => (
              <FileCard key={file.guid} file={file} isTrash={true} />
            ))}
          </ResourceSection>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground w-full h-full">
            <p className="text-lg font-medium">Trash is empty</p>
            <p className="text-sm">Deleted files will appear here.</p>
          </div>
        )}
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