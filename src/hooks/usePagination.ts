import { useState, useEffect } from "react"

const PAGE_SIZE = 24

export function usePagination<T>(items: T[]) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE))

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1)
  }, [items.length, totalPages, currentPage])

  const paginatedItems = items.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  const goToPage = (page: number) =>
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))

  return { paginatedItems, currentPage, totalPages, goToPage }
}
