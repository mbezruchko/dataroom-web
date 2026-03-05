import * as React from "react"
import { ChevronsUpDown, GalleryVerticalEnd, Pencil, Trash2, MoreVertical } from "lucide-react"
import { useWorkspaces, useDeleteWorkspace, useUpdateWorkspace } from "@/lib/queries/workspace"
import { CreateWorkspaceDialog } from "../ui/CreateWorkspaceDialog"
import { useNavigate, useParams } from "react-router-dom"
import { DeleteConfirmationDialog } from "../ui/DeleteConfirmationDialog"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export function WorkspaceSwitcher() {
  const { data: workspaces, isLoading } = useWorkspaces()
  const { workspaceGuid } = useParams<{ workspaceGuid: string }>()
  const navigate = useNavigate()
  const { mutate: deleteWorkspace } = useDeleteWorkspace()
  const { mutate: updateWorkspace } = useUpdateWorkspace()

  const [workspaceToDelete, setWorkspaceToDelete] = React.useState<{ guid: string, name: string } | null>(null)
  const [workspaceToRename, setWorkspaceToRename] = React.useState<{ guid: string, name: string } | null>(null)
  const [newName, setNewName] = React.useState("")

  const activeWorkspace = workspaces?.find(
    (workspace) => workspace.guid === workspaceGuid
  ) || workspaces?.[0]

  const handleSelectWorkspace = (guid: string) => {
    navigate(`/${guid}/root`)
  }

  const handleDelete = () => {
    if (workspaceToDelete) {
      deleteWorkspace(workspaceToDelete.guid, {
        onSuccess: () => {
          if (workspaceToDelete.guid === workspaceGuid) {
            const other = workspaces?.find(w => w.guid !== workspaceToDelete.guid)
            if (other) {
              navigate(`/${other.guid}/root`)
            } else {
              navigate('/')
            }
          }
          setWorkspaceToDelete(null)
        }
      })
    }
  }

  const handleRename = () => {
    if (workspaceToRename && newName.trim()) {
      updateWorkspace({ guid: workspaceToRename.guid, name: newName.trim() }, {
        onSuccess: () => {
          setWorkspaceToRename(null)
          setNewName("")
        }
      })
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between gap-2 px-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer"
          >
            <div className="flex items-center gap-2 truncate">
              <div className="flex size-6 items-center justify-center rounded-sm bg-primary/10 text-primary shrink-0">
                <GalleryVerticalEnd className="size-4" />
              </div>
              <span className="font-semibold truncate">
                {isLoading ? "Loading..." : activeWorkspace?.name || "Select Workspace"}
              </span>
            </div>
            <ChevronsUpDown className="size-4 opacity-50 shrink-0" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start" sideOffset={4}>
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            Workspaces
          </DropdownMenuLabel>
          {workspaces?.map((workspace) => (
            <div key={workspace.guid} className="group relative">
              <DropdownMenuItem
                onClick={() => handleSelectWorkspace(workspace.guid)}
                className="flex items-center gap-2 cursor-pointer pr-10"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border bg-background">
                  <GalleryVerticalEnd className="size-3" />
                </div>
                <span className="flex-1 truncate">{workspace.name}</span>
              </DropdownMenuItem>

              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 hover:bg-muted rounded-md transition-colors cursor-pointer">
                      <MoreVertical className="size-3 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        setWorkspaceToRename({ guid: workspace.guid, name: workspace.name })
                        setNewName(workspace.name)
                      }}
                      className="cursor-pointer"
                    >
                      <Pencil className="mr-2 size-3" />
                      Rename
                    </DropdownMenuItem>
                    {workspace.name !== "Default Workspace" && workspaces && workspaces.length > 1 && (
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          setWorkspaceToDelete({ guid: workspace.guid, name: workspace.name })
                        }}
                        className="text-destructive focus:text-destructive cursor-pointer"
                      >
                        <Trash2 className="mr-2 size-3" />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
          <DropdownMenuSeparator />
          <CreateWorkspaceDialog />
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteConfirmationDialog
        open={!!workspaceToDelete}
        onOpenChange={(open) => !open && setWorkspaceToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Workspace"
        description={<>Are you sure you want to delete <span className="font-bold">"{workspaceToDelete?.name}"</span>? <br /> All files and folders inside will be lost.</>}
      />

      {workspaceToRename && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-lg border bg-card p-6 shadow-lg animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-semibold mb-4">Rename Workspace</h3>
            <input
              autoFocus
              className="w-full px-3 py-2 border rounded-md mb-4 bg-background outline-none focus:ring-2 focus:ring-primary/20"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRename()}
            />
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setWorkspaceToRename(null)}>Cancel</Button>
              <Button onClick={handleRename}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
