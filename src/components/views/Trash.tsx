import { Loader2, Trash2, RotateCcw, FileText } from "lucide-react"
import { useTrash, useRestoreFile } from "@/lib/queries"
import { useParams } from "react-router-dom"
import type { FileData } from "@/lib/api"

export const Trash = () => {
  const { workspaceGuid } = useParams<{ workspaceGuid: string }>();
  const { data, isLoading } = useTrash(workspaceGuid);
  const restoreFile = useRestoreFile();

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
        <h2 className="text-2xl font-bold tracking-tight">Trash</h2>
      </div>

      <div className="space-y-8 mt-6">
        {data?.files && data.files.length > 0 ? (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-1">
              Deleted Files
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {data.files.map((file: FileData) => (
                <div key={file.guid} className="group relative p-4 border rounded-lg shadow-sm hover:bg-accent transition-colors flex items-center justify-between gap-3 h-20">
                  <div className="flex items-center gap-3 truncate min-w-0">
                    <span className="text-2xl shrink-0 opacity-50"><FileText /></span>
                    <div className="flex flex-col truncate">
                      <span className="font-medium truncate text-muted-foreground">{file.name}</span>
                      <span className="text-xs text-muted-foreground truncate">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        restoreFile.mutate({ guid: file.guid });
                      }}
                      className="p-2 hover:bg-primary/10 rounded-full transition-all"
                      title="Restore file"
                    >
                      <RotateCcw className="h-4 w-4 text-primary" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground w-full">
            <Trash2 className="h-12 w-12 mb-4 text-muted/30" />
            <p>Trash is empty.</p>
          </div>
        )}
      </div>
    </div>
  );
};