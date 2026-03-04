import { Link } from "react-router-dom"
import { FolderClosed, Star, Trash2 } from "lucide-react"
import type { FolderData } from "@/lib/api"
import React from "react"

interface FolderCardProps {
  folder: FolderData
  onFavoriteToggle: (e: React.MouseEvent) => void
  onDelete: (e: React.MouseEvent) => void
}

export const FolderCard = ({ folder, onFavoriteToggle, onDelete }: FolderCardProps) => {
  return (
    <Link to={`/folder/${folder.id}`} className="group relative">
      <div className="p-4 border rounded-lg shadow-sm hover:bg-accent cursor-pointer transition-colors flex items-center justify-between gap-3 h-20">
        <div className="flex items-center gap-3 truncate min-w-0">
          <span className="text-2xl shrink-0"><FolderClosed className="text-sidebar-foreground" /></span>
          <div className="flex flex-col truncate">
            <span className="font-medium truncate">{folder.name}</span>
            <span className="text-xs text-muted-foreground truncate">
              {folder.files_count === 0 ? 'empty' :
                folder.files_count === 1 ? '1 file' :
                  `${folder.files_count} files`}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onFavoriteToggle}
            className={`p-2 hover:bg-yellow-500/10 rounded-full transition-all ${folder.is_favorite ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
            title={folder.is_favorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Star className={`h-4 w-4 ${folder.is_favorite ? 'fill-yellow-400 text-yellow-500' : 'text-muted-foreground'}`} />
          </button>
          <button
            onClick={onDelete}
            className="opacity-0 group-hover:opacity-100 p-2 hover:bg-destructive/10 rounded-full transition-all"
            title="Delete folder"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </button>
        </div>
      </div>
    </Link>
  )
}