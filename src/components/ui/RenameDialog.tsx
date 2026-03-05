import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

interface RenameDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: (newName: string) => void
    title: string
    description?: string
    initialValue: string
    isPending?: boolean
}

export function RenameDialog({
    open,
    onOpenChange,
    onConfirm,
    title,
    description,
    initialValue,
    isPending
}: RenameDialogProps) {
    const [name, setName] = useState(initialValue)

    useEffect(() => {
        if (open) {
            setName(initialValue)
        }
    }, [open, initialValue])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (name.trim() && name.trim() !== initialValue) {
            onConfirm(name.trim())
        } else if (name.trim() === initialValue) {
            onOpenChange(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        {description && (
                            <DialogDescription>
                                {description}
                            </DialogDescription>
                        )}
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Input
                            id="rename-field"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="col-span-3"
                            autoFocus
                            onFocus={(e) => e.target.select()}
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={!name.trim() || isPending}
                        >
                            {isPending && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
