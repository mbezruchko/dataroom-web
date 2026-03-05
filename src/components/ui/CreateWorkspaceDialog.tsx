import { useState } from "react"
import { useCreateWorkspace } from "@/lib/queries/workspace"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Loader2 } from "lucide-react"

export function CreateWorkspaceDialog() {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState("")
    const createWorkspace = useCreateWorkspace()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) return

        createWorkspace.mutate(name.trim(), {
            onSuccess: () => {
                setOpen(false)
                setName("")
            },
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="flex w-full items-center gap-2 px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer">
                    <div className="flex size-6 items-center justify-center rounded-sm border bg-background">
                        <Plus className="size-3" />
                    </div>
                    <span className="font-medium text-muted-foreground">Add workspace</span>
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Create New Workspace</DialogTitle>
                        <DialogDescription>
                            Enter a name for your new workspace to organize your folders and files.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Input
                            id="name"
                            placeholder="e.g. Project Alpha"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="col-span-3"
                            autoFocus
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={createWorkspace.isPending}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={!name.trim() || createWorkspace.isPending}>
                            {createWorkspace.isPending && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Create
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
