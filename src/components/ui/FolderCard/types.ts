import type { MouseEvent } from "react"
import type { FolderData } from "@/lib/api"

export interface FolderCardProps {
  folder: FolderData
  contextFolderGuid?: string | null
}

export interface ViewProps extends FolderCardProps {
  isSelected: boolean
  onSelect: (guid: string) => void
  onFavoriteToggle: (e: MouseEvent) => void
  handleDeleteClick: (e?: MouseEvent) => void
  handleRenameClick: (e?: MouseEvent) => void
}
