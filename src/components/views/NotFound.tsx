import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { FolderX, FileQuestion } from "lucide-react"

interface NotFoundProps {
  variant?: "folder" | "page"
}

export const NotFound = ({ variant = "folder" }: NotFoundProps) => (
  <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
    <div className="flex flex-col items-center gap-2">
      <span className="text-8xl font-bold text-muted-foreground">404</span>
      <p className="text-lg text-muted-foreground">
        {variant === "page" ? "Page not found" : "Folder not found"}
      </p>
    </div>
    <Button asChild variant="outline">
      <Link to="/root">Return to storage</Link>
    </Button>
    {variant === "page" ? (
      <FileQuestion className="size-12 text-muted-foreground/50" aria-hidden />
    ) : (
      <FolderX className="size-12 text-muted-foreground/50" aria-hidden />
    )}
  </div>
)
