import { useState, useRef } from "react"
import { useUploadFile } from "@/lib/queries"
import { useParams } from "react-router-dom"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Upload, Loader2, FileUp, Trash2 } from "lucide-react"

interface UploadFileDialogProps {
  folderId: string | 'root' | null
}

export function UploadFileDialog({ folderId }: UploadFileDialogProps) {
  const [open, setOpen] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { workspaceGuid } = useParams<{ workspaceGuid: string }>()
  const uploadFile = useUploadFile()

  const targetFolderId = folderId === 'root' ? null : folderId
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(f => f.name.toLowerCase().endsWith('.pdf'))
      setFiles(prev => [...prev, ...newFiles])
    }
  }
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }
  const handleUpload = () => {
    if (files.length === 0) return
    uploadFile.mutate(
      {
        files,
        folder_guid: targetFolderId,
        workspace_guid: workspaceGuid,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            )
            setProgress(percentCompleted)
          }
        },
      },
      {
        onSuccess: () => {
          setOpen(false)
          setFiles([])
          setProgress(0)
        },
        onError: () => {
          setProgress(0)
        }
      }
    )
  }
  const handleOpenChange = (newOpen: boolean) => {
    if (!uploadFile.isPending) {
      setOpen(newOpen)
      if (!newOpen) {
        setFiles([])
        setProgress(0)
      }
    }
  }

  const renderFooter = () => {
    return (
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          className="cursor-pointer"
          onClick={() => handleOpenChange(false)}
          disabled={uploadFile.isPending}
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleUpload}
          className="cursor-pointer"
          disabled={files.length === 0 || uploadFile.isPending}
        >
          {uploadFile.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Upload {progress > 0 ? `${progress}%` : ''}
        </Button>
      </DialogFooter>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2 cursor-pointer">
          <Upload className="size-4" />
          Upload File
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload PDF Document</DialogTitle>
          <DialogDescription>
            Select a PDF file to upload to the current folder.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center space-y-4 py-4 w-full min-w-0">
          <input
            type="file"
            accept=".pdf"
            multiple
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
            disabled={uploadFile.isPending}
          />
          <div
            className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted hover:border-primary/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <FileUp className="mb-2 size-8 text-muted-foreground" />
            <p className="text-sm font-medium text-muted-foreground">Click or drag to select PDF files</p>
            <p className="text-xs text-muted-foreground">Multiple PDF files up to 10MB each</p>
          </div>

          {files.length > 0 && (
            <div className="flex w-full flex-col space-y-2 rounded-lg border bg-muted/50 p-2 max-h-[200px] overflow-y-auto">
              {files.map((f, i) => (
                <div key={i} className="flex items-center justify-between gap-3 p-2 rounded-md hover:bg-accent group">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <FileUp className="size-4 text-primary shrink-0" />
                    <span className="truncate text-xs font-medium">{f.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                      {(f.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                    {!uploadFile.isPending && (
                      <button
                        onClick={() => removeFile(i)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded-full transition-all"
                      >
                        <Trash2 className="size-3 text-destructive" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          {uploadFile.isPending && (
            <div className="w-full space-y-2 p-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Uploading {files.length} files...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full bg-primary transition-all duration-300 ease-in-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
          {files.length > 0 && !uploadFile.isPending && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFiles([])}
              className="text-muted-foreground"
            >
              Clear all
            </Button>
          )}

          {uploadFile.isError && (
            <p className="text-sm text-destructive">
              Failed to upload file. Please try again.
            </p>
          )}
        </div>

        {renderFooter()}

      </DialogContent>
    </Dialog>
  )
}