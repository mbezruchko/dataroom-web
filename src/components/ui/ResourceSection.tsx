import React from "react"
import { useAppStore } from "@/store/useAppStore"

interface ResourceSectionProps {
    title: string
    children: React.ReactNode
}

export const ResourceSection = ({ title, children }: ResourceSectionProps) => {
    const viewMode = useAppStore(state => state.viewMode)

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-1">
                {title}
            </h3>
            <div className={
                viewMode === 'grid'
                    ? "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4"
                    : "flex flex-col gap-2"
            }>
                {children}
            </div>
        </div>
    )
}