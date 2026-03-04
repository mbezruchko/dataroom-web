import { Layout } from "./components/layout/Layout"
import { Routes, Route, Navigate } from "react-router-dom"
import { FileExplorer } from "./components/views/FileExplorer"
import { Favorites } from "./components/views/Favorites"
import { Trash } from "./components/views/Trash"
import { SearchResults } from "./components/views/SearchResults"

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/root" replace />} />
        <Route path="/root" element={<FileExplorer />} />
        <Route path="/folder/:folderId" element={<FileExplorer />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/trash" element={<Trash />} />
        <Route path="/search" element={<SearchResults />} />
      </Routes>
    </Layout>
  )
}

export default App