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
    }),
    {
      name: 'dataroom-storage',
      partialize: (state) => ({ viewMode: state.viewMode }),
    }
  )
);