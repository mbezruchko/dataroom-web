import React, { useState } from "react"
import { DeleteConfirmationDialog } from "../DeleteConfirmationDialog"
import { RenameDialog } from "../RenameDialog"
import { useFolderActions } from "@/hooks/useFolderActions"
import { useAppStore } from "@/store/useAppStore"
import type { FolderCardProps } from "./types"
import FolderCardGrid from "./FolderCardGrid"
import FolderCardList from "./FolderCardList"

const FolderCard = ({ folder, contextFolderGuid }: FolderCardProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showRename, setShowRename] = useState(false)
  const { viewMode, selectedResources, toggleResourceSelection } = useAppStore()
  const { getFolderDeleteHandler, getFolderFavoriteHandler, getFolderRenameHandler } = useFolderActions()

  const isSelected = selectedResources.includes(folder.guid)
  const handleSelect = (guid: string) => toggleResourceSelection(guid)

  const onFavoriteToggle = getFolderFavoriteHandler(folder)

  const handleDeleteClick = (e?: React.MouseEvent) => {
    if (e) { e.preventDefault(); e.stopPropagation() }
    setShowDeleteConfirm(true)
  }

  const handleRenameClick = (e?: React.MouseEvent) => {
    if (e) { e.preventDefault(); e.stopPropagation() }
    setShowRename(true)
  }

  const handleRenameConfirm = (newName: string) => {
    getFolderRenameHandler(folder)(newName)
    setShowRename(false)
  }

  const commonProps = {
    folder,
    isSelected,
    onSelect: handleSelect,
    onFavoriteToggle,
    handleDeleteClick,
    handleRenameClick,
  }

  return (
    <>
      {viewMode === 'grid' ? <FolderCardGrid {...commonProps} /> : <FolderCardList {...commonProps} />}

      <DeleteConfirmationDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        onConfirm={() => getFolderDeleteHandler(folder, contextFolderGuid)()}
        title="Delete Folder"
        description={`Are you sure you want to delete "${folder.name}"? All its contents will be moved to trash.`}
      />

      <RenameDialog
        open={showRename}
        onOpenChange={setShowRename}
        title="Rename Folder"
        initialValue={folder.name}
        onConfirm={handleRenameConfirm}
        maxLength={30}
      />
    </>
  )
}

export default FolderCard
