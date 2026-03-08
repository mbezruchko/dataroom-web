import { FileText } from "lucide-react"
import { Checkbox } from "../checkbox"
import type { ViewProps } from "./types"
import { useAppStore } from "@/store/useAppStore"
import FileActions from "./FileActions"

const FileCardGrid = ({
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
  const activeBulk = isBulkMode || isSelected

  return (
    <div className={`h-20 group/card relative p-3 border rounded-lg shadow-sm transition-all flex items-center justify-between gap-3 group/card overflow-hidden ${isTrash ? 'opacity-80' : ''} ${isSelected ? 'border-primary bg-primary/5' : 'bg-card'}`}>
      <div
        className={`absolute left-3 top-1/2 -translate-y-1/2 size-8 flex items-center justify-center transition-all duration-300 ease-in-out z-20
          ${activeBulk ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onSelect(file.guid)}
        />
      </div>

      <div
        onClick={handlePreviewClick}
        className={`flex items-center gap-3 truncate min-w-0 flex-1 transition-transform duration-300 ease-in-out cursor-pointer
          ${activeBulk ? 'translate-x-[32px]' : ''}`}
      >
        <div className="shrink-0">
          <FileText className="text-sidebar-foreground size-7" />
        </div>
        <div className="flex flex-col truncate">
          <span className="font-medium truncate text-foreground">{file.name}</span>
          <span className="text-xs text-muted-foreground truncate">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
        </div>
        <span className="absolute inset-0 z-0 cursor-pointer" aria-hidden="true" />
      </div>

      <FileActions
        file={file}
        isTrash={isTrash}
        onFavorite={onFavoriteToggle}
        onPreview={handlePreviewClick}
        onDownload={onDownload}
        onRename={handleRenameClick}
        onDelete={handleDeleteClick}
        onRestore={onRestore}
        isGrid={true}
        className="relative z-10"
      />
    </div>
  )
}

export default FileCardGrid
