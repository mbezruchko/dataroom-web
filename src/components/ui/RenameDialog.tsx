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
import { Loader2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const MAX_NAME_LENGTH = 30

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
    const isTooLong = name.length > MAX_NAME_LENGTH

    useEffect(() => {
        if (open) {
            setName(initialValue)
        }
    }, [open, initialValue])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (name.trim() && name.trim() !== initialValue && !isTooLong) {
            onConfirm(name.trim())
            onOpenChange(false)
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
                        <div className="space-y-2">
                            <Input
                                id="rename-field"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={cn(
                                    "col-span-3 transition-colors",
                                    isTooLong && "border-destructive focus-visible:ring-destructive"
                                )}
                                autoFocus
                                onFocus={(e) => e.target.select()}
                            />
                            <div className="flex items-center justify-between px-1">
                                <div className="flex items-center gap-1.5 min-h-[16px]">
                                    {isTooLong && (
                                        <span className="text-[11px] text-destructive flex items-center gap-1 font-medium animate-in fade-in slide-in-from-top-1">
                                            <AlertCircle className="size-3" />
                                            Maximum 60 characters
                                        </span>
                                    )}
                                </div>
                                <span className={cn(
                                    "text-[10px] font-medium transition-colors",
                                    isTooLong ? "text-destructive" : "text-muted-foreground"
                                )}>
                                    {name.length}/{MAX_NAME_LENGTH}
                                </span>
                            </div>
                        </div>
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
                            disabled={!name.trim() || isTooLong || isPending}
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
