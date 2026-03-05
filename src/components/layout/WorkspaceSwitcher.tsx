import * as React from "react"
import { ChevronsUpDown, GalleryVerticalEnd } from "lucide-react"
import { useWorkspaces } from "@/lib/queries/workspace"
import { CreateWorkspaceDialog } from "../ui/CreateWorkspaceDialog"
import { useNavigate, useParams } from "react-router-dom"

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

  const activeWorkspace = workspaces?.find(
    (workspace) => workspace.guid === workspaceGuid
  ) || workspaces?.[0]

  const handleSelectWorkspace = (guid: string) => {
    navigate(`/${guid}/root`)
  }

  return (
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
          <DropdownMenuItem
            key={workspace.guid}
            onClick={() => handleSelectWorkspace(workspace.guid)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="flex size-6 items-center justify-center rounded-sm border bg-background">
              <GalleryVerticalEnd className="size-3" />
            </div>
            <span className="flex-1 truncate">{workspace.name}</span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <CreateWorkspaceDialog />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
