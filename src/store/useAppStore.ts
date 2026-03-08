import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  selectedResources: string[];
  toggleResourceSelection: (guid: string) => void;
  clearResourceSelection: () => void;
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
  isBulkMode: boolean;
  setBulkMode: (val: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: (theme) => set({ theme }),

      sidebarOpen: typeof window !== 'undefined' ? window.innerWidth >= 1440 : true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      selectedResources: [],
      toggleResourceSelection: (guid) => set((state) => {
        const isSelected = state.selectedResources.includes(guid);
        return {
          selectedResources: isSelected
            ? state.selectedResources.filter(g => g !== guid)
            : [...state.selectedResources, guid]
        };
      }),
      clearResourceSelection: () => set({ selectedResources: [] }),

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

      isBulkMode: false,
      setBulkMode: (isBulkMode) => set((state) => ({
        isBulkMode,
        selectedResources: isBulkMode ? state.selectedResources : []
      })),
    }),
    {
      name: 'dataroom-storage',
      partialize: (state) => ({
        theme: state.theme,
        viewMode: state.viewMode,
        sortField: state.sortField,
        sortOrder: state.sortOrder,
        resourceFilter: state.resourceFilter,
      }),
    }
  )
);