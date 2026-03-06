import { LayoutGrid, List } from "lucide-react"
import { useAppStore } from "@/store/useAppStore"
import { Tabs, TabsList, TabsTrigger } from "./tabs"

export const ViewSwitcher = () => {
  const { viewMode, setViewMode } = useAppStore()

  return (
    <Tabs
      value={viewMode}
      onValueChange={(value) => setViewMode(value as "grid" | "list")}
    >
      <TabsList className="h-9 p-1 bg-muted/50 border">
        <TabsTrigger
          value="grid"
          className="h-7 w-9 p-0 cursor-pointer data-[state=active]:bg-background data-[state=active]:shadow-sm"
          title="Grid view"
        >
          <LayoutGrid className="h-4 w-4" />
        </TabsTrigger>
        <TabsTrigger
          value="list"
          className="h-7 w-9 p-0 cursor-pointer data-[state=active]:bg-background data-[state=active]:shadow-sm"
          title="List view"
        >
          <List className="h-4 w-4" />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
