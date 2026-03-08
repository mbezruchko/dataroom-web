import type { FileData } from "@/lib/api"

export interface FileCardProps {
  file: FileData
  contextFolderGuid?: string | null
  isTrash?: boolean
}

export interface ViewProps extends FileCardProps {
  isSelected: boolean
  onSelect: (guid: string) => void
  onFavoriteToggle: (e: React.MouseEvent) => void
  handleDeleteClick: (e?: React.MouseEvent) => void
  handleRenameClick: () => void
  handlePreviewClick: (e?: React.MouseEvent) => void
  onDownload: (e?: React.MouseEvent) => void
  onRestore: (e?: React.MouseEvent) => void
}
