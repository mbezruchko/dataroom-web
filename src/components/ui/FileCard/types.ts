import type { MouseEvent } from "react"
import type { FileData } from "@/lib/api"

export interface FileCardProps {
  file: FileData
  contextFolderGuid?: string | null
  isTrash?: boolean
}

export interface ViewProps extends FileCardProps {
  isSelected: boolean
  onSelect: (guid: string) => void
  onFavoriteToggle: (e: MouseEvent) => void
  handleDeleteClick: (e?: MouseEvent) => void
  handleRenameClick: () => void
  handlePreviewClick: (e?: MouseEvent) => void
  onDownload: (e?: MouseEvent) => void
  onRestore: (e?: MouseEvent) => void
}
