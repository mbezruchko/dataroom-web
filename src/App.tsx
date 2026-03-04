import { Layout } from "./components/layout/Layout"
import { Toaster } from "./components/ui/sonner"
import { Routes, Route, Navigate } from "react-router-dom"
import { FileExplorer } from "./components/views/FileExplorer"
import { Favorites } from "./components/views/Favorites"
import { Trash } from "./components/views/Trash"
import { SearchResults } from "./components/views/SearchResults"
import { NotFound } from "./components/views/NotFound"
import { WorkspaceRedirect } from "./components/layout/WorkspaceRedirect"

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<WorkspaceRedirect />} />

        {/* Workspace Layout Route */}
        <Route path="/:workspaceGuid" element={<Layout />}>
          <Route index element={<Navigate to="root" replace />} />
          <Route path="root" element={<FileExplorer />} />
          <Route path="folder/:folderGuid" element={<FileExplorer />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="trash" element={<Trash />} />
          <Route path="search" element={<SearchResults />} />
          <Route path="*" element={<NotFound variant="page" />} />
        </Route>

        {/* Support legacy paths by redirecting to default workspace */}
        <Route path="/root" element={<WorkspaceRedirect />} />
        <Route path="/folder/:folderGuid" element={<WorkspaceRedirect />} />
        <Route path="/favorites" element={<WorkspaceRedirect />} />
        <Route path="/trash" element={<WorkspaceRedirect />} />
        <Route path="/search" element={<WorkspaceRedirect />} />

        <Route path="*" element={<NotFound variant="page" />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App