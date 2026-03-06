import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  selectedFileIds: number[];
  toggleFileSelection: (id: number) => void;
  clearFileSelection: () => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  sortField: 'type' | 'name' | 'date' | 'size';
  setSortField: (field: 'type' | 'name' | 'date' | 'size') => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
  resourceFilter: 'all' | 'folders' | 'files';
  setResourceFilter: (filter: 'all' | 'folders' | 'files') => void;
  localSearch: string;
  setLocalSearch: (query: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      selectedFileIds: [],
      toggleFileSelection: (id) => set((state) => {
        const isSelected = state.selectedFileIds.includes(id);
        return {
          selectedFileIds: isSelected
            ? state.selectedFileIds.filter(fId => fId !== id)
            : [...state.selectedFileIds, id]
        };
      }),
      clearFileSelection: () => set({ selectedFileIds: [] }),

      viewMode: 'grid',
      setViewMode: (mode) => set({ viewMode: mode }),

      sortField: 'type',
      setSortField: (sortField) => set({ sortField }),
      sortOrder: 'asc',
      setSortOrder: (sortOrder) => set({ sortOrder }),

      resourceFilter: 'all',
      setResourceFilter: (resourceFilter) => set({ resourceFilter }),

      localSearch: "",
      setLocalSearch: (localSearch) => set({ localSearch }),
    }),
    {
      name: 'dataroom-storage',
      partialize: (state) => ({
        viewMode: state.viewMode,
        sortField: state.sortField,
        sortOrder: state.sortOrder,
        resourceFilter: state.resourceFilter,
      }),
    }
  )
);