import type { MouseEvent } from "react"
import { Star, Trash2, MoreVertical, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface FolderActionsProps {
  isFavorite: boolean
  onFavorite: (e: MouseEvent) => void
  onRename: (e?: MouseEvent) => void
  onDelete: (e?: MouseEvent) => void
  isGrid: boolean
  className?: string
}

const FolderActions = ({ isFavorite, onFavorite, onRename, onDelete, isGrid, className = "" }: FolderActionsProps) => (
  <div className={`flex items-center justify-end gap-1 ${className}`}>
    <button
      onClick={onFavorite}
      className={`p-2 hover:bg-yellow-500/10 rounded-full transition-all shrink-0 ${isFavorite ? 'opacity-100' : isGrid ? 'group-hover/card:opacity-100 opacity-0' : 'opacity-40 hover:opacity-100'}`}
    >
      <Star className={`h-4 w-4 ${isFavorite ? 'fill-yellow-400 text-yellow-500' : 'text-muted-foreground'}`} />
    </button>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={`size-8 rounded-full transition-all shrink-0 cursor-pointer ${isGrid ? 'group-hover/card:opacity-100 opacity-0' : 'opacity-100'}`} onClick={e => e.stopPropagation()}>
          <MoreVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onSelect={() => onRename()} className="cursor-pointer">
          <Pencil className="mr-2 size-4" /> Rename
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onDelete()} className="text-destructive focus:text-destructive cursor-pointer">
          <Trash2 className="mr-2 size-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
)

export default FolderActions
