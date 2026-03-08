import type { MouseEvent } from "react"
import { Download, Eye, MoreVertical, Pencil, RotateCcw, Star, Trash2 } from "lucide-react"
import { Button } from "../button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../dropdown-menu"
import type { FileData } from "@/lib/api"

interface FileActionsProps {
  file: FileData
  isTrash?: boolean
  onFavorite: (e: MouseEvent) => void
  onPreview: (e?: MouseEvent) => void
  onDownload: (e?: MouseEvent) => void
  onRename: () => void
  onDelete: (e?: MouseEvent) => void
  onRestore: (e?: MouseEvent) => void
  isGrid: boolean
  className?: string
}

const FileActions = ({ file, isTrash, onFavorite, onPreview, onDownload, onRename, onDelete, onRestore, isGrid, className = "" }: FileActionsProps) => (
  <div className={`flex items-center justify-end gap-1 ${className}`}>
    {!isTrash && (
      <button
        onClick={onFavorite}
        className={`p-2 hover:bg-yellow-500/10 rounded-full transition-all shrink-0 ${file.is_favorite ? 'opacity-100' : isGrid ? 'group-hover/card:opacity-100 opacity-0 touch:opacity-100' : 'opacity-40 hover:opacity-100'}`}
      >
        <Star className={`h-4 w-4 ${file.is_favorite ? 'fill-yellow-400 text-yellow-500' : 'text-muted-foreground'}`} />
      </button>
    )}
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={`size-8 rounded-full transition-all shrink-0 cursor-pointer ${isGrid ? 'group-hover/card:opacity-100 opacity-0 touch:opacity-100' : 'opacity-100'}`} onClick={e => e.stopPropagation()}>
          <MoreVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {isTrash ? (
          <>
            <DropdownMenuItem onSelect={() => onPreview()} className="cursor-pointer">
              <Eye className="mr-2 size-4" /> Preview
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onRestore()} className="cursor-pointer">
              <RotateCcw className="mr-2 size-4" /> Restore
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onDelete()} className="text-destructive focus:text-destructive cursor-pointer">
              <Trash2 className="mr-2 size-4" /> Delete
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem onSelect={() => onPreview()} className="cursor-pointer">
              <Eye className="mr-2 size-4" /> Preview
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onDownload()} className="cursor-pointer">
              <Download className="mr-2 size-4" /> Download
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onRename()} className="cursor-pointer">
              <Pencil className="mr-2 size-4" /> Rename
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onDelete()} className="text-destructive focus:text-destructive cursor-pointer">
              <Trash2 className="mr-2 size-4" /> Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
)

export default FileActions
