import { useState, useEffect } from "react"
import { FileText, Star, Trash2, Download, Pencil, Check, X } from "lucide-react"
import type { FileData } from "@/lib/api"
import React from "react"

interface FileCardProps {
  file: FileData
  onDownload: (e: React.MouseEvent) => void
  onFavoriteToggle: (e: React.MouseEvent) => void
  onDelete: (e: React.MouseEvent) => void
  onRename?: (newName: string) => void
}

export const FileCard = ({ file, onDownload, onFavoriteToggle, onDelete, onRename }: FileCardProps) => {
  const [isEditingName, setIsEditingName] = useState(false)
  const [tempName, setTempName] = useState(file.name)

  useEffect(() => {
    setTempName(file.name)
  }, [file.name])

  const handleRename = () => {
    const trimmed = tempName.trim()
    if (trimmed && trimmed !== file.name && onRename) {
      onRename(trimmed)
    }
    setIsEditingName(false)
  }

  const handleCancelRename = () => {
    setTempName(file.name)
    setIsEditingName(false)
  }

  return (
    <div className="group relative p-4 border rounded-lg shadow-sm hover:bg-accent cursor-pointer transition-colors flex items-center justify-between gap-3 h-20">
      <div className="flex items-center gap-3 truncate min-w-0 flex-1">
        <span className="text-2xl shrink-0"><FileText className="text-sidebar-foreground" /></span>
        {isEditingName ? (
          <div className="flex items-center gap-1 flex-1 min-w-0">
            <input
              autoFocus
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRename()
                if (e.key === "Escape") handleCancelRename()
              }}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 min-w-0 font-medium bg-background border-b-2 border-primary outline-none px-1 text-sm"
            />
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); handleRename(); }}
              className="p-1.5 hover:bg-muted rounded-md text-green-500 shrink-0"
              title="Save"
            >
              <Check className="size-4" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); handleCancelRename(); }}
              className="p-1.5 hover:bg-muted rounded-md text-destructive shrink-0"
              title="Cancel"
            >
              <X className="size-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col truncate min-w-0">
            <span className="font-medium truncate">{file.name}</span>
            <span className="text-xs text-muted-foreground truncate">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
          </div>
        )}
      </div>
      {!isEditingName && (
        <div className="flex items-center gap-1">
          <button
            onClick={onDownload}
            className="p-2 hover:bg-primary/10 rounded-full transition-all opacity-0 group-hover:opacity-100"
            title="Download file"
          >
            <Download className="h-4 w-4 text-primary" />
          </button>
          {onRename && (
            <button
              onClick={(e) => { e.stopPropagation(); setIsEditingName(true); }}
              className="opacity-0 group-hover:opacity-100 p-2 hover:bg-muted rounded-full transition-all text-muted-foreground"
              title="Rename file"
            >
              <Pencil className="h-4 w-4" />
            </button>
          )}
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
      )}
    </div>
  )
}