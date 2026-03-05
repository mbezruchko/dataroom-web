import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PDFViewer } from "./PDFViewer"
import { Button } from "./button"
import { Download } from "lucide-react"

interface PDFPreviewDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  fileUrl: string
  fileName: string
}

export function PDFPreviewDialog({
  isOpen,
  onOpenChange,
  fileUrl,
  fileName
}: PDFPreviewDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[70vw] h-[95vh] sm:max-w-none flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 border-b flex flex-row items-center justify-between space-y-0 shrink-0">
          <DialogTitle className="truncate pr-8">{fileName}</DialogTitle>
          <div className="flex items-center mr-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(fileUrl, '_blank')}
              className="cursor-pointer"
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </DialogHeader>
        <div className="flex-1 min-h-0 bg-muted/30 overflow-hidden">
          {isOpen && <PDFViewer fileUrl={fileUrl} />}
        </div>
      </DialogContent>
    </Dialog>
  )
}
