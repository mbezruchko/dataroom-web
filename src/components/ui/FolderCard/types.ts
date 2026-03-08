export interface FolderCardProps {
  folder: FolderData
  contextFolderGuid?: string | null
}

export interface ViewProps extends FolderCardProps {
  isSelected: boolean
  onSelect: (guid: string) => void
  onFavoriteToggle: (e: React.MouseEvent) => void
  handleDeleteClick: (e?: React.MouseEvent) => void
  handleRenameClick: (e?: React.MouseEvent) => void
}
