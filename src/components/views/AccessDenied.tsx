import { Link } from "react-router-dom"
import { ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui"

export const AccessDenied = () => (
  <div className="flex h-full flex-col items-center justify-center gap-6 text-center animate-in fade-in zoom-in duration-300">
    <div className="flex flex-col items-center gap-2">
      <div className="bg-destructive/10 p-4 rounded-full mb-4">
        <ShieldAlert className="size-16 text-destructive" aria-hidden />
      </div>
      <h1 className="text-4xl font-bold tracking-tight">Access Denied</h1>
      <p className="text-lg text-muted-foreground max-w-[400px]">
        You don't have permission to access this workspace. This might happen if the workspace was created in a different browser session.
      </p>
    </div>
    <div className="flex gap-4">
      <Button asChild variant="default">
        <Link to="/">Go to My Workspace</Link>
      </Button>
    </div>
  </div>
)
