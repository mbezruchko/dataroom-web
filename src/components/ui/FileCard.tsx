import { FileText, Star, Trash2, Download } from "lucide-react"
import type { FileData } from "@/lib/api"
import React from "react"

interface FileCardProps {
  file: FileData
  onDownload: (e: React.MouseEvent) => void
  onFavoriteToggle: (e: React.MouseEvent) => void
  onDelete: (e: React.MouseEvent) => void
}

export const FileCard = ({ file, onDownload, onFavoriteToggle, onDelete }: FileCardProps) => {
  return (
    <div className="group relative p-4 border rounded-lg shadow-sm hover:bg-accent cursor-pointer transition-colors flex items-center justify-between gap-3 h-20">
      <div className="flex items-center gap-3 truncate min-w-0">
        <span className="text-2xl shrink-0"><FileText className="text-sidebar-foreground" /></span>
        <div className="flex flex-col truncate">
          <span className="font-medium truncate">{file.name}</span>
          <span className="text-xs text-muted-foreground truncate">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={onDownload}
          className="p-2 hover:bg-primary/10 rounded-full transition-all opacity-0 group-hover:opacity-100"
          title="Download file"
        >
          <Download className="h-4 w-4 text-primary" />
        </button>
        <button
          onClick={onFavoriteToggle}
          className={`p-2 hover:bg-yellow-500/10 rounded-full transition-all ${file.is_favorite ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
          title={file.is_favorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Star className={`h-4 w-4 ${file.is_favorite ? 'fill-yellow-400 text-yellow-500' : 'text-muted-foreground'}`} />
        </button>
        <button
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 p-2 hover:bg-destructive/10 rounded-full transition-all"
          title="Delete file"
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </button>
      </div>
    </div>
  )
}