import { Trash2, X } from "lucide-react"
import { useAppStore } from "@/store/useAppStore"
import { Button } from "./button"
import { Separator } from "./separator"

interface BulkActionToolbarProps {
  onDelete: () => void
  isDeleting?: boolean
}

const BulkActionToolbar = ({ onDelete, isDeleting }: BulkActionToolbarProps) => {
  const { selectedResources, clearResourceSelection } = useAppStore()
  const count = selectedResources.length

  if (count === 0) return null

  return (
    <div className="fixed left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300" style={{ bottom: 'max(2rem, env(safe-area-inset-bottom, 2rem))' }}>
      <div className="bg-popover border border-border shadow-2xl rounded-full px-4 py-2 flex items-center gap-3 backdrop-blur-md bg-opacity-90">
        <div className="flex items-center gap-2 px-2">
          <span className="bg-primary text-primary-foreground text-xs font-bold rounded-full size-5 flex items-center justify-center">
            {count}
          </span>
          <span className="text-sm font-medium">selected</span>
        </div>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:bg-destructive/10 rounded-full h-9 flex items-center px-4"
            onClick={onDelete}
            disabled={isDeleting}
          >
            <Trash2 className="size-4 mr-2" />
            Delete
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full size-9"
            onClick={clearResourceSelection}
          >
            <X className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default BulkActionToolbar
