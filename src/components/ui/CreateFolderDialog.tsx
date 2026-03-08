import { useState } from "react"
import { useCreateFolder } from "@/lib/queries"
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
import { Input } from "@/components/ui/input"
import { FolderPlus, Loader2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const MAX_NAME_LENGTH = 30

interface CreateFolderDialogProps {
  parentId?: string | null | 'root'
}

export function CreateFolderDialog({ parentId }: CreateFolderDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const { workspaceGuid } = useParams<{ workspaceGuid: string }>()
  const createFolder = useCreateFolder()
  const isTooLong = name.length > MAX_NAME_LENGTH

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || isTooLong) return

    const normalizedParentId = parentId === 'root' ? null : parentId

    createFolder.mutate(
      {
        name: name.trim(),
        parent_guid: normalizedParentId,
        workspace_guid: workspaceGuid
      },
      {
        onSuccess: () => {
          setOpen(false)
          setName("")
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 cursor-pointer">
          <FolderPlus className="size-4" />
          New Folder
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>
              Enter a name for your new folder.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Input
                id="name"
                placeholder="e.g. Q4 Financials"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={MAX_NAME_LENGTH}
                className={cn(
                  "col-span-3 transition-colors",
                  isTooLong && "border-destructive focus-visible:ring-destructive"
                )}
                autoFocus
              />
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5 min-h-[16px]">
                  {isTooLong && (
                    <span className="text-[11px] text-destructive flex items-center gap-1 font-medium animate-in fade-in slide-in-from-top-1">
                      <AlertCircle className="size-3" />
                      Maximum 30 characters
                    </span>
                  )}
                </div>
                <span className={cn(
                  "text-[10px] font-medium transition-colors",
                  isTooLong ? "text-destructive" : "text-muted-foreground"
                )}>
                  {name.length}/{MAX_NAME_LENGTH}
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={createFolder.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim() || isTooLong || createFolder.isPending}>
              {createFolder.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
