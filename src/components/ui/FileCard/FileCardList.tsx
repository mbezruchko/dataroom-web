import { FileText } from "lucide-react"
import { Checkbox } from "../checkbox"
import FileActions from "./FileActions"
import type { ViewProps } from "./types"
import { useAppStore } from "@/store/useAppStore"

const FileCardList = ({
  file,
  isTrash,
  isSelected,
  onSelect,
  onFavoriteToggle,
  handleDeleteClick,
  handleRenameClick,
  handlePreviewClick,
  onDownload,
  onRestore
}: ViewProps) => {
  const { isBulkMode } = useAppStore()
  const showCheckbox = isBulkMode || isSelected
  const gridCols = showCheckbox ? 'grid-cols-[48px_80px_1fr_180px_100px_48px]' : 'grid-cols-[80px_1fr_180px_100px_48px]'

  return (
    <div className={`group/card relative border-b border-border transition-colors h-12 grid ${gridCols} gap-3 px-3 items-center hover:bg-muted ${isTrash ? 'opacity-80' : ''} ${isSelected ? 'bg-primary/5' : ''}`}>
      {showCheckbox && (
        <div className="flex justify-center relative z-20" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onSelect(file.guid)}
          />
        </div>
      )}

      <div
        onClick={handlePreviewClick}
        className="grid grid-cols-subgrid col-span-4 contents cursor-pointer"
      >
        <div className="flex justify-center group-hover/card:scale-110 transition-transform">
          <FileText className="text-sidebar-foreground size-5" />
        </div>
        <div className="truncate min-w-0">
          <span className="font-medium truncate text-foreground">{file.name}</span>
        </div>
        <div className="text-sm text-muted-foreground truncate">
          {new Date(file.updated_at || file.created_at).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="text-sm text-muted-foreground truncate">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
      </div>

      <FileActions
        file={file} isTrash={isTrash} onFavorite={onFavoriteToggle} onPreview={handlePreviewClick}
        onDownload={onDownload} onRename={handleRenameClick} onDelete={handleDeleteClick} onRestore={onRestore}
        className="px-1 relative z-20"
        isGrid={false}
      />
    </div>
  )
}

export default FileCardList
